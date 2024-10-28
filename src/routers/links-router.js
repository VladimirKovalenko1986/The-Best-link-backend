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
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getLinksController));

router.get('/:linkId', isValidId, ctrlWrapper(getLinkByIdController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createLinkSchema),
  ctrlWrapper(createLinkController),
);

router.delete('/:linkId', isValidId, ctrlWrapper(deleteLinkController));

router.put(
  '/:linkId',
  upload.single('photo'),
  isValidId,
  validateBody(updateLinkSchema),
  ctrlWrapper(upsertLinkController),
);

router.patch(
  '/:linkId',
  upload.single('photo'),
  isValidId,
  validateBody(updateLinkSchema),
  ctrlWrapper(patchLinkController),
);

export default router;
