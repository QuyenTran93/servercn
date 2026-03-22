import { Router } from "express";
import HealthRouter from "../modules/health/health.routes";

const router = Router();

router.use("/health", HealthRouter);

// @servercn:begin async-handler

// @servercn:end async-handler

export default router;
