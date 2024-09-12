import { Link } from '../db/models/Link.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

const getAllLinks = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const linksQuery = Link.find();
  const linksCount = await Link.find().merge(linksQuery).countDocuments();

  const links = await linksQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(linksCount, perPage, page);

  return {
    data: links,
    ...paginationData,
  };
};

const getLinkById = (linkId) => Link.findById(linkId);

const createLink = async (payload) => Link.create(payload);

const deleteLink = (linkId) =>
  Link.findOneAndDelete({
    _id: linkId,
  });

const updateLink = async (linkId, payload, options = {}) => {
  const rawResult = await Link.findOneAndUpdate({ _id: linkId }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    link: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export { getAllLinks, getLinkById, createLink, deleteLink, updateLink };
