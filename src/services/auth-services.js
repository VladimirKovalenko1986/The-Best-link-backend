import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../db/models/User.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { Sessions } from '../db/models/Session.js';
import createSession from './createSession.js';

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
  await Sessions.deleteOne({ _id: sessionId });
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

  //   await Sessions.deleteOne({ _id: sessionId, refreshToken });

  //   return await Sessions.create({
  //     userId: session.userId,
  //     ...newSession,
  //   });

  // * Для паралельного застосування

  await Promise.all([
    Sessions.deleteOne({ _id: sessionId, refreshToken }),
    Sessions.create({
      userId: session.userId,
      ...newSession,
    }),
  ]);

  return newSession;
};

export { registerUser, loginUser, logoutUser, refreshUsersSession };
