## Why

Change `expand-scaffold-merge-rollout` (batch 1: `rate-limiter`, `security-header`, `async-handler`) đã xong và có thể archive. Vẫn còn nhiều component **trùng path** với `express-starter` (phụ lục A trong design batch 1) — cần **phase 2** để mở rộng `--merge` / additive theo cùng pattern, tránh skip nửa vời khi user không muốn `--force`.

## What Changes

- Chốt **batch 2** (2–4 slug) ưu tiên theo overlap + wiring rõ ràng; cập nhật `design.md` của change này.
- Foundation `express-starter`: thêm khối marker rỗng cho từng slug batch 2 (mvc + feature; thêm file integration nếu khác `app.ts` / `routes/index.ts`).
- Refactor template từng component: merge-only fragment + file additive; `servercn build` + `apps/web/public/sr`.
- Cập nhật `packages/cli/README.md` bảng merge + mở rộng `doctor` (danh sách slug kiểm tra) nếu có slug/file mới.
- **BREAKING** (theo từng component): đổi path/import nếu sau này gắn với `dedupe-shared-component-templates`.

## Capabilities

### New Capabilities

- `scaffold-merge-phase-2`: Phạm vi batch 2, tiêu chí done, regression batch 1, và (tùy chọn) mở rộng `doctor`.

### Modified Capabilities

- (Không có spec gốc trong `openspec/specs/` — để trống.)

## Impact

- `packages/templates/**`, `packages/registry/**`, `apps/web/public/sr/**`
- `packages/cli` (README, có thể `doctor.ts`)
