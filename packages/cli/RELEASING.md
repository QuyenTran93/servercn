# Releasing `servercn-cli`

## Changelog / release notes checklist

When a version affects scaffolding (templates embedded in the registry, `add`/`init` behavior, `--merge`, foundation files), include an **Existing projects** bullet, for example:

- **Existing projects:** New `@servercn` markers in `src/app.ts` — add the empty blocks from the latest `express-starter` template (or run `npx servercn-cli doctor`) before using `add <slug> --merge`.

If the release is CLI-only (no template/registry artifact change), you can state that no project file changes are required.
