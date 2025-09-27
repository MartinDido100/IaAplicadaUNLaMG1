import { Router } from "express";
import { authRouter } from "../controllers/authController.js";
import { recommendationRouter } from "../controllers/recommendationController.js";
import { withAuth } from "../utils/auth.js";

export const router = Router();

router.use("/health", recommendationRouter);
router.use("/recommendations", withAuth, recommendationRouter);
router.use("/auth", authRouter);
