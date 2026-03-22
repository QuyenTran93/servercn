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

## Add Components

Add specific modules to your existing project. This allows for incremental adoption.

```bash
npx servercn-cli add [component-name]
```

Add multiple components like this:

```bash
npx servercn-cli add logger jwt-utils
```

### Scaffold: `--force` vs `--merge`

By default, `add` **skips** files that already exist so your edits are preserved. That can leave a component half-applied when templates share paths with your foundation.

- **`--force` (`-f`)** replaces every conflicting file with the template from the registry. You may lose local changes; run lint/typecheck afterward.
- **`--merge`** applies **merge-only** template files: they must be a single pair of lines  
  `// @servercn:begin <slug>` … `// @servercn:end <slug>`  
  The CLI replaces **only** the inner region in the existing file. Your code **outside** those markers stays intact.

**Components with merge wiring in the registry (slug = marker id):**

| Slug | Merge target (typical) |
|------|-------------------------|
| `rate-limiter` | `src/app.ts` |
| `security-header` | `src/app.ts` |
| `async-handler` | `src/app.ts` (MVC) or `src/routes/index.ts` (feature architecture) |

The `express-starter` foundation ships **empty** marker blocks for these slugs where needed. Older projects must add the same blocks manually (or use `--force`).

`--merge` is **ignored** when `--force` is set.

```bash
npx servercn-cli add rate-limiter --merge
npx servercn-cli add security-header --merge
npx servercn-cli add async-handler --merge
```

Run `npm run test:merge-marker` in this package to verify the marker merge helper.

Visit [Servercn](https://servercn.vercel.app) for more information.
