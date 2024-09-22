import { Router } from 'express';
import linksRouter from './links-router.js';
import authRouter from './auth-router.js';

const router = Router();

router.use('/links', linksRouter);
router.use('/auth', authRouter);

export default router;
