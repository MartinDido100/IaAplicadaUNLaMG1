import { Router } from 'express';
import { recommendationRouter } from '../controllers/RecommendationController.js';

export const router = Router();

router.use('/health', recommendationRouter);