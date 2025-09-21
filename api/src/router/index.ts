import { Router } from "express";
import { authRouter } from "../controllers/authController.js";
import { recommendationRouter } from "../controllers/recommendationController.js";

export const router = Router();

router.use("/health", recommendationRouter);
router.use("/recommendations", recommendationRouter);
router.use("/auth", authRouter);
