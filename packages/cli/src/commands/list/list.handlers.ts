import { SERVERCN_URL } from "@/constants/app.constants";
import { loadRegistryItems } from "@/lib/registry-list";

import type { RegistryData, RegistryType } from "@/types";
import { highlighter } from "@/utils/highlighter";
import { logger } from "@/utils/logger";

export type listOptionType = {
  json?: boolean;
  all?: boolean;
  local?: boolean;
};

type listOverviewType = {
  command: string;
  types: {
    type: RegistryType;
    alias: "cp" | "bp" | "tl" | "sc" | "fd";
    total: number;
    command: string;
  }[];
};

function padStart(num: number = 0) {
  return num.toString().padStart(2, "0");
}

export async function listOverview(options: listOptionType) {
  const components = await loadRegistryItems("component", options.local);
  const blueprints = await loadRegistryItems("blueprint", options.local);
  const foundations = await loadRegistryItems("foundation", options.local);
  const toolings = await loadRegistryItems("tooling", options.local);
  const schemas = await loadRegistryItems("schema", options.local);

  if (options.all) {
    return await getRegistryLists("blueprint", options);
  }

  const data: listOverviewType = {
    command: "npx servercn-cli list <type>",
    types: [
      {
        type: "component",
        alias: "cp",
        total: components.length,
        command: "npx servercn-cli list cp"
      },
      {
        type: "blueprint",
        alias: "bp",
        total: blueprints.length,
        command: "npx servercn-cli list bp"
      },
      {
        type: "foundation",
        alias: "fd",
        total: foundations.length,
        command: "npx servercn-cli list fd"
      },
      {
        type: "tooling",
        alias: "tl",
        total: toolings.length,
        command: "npx servercn-cli list tl"
      },
      {
        type: "schema",
        alias: "sc",
        total: schemas.length,
        command: "npx servercn-cli list sc"
      }
    ]
  };

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  logger.break();
  logger.info("ServerCN Registry Overview");
  console.log(
    `${highlighter.create(`
───────────────────────────────────────────────────────────
│ Type         │ alias    │ Total │ Command                │
───────────────────────────────────────────────────────────
│ Components   │   cp     │  ${padStart(components.length)}   │ npx servercn-cli ls cp │ 
│ Blueprints   │   bp     │  ${padStart(blueprints.length)}   │ npx servercn-cli ls bp │
│ Foundations  │   fd     │  ${padStart(foundations.length)}   │ npx servercn-cli ls fd │
│ Tooling      │   tl     │  ${padStart(toolings.length)}   │ npx servercn-cli ls tl │
│ Schemas      │   sc     │  ${padStart(schemas.length)}   │ npx servercn-cli ls sc │
───────────────────────────────────────────────────────────`)}`
  );
  logger.log(`
 Explore:
 npx servercn-cli ls <type | alias>
 npx servercn-cli ls <type | alias> --json

 Examples:
 npx servercn-cli ls component
 npx servercn-cli ls cp
 npx servercn-cli ls foundation
 npx servercn-cli ls fd --json
 npx servercn-cli ls schema
 npx servercn-cli ls sc --json
`);
}

type listRegistryDataType = {
  type: RegistryType;
  command: string;
  total: number;
  alias?: "cp" | "bp" | "fd" | "tl" | "sc";
  items: {
    name: string;
    command: string;
  }[];
};

