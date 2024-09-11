import createHttpError from 'http-errors';

const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const errorValidate = createHttpError(400, 'Bad request', {
      errors: error.details,
    });
    next(errorValidate);
  }
};

export default validateBody;
