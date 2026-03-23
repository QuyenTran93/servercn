# Express component templates

Templates under this folder are copied (or merged) when users run `add <slug>`.

## Merge-capable components (tier 1)

These slugs use **`add <slug> --merge`**: the registry includes at least one **merge-only** file — only a `// @servercn:begin <slug>` … `// @servercn:end <slug>` block whose inner body is spliced into the user’s existing file. The CLI must not nest another `@servercn:begin` inside that block (`isMergeOnlyFragment`).

| Slug | Merge fragment location (relative to `mvc/` or `feature/` in the component) |
|------|-----------------------------------------------------------------------------|
| `rate-limiter` | `src/app.ts` |
| `security-header` | `src/app.ts` |
| `async-handler` | `src/app.ts` (MVC) · `src/routes/index.ts` (feature) |
| `request-validator` | `src/app.ts` (MVC) · `src/routes/index.ts` (feature) |
| `verify-auth-middleware` | `src/app.ts` (MVC) · `src/routes/index.ts` (feature) |

**Source of truth** for which file is checked by `doctor` and expected on `express-starter`:  
`packages/cli/src/constants/express-merge-slots.ts`.

Each tier-1 component also ships **ordinary** files (middlewares, routes, tests, etc.) that copy like any other component when paths do not exist or when using `--force`.

## Copy-only components (tier 2)

All other folders here are **copy-only** for `add`: no merge-only wiring unless you promote them to tier 1 (add slots to `express-starter`, `EXPRESS_MERGE_SLOTS`, merge fragment, docs, and foundation selftest).

## Conventions

- **Marker id** equals **registry slug** for tier 1.
- Prefer **one merge fragment per slug per target file** so `applyMarkerMerge` replaces a single region.
- After changing tier-1 layout, run from `packages/cli`: `npm run test:express-merge-foundation`.
