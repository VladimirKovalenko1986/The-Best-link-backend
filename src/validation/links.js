import Joi from 'joi';

const createLinkSchema = Joi.object({
  nameType: Joi.string()
    .valid('HTML', 'JS', 'React', 'TS', 'Node.js')
    .required(),
  link: Joi.string().required(),
  nameLink: Joi.string().required(),
  textLink: Joi.string().required(),
});

const updateLinkSchema = Joi.object({
  nameType: Joi.string().valid('HTML', 'JS', 'React', 'TS', 'Node.js'),
  link: Joi.string(),
  nameLink: Joi.string(),
  textLink: Joi.string(),
});

export { createLinkSchema, updateLinkSchema };
