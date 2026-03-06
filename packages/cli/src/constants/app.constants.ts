import packageJson from "../../package.json";
import { env } from "../configs/env.config";

//? Set SERVERCN_URL in .env for local development
export const SERVERCN_URL = env.SERVERCN_URL;

export const SERVERCN_CONFIG_FILE = "servercn.config.json" as const;

export const APP_NAME = "ServerCN";

export const LATEST_VERSION = packageJson.version || "1.0.0";

export const RuntimeList = ["node"] as const;

export const FrameworkList = ["express", "nestjs"] as const;

export const LanguageList = ["typescript"] as const;

export const ArchitectureList = ["mvc", "feature", "modular"] as const;

export const DatabaseList = ["mongodb", "postgresql", "mysql"] as const;

export const OrmList = ["mongoose", "drizzle"] as const;

export const RegistryTypeList = [
  "component",
  "blueprint",
  "schema",
  "foundation",
  "tooling"
] as const;
