import { Link } from '../db/models/Link.js';

const getAllLinks = () => Link.find();

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
