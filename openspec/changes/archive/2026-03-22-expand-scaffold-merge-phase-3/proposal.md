## Why

Phase 2 (`request-validator`) đã mở rộng `--merge` theo cùng pattern với batch 1. Trong phụ lục A rollout, vẫn còn nhiều component trùng path với `express-starter` — đặc biệt nhóm **xử lý lỗi / 404**, **Swagger**, và **middleware xác thực** — khiến `add` không `--force` thường skip và không có wiring rõ. Cần **phase 3** để tiếp tục rollout có kiểm soát, tránh gom RBAC/OAuth/file-upload (scope quá lớn) vào cùng một PR.

## What Changes

- **Chốt batch 3** sau spike nhanh: ưu tiên slug có wiring rõ trên `src/app.ts` (mvc) và/hoặc `src/routes/index.ts` + `src/app.ts` (feature), trong tập ứng viên **`swagger-docs`**, **`not-found-handler`**, **`global-error-handler`**, **`verify-auth-middleware`** — tối đa **1–2 slug** mỗi iteration trừ khi spike chứng minh gộp an toàn.
- Foundation `express-starter`: thêm khối marker rỗng cho từng slug đã chốt (đúng file integration, có thể cần vị trí tương thích thứ tự middleware/route hiện có).
- Refactor template từng component: fragment merge-only + phần additive; `servercn build` + commit `apps/web/public/sr`.
- Cập nhật `EXPRESS_MERGE_SLUGS` / `EXPRESS_MERGE_SLOTS` (single source of truth), `packages/cli/README.md`, và `doctor.ts` cho slug mới.
- **BREAKING** (mềm): project cũ thiếu marker phải thêm tay hoặc `--force`, giống các slug merge trước.
- **RBAC**: không nằm trong scope change này nếu triển khai song song qua change `rbac-scaffold-merge` (tránh trùng PR).

## Capabilities

### New Capabilities

- `scaffold-merge-phase-3`: Phạm vi batch 3 sau spike, tiêu chí done, regression các slug merge đã ship, và cập nhật doc/doctor/const merge.

### Modified Capabilities

- (Không có spec gốc trong `openspec/specs/` — để trống.)

## Impact

- `packages/templates/node/express/foundation/express-starter/**`
- `packages/templates/node/express/component/**` (theo slug chốt)
- `apps/web/public/sr/**`
- `packages/cli` (`express-merge-slots.ts`, README, `doctor.ts`)
