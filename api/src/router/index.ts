import { Router } from 'express';
import { recommendationRouter } from '../controllers/RecommendationController.js';
import { authRouter } from '../controllers/AuthController.js';

export const router = Router();

router.use('/health', recommendationRouter);
router.use('/recommendations', recommendationRouter);
router.use('/auth', authRouter);
