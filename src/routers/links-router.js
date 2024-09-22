import { Router } from 'express';
import {
  getLinksController,
  getLinkByIdController,
  createLinkController,
  deleteLinkController,
  upsertLinkController,
  patchLinkController,
} from '../controllers/links-conroller.js';
import validateBody from '../middlewares/validateBody.js';
import { createLinkSchema, updateLinkSchema } from '../validation/links.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getLinksController));

router.get('/:linkId', isValidId, ctrlWrapper(getLinkByIdController));

router.post(
  '/',
  validateBody(createLinkSchema),
  ctrlWrapper(createLinkController),
);

router.delete('/:linkId', isValidId, ctrlWrapper(deleteLinkController));

router.put(
  '/:linkId',
  isValidId,
  validateBody(updateLinkSchema),
  ctrlWrapper(upsertLinkController),
);

router.patch(
  '/:linkId',
  isValidId,
  validateBody(updateLinkSchema),
  ctrlWrapper(patchLinkController),
);

export default router;
