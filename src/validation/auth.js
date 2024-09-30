import Joi from 'joi';
import { authEmailFormate } from '../constants/index.js';

const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(authEmailFormate).required(),
  password: Joi.string().min(6).required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().pattern(authEmailFormate).required(),
  password: Joi.string().min(6).required(),
});

export { registerUserSchema, loginUserSchema };
