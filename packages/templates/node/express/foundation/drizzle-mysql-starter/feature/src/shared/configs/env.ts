import "dotenv-flow/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),

  DATABASE_URL: z.url(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  CORS_ORIGIN: z.string().optional(),

  // @servercn:begin oauth-google
  // @servercn:end oauth-google

  // @servercn:begin oauth-github
  // @servercn:end oauth-github

  // @servercn:begin rbac
  // @servercn:end rbac

  // @servercn:begin jwt-utils
  // @servercn:end jwt-utils

  // @servercn:begin file-upload-cloudinary
  // @servercn:end file-upload-cloudinary

  // @servercn:begin file-upload-imagekit
  // @servercn:end file-upload-imagekit
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const env: Readonly<Env> = Object.freeze(result.data);

export default env;
