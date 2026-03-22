import { Router } from "express";
import HealthRouter from "../modules/health/health.routes";

const router = Router();

router.use("/health", HealthRouter);

// @servercn:begin request-validator

// @servercn:end request-validator

// @servercn:begin async-handler

// @servercn:end async-handler

// @servercn:begin verify-auth-middleware

// @servercn:end verify-auth-middleware

export default router;
