import {
  getAllLinks,
  getLink,
  createLink,
  deleteLink,
  updateLink,
  findById,
} from '../services/links-services.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import createHttpError from 'http-errors';
import saveFileToUploadsDir from '../utils/saveFileToUploadsDir.js';
import saveFileToCloudinary from '../utils/saveFIleToCloudinary.js';
import env from '../utils/env.js';

const enable_cloudinary = env('ENABLE_CLOUDINARY');

const getLinksController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = { ...parseFilterParams(req.query), userId };

  const result = await getAllLinks({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    data: result,
    message: 'Success found links',
  });
};

const getLinkByIdController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { linkId: _id } = req.params;
  const result = await getLink({ _id, userId });

  if (!result) {
    throw createHttpError(404, `Link width id=${_id} not found`);
  }

  res.json({
    status: 200,
    data: result,
    message: `Link width id=${_id} find success`,
  });
};

const createLinkController = async (req, res, next) => {
  const { _id: userId } = req.user;
  let poster = '';

  //* Це необхідно якщо файли зберігаються на сервері
  // if (req.file) {
  //   poster = await saveFileToUploadsDir(req.file, 'posters');
  // }

  if (req.file) {
    if (enable_cloudinary === 'true') {
      poster = await saveFileToCloudinary(req.file, 'posters');
    } else {
      poster = await saveFileToUploadsDir(req.file, 'posters');
    }
  }

  const result = await createLink({ ...req.body, userId, poster });

  if (!result) {
    return next(createHttpError(404, 'Link not found'));
  }

  res.json({
    status: 201,
    message: 'Successfully created a link!',
    data: result,
  });
};

const deleteLinkController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { linkId: _id } = req.params;

  const result = await deleteLink({ _id, userId });

  if (!result) {
    next(createHttpError(404, `Link ${_id} not found`));
    return;
  }

  res.json({
    status: 204,
    message: `Link ${_id} delete`,
    data: result,
  });
};

const upsertLinkController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { linkId: _id } = req.params;

  const existingLink = await findById({ _id, userId });

  if (!existingLink) {
    return next(createHttpError(404, `Link with id ${_id} does not exist`));
  }

  const result = await updateLink({ _id, userId }, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, `Link ${_id} not found`));
    return;
  }

  const status = result.isNew ? 201 : 200;
  const message = result.isNew ? 'Link success add' : 'Link success update';

  res.json({
    status,
    message,
    data: result.link,
  });
};

const patchLinkController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { linkId: _id } = req.params;
  let poster = '';

  if (req.file) {
    if (enable_cloudinary === 'true') {
      poster = await saveFileToCloudinary(req.file, 'posters');
    } else {
      poster = await saveFileToUploadsDir(req.file, 'posters');
    }
  }

  const existingLink = await findById({ _id, userId });

  if (!existingLink) {
    return next(createHttpError(404, `Link with id ${_id} does not exist`));
  }

  const updateData = { ...req.body };
  if (poster) updateData.poster = poster;

  const result = await updateLink({ _id, userId }, updateData);

  if (!result) {
    next(createHttpError(404, `Link ${_id} not found`));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patch a link!',
    data: result.link,
  });
};

export {
  getLinksController,
  getLinkByIdController,
  createLinkController,
  deleteLinkController,
  upsertLinkController,
  patchLinkController,
};
