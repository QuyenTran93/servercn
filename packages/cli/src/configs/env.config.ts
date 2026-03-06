import { z } from "zod";

import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({
  path: path.resolve(`${__dirname}/../.env`),
  quiet: true
});

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  SERVERCN_SILENT: z.string().default("true"),
  LOG_LEVEL: z.string().default("info"),
  SERVERCN_URL: z.string().regex(/^http?:\/\/.+/).default("https://servercn.vercel.app")
});
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.prettifyError(parsed.error),
  );
  process.exit(1);
}

export const env = parsed.data;
