import Joi from 'joi';
import { authEmailFormate } from '../constants/index.js';

const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(authEmailFormate).required(),
  password: Joi.string().min(6).required(),
  photo: Joi.string().optional(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().pattern(authEmailFormate).required(),
  password: Joi.string().min(6).required(),
});

const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(authEmailFormate).required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});

export {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
};
