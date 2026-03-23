## Why

Component **`rbac`** overlap nhiều path với `express-starter` (`env`, `status-codes`, `api-error`, `logger`, `error-handler`, v.v.) và ship cả **`src/routes/user.routes.ts`** (MVC) / **`src/routes/index.ts`** (feature) dạng “full file”. Sau `init`, `add rbac` không `--force` thường **skip** phần lớn template; không `--merge` thì **không** mount router → thiếu wiring. Cần đưa `rbac` vào cùng pattern **marker + merge-only** đã dùng cho `request-validator` / `async-handler`.

## What Changes

- Foundation `express-starter`: thêm khối rỗng `// @servercn:begin rbac` … `// @servercn:end rbac` trên **MVC** `src/app.ts` và trên **feature** `src/routes/index.ts` (cùng vị trí tương đương các slug merge khác).
- Template `rbac`: thêm file merge-only (`mvc/src/app.ts`, `feature/src/routes/index.ts`) mount `user.routes` (path public giữ tương thích với bản feature hiện tại, vd `/api/v1/users` dưới `app` và `/v1/users` dưới `router`).
- Giữ các file **additive** (middleware `verify-auth`, `authorize-role`, models, types, …); các file trùng primitives với foundation vẫn có thể bị **skip** cho đến khi change `dedupe-shared-component-templates` gom shared — ghi rõ trong design.
- Cập nhật `packages/cli/README.md` bảng merge + mở rộng `doctor.ts` (slug `rbac`).
- `servercn build` → `apps/web/public/sr`.
- **BREAKING** (mềm): project cũ thiếu marker phải thêm tay hoặc dùng `--force` như các slug merge khác.

## Capabilities

### New Capabilities

- `rbac-scaffold-merge`: Hành vi scaffold `rbac` với `--merge` + marker; regression các slug merge trước; doc + `doctor`.

### Modified Capabilities

- (Không có spec gốc trong `openspec/specs/` — để trống.)

## Impact

- `packages/templates/node/express/component/rbac/**`
- `packages/templates/node/express/foundation/express-starter/**`
- `apps/web/public/sr/**`
- `packages/cli` (README, `doctor.ts`)
