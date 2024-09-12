import {
  getAllLinks,
  getLinkById,
  createLink,
  deleteLink,
  updateLink,
} from '../services/links-services.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import createHttpError from 'http-errors';

const getLinksController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const result = await getAllLinks({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    data: result,
    message: 'Success found links',
  });
};

const getLinkByIdController = async (req, res, next) => {
  const { linkId } = req.params;
  const result = await getLinkById(linkId);

  if (!result) {
    throw createHttpError(404, `Link width id=${linkId} not found`);
  }

  res.json({
    status: 200,
    data: result,
    message: `Link width id=${linkId} find success`,
  });
};

const createLinkController = async (req, res) => {
  const result = await createLink(req.body);

  res.json({
    status: 201,
    message: 'Successfully created a link!',
    data: result,
  });
};

const deleteLinkController = async (req, res, next) => {
  const { linkId } = req.params;

  const result = await deleteLink(linkId);

  if (!result) {
    next(createHttpError(404, `Link ${linkId} not found`));
    return;
  }

  res.json({
    status: 204,
    messag: `Link ${linkId} delete`,
    data: result,
  });
};

const upsertLinkController = async (req, res, next) => {
  const { linkId } = req.params;

  const result = await updateLink(linkId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, `Link ${linkId} not found`));
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
  const { linkId } = req.params;
  const result = await updateLink(linkId, req.body);

  if (!result) {
    next(createHttpError(404, `Link ${linkId} not found`));
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
