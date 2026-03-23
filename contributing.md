# Contributing to ServerCN

First off all, thank you for considering contributing to ServerCN! It's people like you that make ServerCN such a great tool for the community.

For detail contributing roadmap, visit [ServerCN](https://servercn-vercel.vercel.app/contributing)

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **npm**: We use `npm` as our package manager and for running workspaces.

### Installation

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/servercn.git
cd servercn
```

3. **Install dependencies**:

```bash
npm install
```

## 🏗️ Project Structure

This project is a monorepo managed with **npm workspaces**.

- `apps/web`: The documentation website (Next.js).
- `packages/cli`: The core CLI tool source code.
- `packages/registry`: The registry of components and templates.
- `packages/templates`: Boilerplate code specific to different architectures/stacks.

## 💻 Development Workflow

### 1. Working on the CLI

To test the CLI changes locally, you can link the package or use the build commands.

```bash
# Build the CLI package
npm run build:cli

# Link the CLI globally to test 'servercn' command
npm run link:cli

# Run development server
npm run dev:app
```

Now you can run `servercn` in any terminal to test your changes.

### 2. Working on the Documentation (Apps/Web)

To run the Next.js documentation site:

```bash
# Navigate to web app
cd apps/web

# Run development server
npm run dev
```

### 3. Adding/Modifying Components

Components are located in `packages/registry`.

- **Definition**: Update the JSON definition in `packages/registry/`.
- **Code**: Update the actual source code templates in `packages/templates/`.

### 4. Running Scripts from Root

We have configured several helper scripts in the root `package.json`:

- `npm run build`: Build all workspaces.
- `npm run lint`: Lint all files.
- `npm run format:fix`: Format code with Prettier.

## 📣 Releases & scaffold changes

When a PR changes **templates**, **registry** output, or **CLI scaffold behavior** (including `--merge`, markers, or foundation layout), add a short **“Existing projects”** note to the PR description or changelog: what users who already ran `init` should do (e.g. copy new markers, run `doctor`, or accept `--force`).

### Express merge markers (all merge-layout foundations)

Slugs that support `add <slug> --merge` and **which project file** must contain `// @servercn:begin|end <slug>` are centralized in `packages/cli/src/constants/express-merge-slots.ts` (`EXPRESS_MERGE_SLOTS`). Foundations that ship the same slot paths are listed as `EXPRESS_MERGE_FOUNDATIONS` (Express starters under `packages/templates/node/express/foundation/`). When adding or moving a merge slot:

1. Update **every** foundation in `EXPRESS_MERGE_FOUNDATIONS` (MVC and feature trees) so markers stay in sync.
2. Ensure the component template has a **merge-only** file at the same relative path (single begin/end block for that slug — see `packages/cli/src/lib/merge-marker.ts`).
3. Update the README merge table in `packages/cli/README.md`.
4. From `packages/cli`, run `npm run test:express-merge-foundation` (and `npm run test:merge-marker` if you touch merge logic).

See also `packages/templates/node/express/component/README.md` for how components are grouped.

**Regression subset (merge-critical):** marker IDs live in `EXPRESS_MERGE_SLUGS`, merge-capable component slugs live in `EXPRESS_MERGE_COMPONENT_SLUGS`, fail-fast overlap paths live in `EXPRESS_MERGE_CRITICAL_PATHS` (`express-merge-slots.ts`), and dependency/order rules live in `EXPRESS_COMPONENT_DEPENDENCY_RULES` (`express-component-dependency-rules.ts`). Current high-risk overlap guard includes `request-validator`, `verify-auth-middleware`, `rbac` on `src/routes/user.routes.ts` (MVC) / `src/modules/user/user.routes.ts` (feature). CI / local regression for markers, slots, and dependency rules: from repo root run `npm run test:cli-express-merge` (runs all CLI selftests in that package). A full `init` + `add --merge` E2E in a temp directory is optional and not required for that script.

## 🚀 Submitting Changes

1. **Create a Branch**:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```


2. **Make your changes**. Please ensure your code follows the existing style (we use Prettier).

3. **Commit your changes**:
   We prefer clear, descriptive commit messages.

```bash
git commit -m "feat(cli): add support for new component type"
```

4. **Push to your fork**:

```bash
git push origin feature/my-new-feature
```

5. **Open a Pull Request**:
   - Go to the original repository.
   - Click "New Pull Request".
   - Describe your changes clearly.

## 🧩 Adding a New Component

If you are contributing a new component:

1. Create the component definition in `packages/registry/components/<name>.json`.
2. Implement the component logic in `packages/templates/components/<name>/`.
3. Ensure it follows the project's architecture (Express/MVC standards).
4. Add documentation in `apps/web/src/content/docs/components/<name>.mdx` 

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.

---

Thank you for helping us build the best backend component registry! 🚀
