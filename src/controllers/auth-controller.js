import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
} from '../services/auth-services.js';
import { ONE_DAY } from '../constants/index.js';
import createHttpError from 'http-errors';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import saveFileToUploadsDir from '../utils/saveFileToUploadsDir.js';
import saveFileToCloudinary from '../utils/saveFIleToCloudinary.js';
import { User } from '../db/models/User.js';
import env from '../utils/env.js';

const enable_cloudinary = env('ENABLE_CLOUDINARY');

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true, // ✅ Render вимагає secure=true для SameSite=None
    sameSite: 'None', // ✅ Інакше браузер не зберігатиме куки між доменами
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: new Date(Date.now() + ONE_DAY),
  });
};

const registerUserController = async (req, res, next) => {
  let photo = '';

  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToUploadsDir(req.file, 'photo');
    }
  }

  const user = await registerUser({ ...req.body, photo });

  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const loginUserController = async (req, res, next) => {
  const { user, session } = await loginUser(req.body);

  if (!session) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user: {
        name: user.name,
        email: user.email,
        photo: user.photo || null,
      },
      accessToken: session.accessToken,
    },
  });
};

const logoutUserController = async (req, res) => {
  if (!req.cookies.sessionId) {
    return res.status(401).json({ message: 'Session not found' });
  }

  await logoutUser(req.cookies.sessionId);

  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true, // ⚡️ Потрібно для Render
    sameSite: 'None',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });

  res.status(204).send();
};

const refreshUserSessionController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies; // ✅ Отримуємо `refreshToken` і `sessionId` з cookies

  if (!refreshToken || !sessionId) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  // 🔄 Оновлюємо сесію
  const session = await refreshUsersSession({
    sessionId,
    refreshToken,
  });

  if (!session) {
    return res
      .status(401)
      .json({ message: 'Invalid session or refresh token' });
  }

  const user = await User.findById(session.userId).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 🔄 Оновлюємо cookies (ставимо новий `sessionId` та `refreshToken`)
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed session!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email was successully sent!',
    status: 200,
    data: {},
  });
};

const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Coogle OAuth url!',
    data: {
      url,
    },
  });
};

const loginWithGoogleController = async (req, res) => {
  const { user, session } = await loginOrSignupWithGoogle(req.body.code);

  if (!session) {
    return res.status(401).json({ message: 'Google login failed' });
  }

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      user,
      accessToken: session.accessToken,
    },
  });
};

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  requestResetEmailController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
};
