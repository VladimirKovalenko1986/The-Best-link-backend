import { linksCollection } from '../db/models/Link.js';

const getAllLinks = async () => {
  try {
    const links = await linksCollection.find();
    console.log('Links from DB:', links); // Додаємо логування
    return links;
  } catch (error) {
    console.error('Error fetching links:', error); // Додаємо обробку помилок
    throw new Error('Failed to fetch links');
  }
};

const getLinkById = async (linkById) => {
  const link = await linksCollection.findById(linkById);
  return link;
};

export { getAllLinks, getLinkById };
