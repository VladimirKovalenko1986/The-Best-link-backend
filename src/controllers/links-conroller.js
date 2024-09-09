import { getAllLinks, getLinkById } from '../services/links-services.js';
import createHttpError from 'http-errors';

const getLinksController = async (req, res) => {
  const result = await getAllLinks();

  res.json({
    status: 200,
    data: result,
    message: 'Success found links',
  });
};

const getLinkByIdController = async (req, res, next) => {
  const { linkById } = req.params;
  const result = await getLinkById(linkById);

  if (!result) {
    throw createHttpError(404, `Link width id=${linkById} not found`);
  }

  res.json({
    status: 200,
    data: result,
    message: `Link width id=${linkById} find success`,
  });
};

export { getLinksController, getLinkByIdController };
