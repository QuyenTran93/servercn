## Why

Sau change `fix-registry-scaffold-integrity` (đã archive), CLI đã có pilot **`--merge`** + marker `@servercn` cho **`rate-limiter`**, còn phần lớn component vẫn dựa skip/`--force` và trùng path với foundation. Cần một đợt rollout có ưu tiên để mở rộng quy ước **additive + marker** (và phối hợp **shared primitives** từ `dedupe-shared-component-templates` nếu đang làm song song) nhằm giảm scaffold nửa vời và giảm rủi ro ghi đè tay.

## What Changes

- Ưu tiên danh sách component (theo mức độ trùng path với `express-starter` / impact user).
- Refactor template từng component: file mới thuần additive; wiring vào `app.ts` / barrel qua merge-only fragment + marker trên foundation (hoặc tài liệu migration cho project cũ).
- (Tùy chọn) Chuẩn hóa tên marker / nhiều vùng trên cùng file (nhiều slug).
- Cập nhật `packages/registry`, `packages/templates`, `apps/web/public/sr` sau `servercn build`.
- Bổ sung test/selftest hoặc script kiểm tra regression cho luồng merge.
- **BREAKING** (theo từng component): đổi path import nếu gom vào shared; user đã chỉnh file trùng path có thể cần chỉnh tay hoặc `--force` một lần.

## Capabilities

### New Capabilities

- `scaffold-merge-rollout`: Phạm vi, thứ tự ưu tiên và tiêu chí “done” khi mở rộng `--merge`/marker sang thêm component; phối hợp additive template và tài liệu migration.

### Modified Capabilities

- (Không có spec gốc trong `openspec/specs/` — để trống.)

## Impact

- `packages/templates/node/express/component/**`
- `packages/registry/component/**`
- `packages/cli` (chỉ khi cần mở rộng hành vi merge, message, hoặc flag)
- `apps/web/public/sr/**` sau build
- Docs web/README CLI
