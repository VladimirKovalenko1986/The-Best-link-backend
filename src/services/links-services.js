import { Link } from '../db/models/Link.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

const getAllLinks = async ({
  page = 1,
  perPage = 5,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const linksQuery = Link.find();

  if (filter.userId) {
    linksQuery.where('userId').equals(filter.userId);
  }

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

const getLink = (filter) => Link.findOne(filter);

const createLink = async (payload) => Link.create(payload);

const deleteLink = (linkId) =>
  Link.findOneAndDelete({
    _id: linkId,
  });

const updateLink = async (query, payload, options = {}) => {
  const rawResult = await Link.findOneAndUpdate(query, payload, {
    new: true,
    ...options,
  });

  if (!rawResult) return null;

  return {
    link: rawResult,
    isNew: Boolean(options.upsert && !rawResult.isNew),
  };
};

const findById = (id) => Link.findOne(id);

export { getAllLinks, getLink, createLink, deleteLink, updateLink, findById };
