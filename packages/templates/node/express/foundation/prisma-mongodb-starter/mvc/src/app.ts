import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFoundHandler } from "./middlewares/not-found-handler";
import { setupSwagger } from "./configs/swagger";
import { errorHandler } from "./middlewares/error-handler";
import healthRoutes from "./routes/health.routes";
import env from "./configs/env";
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

//? Swagger Setup
setupSwagger(app);

//? Routes
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/health");
});

app.use("/api/health", healthRoutes);

// @servercn:begin rate-limiter

// @servercn:end rate-limiter

// @servercn:begin security-header

// @servercn:end security-header

// @servercn:begin async-handler

// @servercn:end async-handler

// @servercn:begin request-validator

// @servercn:end request-validator

// @servercn:begin verify-auth-middleware

// @servercn:end verify-auth-middleware

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
