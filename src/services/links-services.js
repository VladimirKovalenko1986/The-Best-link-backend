import { Link } from '../db/models/Link.js';

const getAllLinks = () => Link.find();

const getLinkById = (linkById) => Link.findById(linkById);

const createLink = async (payload) => {
  const link = await Link.create(payload);
  return link;
};

const deleteLink = async (linkId) => {
  const link = await Link.findOneAndDelete({
    _id: linkId,
  });

  return link;
};

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