export async function listComponents(options: listOptionType) {
  const components: RegistryData[] = await loadRegistryItems(
    "component",
    options.local
  );
  const data = {
    type: "component",
    command: `npx servercn-cli add <component-name>`,
    total: components.length,
    items: components.map(c => ({
      name: c.slug,
      command: `npx servercn-cli add ${c.slug}`
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  logger.break();
  logger.info("Available Components");
  components.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn-cli add <component-name>`);
  logger.muted(` Ex: npx servercn-cli add email-service`);
  logger.muted(` Ex: npx servercn-cli add async-handler jwt-utils`);
  logger.log(` Learn more: ${SERVERCN_URL}/components`);
  logger.break();
}

export async function listFoundations(options: listOptionType) {
  const foundations = await loadRegistryItems("foundation", options.local);

  const data = {
    type: "foundation",
    command: `npx servercn-cli init <foundation-name>`,
    total: foundations.length,
    items: foundations
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(c => ({
        name: c.slug,
        command: `npx servercn-cli init ${c.slug}`
      }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  logger.break();
  logger.info("Available Foundations");
  foundations.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn-cli init <foundation-name>`);
  logger.muted(` Ex: npx servercn-cli init express-server`);
  logger.muted(` Ex: npx servercn-cli init drizzle-mysql-starter`);
  logger.muted(` Ex: npx servercn-cli init drizzle-pg-starter`);
  logger.muted(` Ex: npx servercn-cli init mongoose-starter`);
  logger.log(` Learn more: ${SERVERCN_URL}/foundations`);
  logger.break();
}

export async function listTooling(options: listOptionType) {
  const toolings = await loadRegistryItems("tooling", options.local);

  const data = {
    type: "tooling",
    alias: "tl",
    command: `npx servercn-cli add tooling <tooling-name>`,
    total: toolings.length,
    items: toolings.map(c => ({
      name: c.slug,
      command: `npx servercn-cli add tl ${c.slug}`
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  logger.break();
  logger.info("Available Tooling");
  toolings.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn-cli add tl <tooling-name>`);
  logger.muted(` Ex: npx servercn-cli add tl commitlint`);
  logger.muted(` Ex: npx servercn-cli add tl prettier`);
  logger.muted(` Ex: npx servercn-cli add tl lint-staged`);
  logger.muted(` Ex: npx servercn-cli add tl eslint husky typescript `);
  logger.log(` Learn more: ${SERVERCN_URL}/docs`);
  logger.break();
}

export async function listSchemas(options: listOptionType) {
  const schemas = await loadRegistryItems("schema", options.local);

  const data = {
    type: "schema",
    alias: "sc",
    command: `npx servercn-cli add schema <schema-name>`,
    total: schemas.length,
    items: schemas
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(c => ({
        name: c.slug,
        command: `npx servercn-cli add sc ${c.slug}`
      }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }
  logger.break();
  logger.info("Available Schemas");

  schemas.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn-cli add schema <schema-name>`);
  logger.muted(` Ex: npx servercn-cli add sc auth`);
  logger.muted(` Ex: npx servercn-cli add sc auth/user`);
  logger.log(` Learn more: ${SERVERCN_URL}/schemas`);
  logger.break();
}

export async function listBlueprints(options: listOptionType) {
  const blueprints = await loadRegistryItems("blueprint", options.local);

  const data = {
    type: "blueprint",
    alias: "bp",
    command: `npx servercn-cli add blueprint <blueprint-name>`,
    total: blueprints.length,
    items: blueprints.map(c => ({
      name: c.slug,
      command: `npx servercn-cli add bp ${c.slug}`
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  logger.break();
  logger.info("Available Blueprints");
  blueprints.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn-cli add blueprint <blueprint-name>`);
  logger.muted(` Ex: npx servercn-cli add bp stateless-auth`);
  logger.log(` Learn more: ${SERVERCN_URL}/blueprints`);
  logger.break();
}

export async function getRegistryLists(
  type: RegistryType,
  options?: listOptionType
) {
  if (options?.all && options.json) {
    await listComponents({ json: true, local: options.local });
    await listSchemas({ json: true, local: options.local });
    await listBlueprints({ json: true, local: options.local });
    await listTooling({ json: true, local: options.local });
    await listFoundations({ json: true, local: options.local });
  } else if (options?.all) {
    await listComponents({ json: false, local: options.local });
    await listSchemas({ json: false, local: options.local });
    await listBlueprints({ json: false, local: options.local });
    await listTooling({ json: false, local: options.local });
    await listFoundations({ json: false, local: options.local });
  } else {
    switch (type) {
      case "component":
        return await listComponents(options ?? { json: false });
      case "blueprint":
        return await listBlueprints(options ?? { json: false });
      case "schema":
        return await listSchemas(options ?? { json: false });
      case "tooling":
        return listTooling(options ?? { json: false });
      case "foundation":
        return await listFoundations(options ?? { json: false });

      default:
        return await listComponents(options ?? { json: false });
    }
  }
}
