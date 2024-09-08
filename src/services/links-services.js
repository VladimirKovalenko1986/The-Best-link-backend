import { Link } from '../db/models/Link.js';

const getAllLinks = () => Link.find();

const getLinkById = (linkById) => Link.findById(linkById);

export { getAllLinks, getLinkById };
