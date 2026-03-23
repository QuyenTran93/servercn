# Servercn

Servercn is a component registry for building Node.js backends by composition.

> The shadcn/ui philosophy for Node.js backends

Visit [Servercn](https://servercn.vercel.app) for more information.

[GitHub Link](https://github.com/akkaldhami/servercn)

---

## Installation

```bash
npx servercn-cli init
```

### `express-starter`: foundation vs `add`

The **`express-starter`** foundation is a **single template snapshot**: it already includes the core Express stack (middleware, health routes, Swagger wiring, shared utils, and more) as **copied files**. `init` does **not** run a sequence of `add` commands behind the scenes.

After `init`, use `add` to pull in **additional** components, or to **refresh wiring** for merge-capable slugs (see `--merge` below). Empty `// @servercn:begin|end <slug>` regions in the foundation exist so `add <slug> --merge` can splice registry wiring without touching the rest of the file.

### Starter ↔ overlapping component paths (skip / half-apply)

Some registry components ship files under the **same paths** as `express-starter`. Default `add` **skips** existing files, so imports or routes from the template may never run — use **`add <slug> --merge`** for merge-capable slugs, or **`--force`** only if you accept overwrites.

| Starter area (typical path) | Overlaps with component slugs / notes |
|-----------------------------|----------------------------------------|
| `src/utils/async-handler.ts` | `async-handler` (merge wiring targets `src/app.ts` or `src/routes/index.ts`; util file may still skip) |
| Swagger (`src/configs/swagger.ts`, `swagger.config.ts`, docs) | `swagger-docs` |
| `src/utils/shutdown.ts` (or `shared/...`) | `shutdown-handler` |
| `src/utils/api-response.ts` | `response-formatter` |
| `src/middlewares/error-handler.ts`, `not-found-handler` | Many stacks; several components bundle their own copies |

Merge-capable Express slugs and file targets are listed in the table below and defined in `src/constants/express-merge-slots.ts`.

## Existing projects: upgrades & template drift

`init` copies a **snapshot** of a foundation and registry at that moment. When you bump `servercn-cli` or we publish new templates, your repo is **not** auto-updated.

| What changed upstream | What to do in an already-initialized project |
|------------------------|---------------------------------------------|
| CLI only (bugfixes, logging) | Usually **nothing** unless you rely on a specific fix. |
| Registry / templates (new files, `@servercn` markers, `--merge` wiring, moved paths) | Read **release notes**; then **patch manually** from docs, run `add <slug> --merge` (after markers exist), use `add --force` if you accept overwrites, or **create a new project** and port code. |
| Foundation (e.g. `express-starter` layout) | **No automatic sync.** Compare diffs manually, or scaffold a new project and migrate. |

Run **`npx servercn-cli doctor`** in your project for a short checklist and optional checks for merge markers (Express starters with merge-capable components).

## Add Components

Add specific modules to your existing project. This allows for incremental adoption.

```bash
npx servercn-cli add [component-name]
```

Add multiple components like this:

```bash
npx servercn-cli add logger jwt-utils
```

### After `init` with an Express foundation: prefer `--merge` for wiring

If your project used **Express** from any starter that ships merge markers (same layout as `express-starter`: see `EXPRESS_MERGE_FOUNDATIONS` in `express-merge-slots.ts`) and the component slug supports merge (`rate-limiter`, `security-header`, `async-handler`, `request-validator`, `verify-auth-middleware`, `oauth`, `rbac`, `jwt-utils`, `file-upload`), run:

```bash
npx servercn-cli add <slug> --merge
```

so wiring is inserted inside the marked regions. Using plain `add` may **skip** files that already exist from the starter and leave the component incomplete. Use **`--force`** only when you intentionally want registry files to overwrite yours.

### Scaffold: `--force` vs `--merge`

By default, `add` **skips** files that already exist so your edits are preserved. That can leave a component half-applied when templates share paths with your foundation.

- **`--force` (`-f`)** replaces every conflicting file with the template from the registry. You may lose local changes; run lint/typecheck afterward.
- **`--merge`** applies **merge-only** template files: they must be a single pair of lines  
  `// @servercn:begin <slug>` … `// @servercn:end <slug>`  
  The CLI replaces **only** the inner region in the existing file. Your code **outside** those markers stays intact.

**Components with merge wiring in the registry (`oauth` maps to provider markers):**

Maintainers: the matrix below is defined in code as `EXPRESS_MERGE_SLOTS` in [`src/constants/express-merge-slots.ts`](./src/constants/express-merge-slots.ts). Update that file, **every** foundation in `EXPRESS_MERGE_FOUNDATIONS`, component merge fragments, and this table together.

| Slug | Merge target (typical) |
|------|-------------------------|
| `rate-limiter` | `src/app.ts` |
| `security-header` | `src/app.ts` |
| `async-handler` | `src/app.ts` (MVC) or `src/routes/index.ts` (feature architecture) |
| `request-validator` | `src/app.ts` (MVC) or `src/routes/index.ts` (feature architecture) |
| `verify-auth-middleware` | `src/app.ts` (MVC) or `src/routes/index.ts` (feature architecture) |
| `oauth` | `src/configs/env.ts` (MVC) or `src/shared/configs/env.ts` (feature), markers `oauth-google` / `oauth-github` (variant-aware) |
| `rbac` | `src/app.ts` (MVC) or `src/routes/index.ts` (feature) for route wiring, plus env paths (`src/configs/env.ts` or `src/shared/configs/env.ts`), marker `rbac` |
| `jwt-utils` | same env paths, marker `jwt-utils` |
| `file-upload` | same env paths, markers `file-upload-cloudinary` or `file-upload-imagekit` (variant-aware) |

Those Express foundations ship **empty** marker blocks for these slugs where needed. Older projects must add the same blocks manually (or use `--force`).

`--merge` is **ignored** when `--force` is set.

```bash
npx servercn-cli add rate-limiter --merge
npx servercn-cli add security-header --merge
npx servercn-cli add async-handler --merge
npx servercn-cli add request-validator --merge
npx servercn-cli add verify-auth-middleware --merge
npx servercn-cli add oauth --merge
npx servercn-cli add rbac --merge
npx servercn-cli add jwt-utils --merge
npx servercn-cli add file-upload --merge
```

For OAuth variant-aware env merge, legacy projects that only have `// @servercn:begin oauth` must migrate markers to `oauth-google` / `oauth-github` first (`doctor` warns; no auto-convert).

From this package: `npm run test:merge-marker` (merge helper), `npm run test:express-merge-foundation` (foundation markers), `npm run test:express-merge-slugs` (slug registry). Or run `npm run test:express-merge-all` for all three. From the monorepo root: `npm run test:cli-express-merge`.

Visit [Servercn](https://servercn.vercel.app) for more information.
