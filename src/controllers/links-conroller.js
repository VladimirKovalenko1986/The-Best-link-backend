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

const createLinkController = async (req, res) => {
  const { _id: userId } = req.user;
  const result = await createLink({ ...req.body, userId });

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
  const photo = req.file;

  const existingLink = await findById({ _id, userId });

  if (!existingLink) {
    return next(createHttpError(404, `Link with id ${_id} does not exist`));
  }

  const result = await updateLink({ _id, userId }, req.body);

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
