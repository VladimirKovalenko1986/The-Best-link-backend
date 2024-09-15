import { Link } from '../db/models/Link.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

const getAllLinks = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const linksQuery = Link.find();

  if (filter.nameType) {
    linksQuery.where('nameType').equals(filter.nameType);
  }

  // * Це асинхронний метод
  //   const linksCount = await Link.find().merge(linksQuery).countDocuments();

  //   const links = await linksQuery
  //     .skip(skip)
  //     .limit(limit)
  //     .sort({ [sortBy]: sortOrder })
  //     .exec();

  // * Це синхронний метода
  const [linksCount, links] = await Promise.all([
    Link.find().merge(linksQuery).countDocuments(),
    linksQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

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
