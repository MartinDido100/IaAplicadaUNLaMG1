import { Router } from 'express';
import { recommendationRouter } from '../controllers/recommendationController.js';
import { authRouter } from '../controllers/authController.js';

export const router = Router();

router.use('/health', recommendationRouter);
router.use('/recommendations', recommendationRouter);
router.use('/auth', authRouter);
