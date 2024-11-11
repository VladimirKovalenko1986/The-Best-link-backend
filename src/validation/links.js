import Joi from 'joi';
import { nameType } from '../constants/index.js';

const createLinkSchema = Joi.object({
  nameType: Joi.string()
    .valid(...nameType)
    .required(),
  link: Joi.string().required(),
  nameLink: Joi.string().required(),
  textLink: Joi.string().required(),
  poster: Joi.string().optional(),
});

const updateLinkSchema = Joi.object({
  nameType: Joi.string().valid(...nameType),
  link: Joi.string(),
  nameLink: Joi.string(),
  textLink: Joi.string(),
  poster: Joi.string().optional(),
});

export { createLinkSchema, updateLinkSchema };
