import { Router } from 'express';
import {
  getLinksController,
  getLinkByIdController,
} from '../controllers/links-conroller.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/links', ctrlWrapper(getLinksController));

router.get('/links/:linkById', ctrlWrapper(getLinkByIdController));

export default router;
