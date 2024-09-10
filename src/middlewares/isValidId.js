import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

// Акпквіряємо чи взагалі значення може бути id

const isValidId = (req, res, next) => {
  const { linkId } = req.params;

  if (!isValidObjectId(linkId)) {
    return next(createHttpError(404, `${linkId} not valid id`));
  }
  next();
};

export default isValidId;
