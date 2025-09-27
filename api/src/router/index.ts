import { Router } from "express";
import { authRouter, recommendationRouter } from "../controllers/index.js";
import { withAuth } from "../utils/auth.js";

export const router = Router();

router.use("/health", recommendationRouter);
router.use("/recommendations", withAuth, recommendationRouter);
router.use("/auth", authRouter);
