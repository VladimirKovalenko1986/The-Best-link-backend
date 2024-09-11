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

router.get('/links', ctrlWrapper(getLinksController));

router.get('/links/:linkId', isValidId, ctrlWrapper(getLinkByIdController));

router.post(
  '/links',
  validateBody(createLinkSchema),
  ctrlWrapper(createLinkController),
);

router.delete('/links/:linkId', isValidId, ctrlWrapper(deleteLinkController));

router.put(
  '/links/:linkId',
  isValidId,
  validateBody(updateLinkSchema),
  ctrlWrapper(upsertLinkController),
);

router.patch(
  '/links/:linkId',
  isValidId,
  validateBody(updateLinkSchema),
  ctrlWrapper(patchLinkController),
);

export default router;
