import { Router } from 'express';
import {
  getLinksController,
  getLinkByIdController,
  createLinkController,
  deleteLinkController,
  upsertLinkController,
  patchLinkController,
} from '../controllers/links-conroller.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/links', ctrlWrapper(getLinksController));

router.get('/links/:linkById', ctrlWrapper(getLinkByIdController));

router.post('/links', ctrlWrapper(createLinkController));

router.delete('/links/:linkId', ctrlWrapper(deleteLinkController));

router.put('/links/:linkId', ctrlWrapper(upsertLinkController));

router.patch('/links/:linkId', ctrlWrapper(patchLinkController));

export default router;
