import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../db/models/User.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { Sessions } from '../db/models/Session.js';

const registerUser = async (payload) => {
  const user = await User.findOn({
    email: payload.email,
  });

  if (user) {
    throw createHttpError(409, `${payload.email} is use`);
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

  const isEnqual = await bcrypt.compare(payload.password, user.password);

  if (!isEnqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Sessions.deleteOne({
    userId: user._id,
  });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await Sessions.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export { registerUser, loginUser };
