import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { User } from '../db/models/User.js';
import createHttpError from 'http-errors';
import { Sessions } from '../db/models/Session.js';
import createSession from './createSession.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import env from '../utils/env.js';
import sendEmail from '../utils/sendMail.js';

const registerUser = async (payload) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (user) {
    throw createHttpError(409, `${payload.email} is already in use`);
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

const loginUser = async (payload) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Sessions.deleteOne({
    userId: user._id,
  });

  const newSession = createSession();

  return await Sessions.create({
    userId: user._id,
    ...newSession,
  });
};

const logoutUser = async (sessionId) => {
  const result = await Sessions.deleteOne({ _id: sessionId });

  if (result.deletedCount === 0) {
    throw createHttpError(401, 'Session not found');
  }
};

const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Sessions.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  const createdSession = await Sessions.create({
    userId: session.userId,
    ...newSession,
  });

  await Sessions.deleteOne({ _id: sessionId, refreshToken });

  return createdSession;
};

const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplePath)
  ).toString();

  // Другий варіант
  //   await fs.readFile(resetPasswordTemplePath, 'utf-8');

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encriptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encriptedPassword });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
};
