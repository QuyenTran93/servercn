## Context

Pilot `rate-limiter` đã chứng minh `--merge` + marker `@servercn:begin|end <slug>` trong `packages/cli` và foundation `express-starter` có sẵn vùng trống cho slug đó. Các component còn lại vẫn ship nhiều file trùng path với foundation → `add` không `--force` thường skip, không `--merge` thì không inject wiring. Change `dedupe-shared-component-templates` (nếu triển khai) giảm trùng primitives; change này tập rollout **marker + additive** theo danh sách ưu tiên.

## Goals / Non-Goals

**Goals:**

- Xác định **thứ tự component** cần refactor (theo overlap với foundation, tần suất dùng, độ phức tạp wiring).
- Chuẩn hóa pattern: file merge-only (một cặp marker, slug = component slug) cho từng điểm wiring; phần còn lại là file path mới hoặc import từ shared.
- Cập nhật template + registry + artifact build; giữ tương thích ngược tối đa (tài liệu migration cho project thiếu marker).

**Non-Goals:**

- Thay thế hoàn toàn `--force` hoặc manifest patch (C) trong phase đầu của change này.
- Sửa toàn bộ blueprint/schema trong cùng một đợt trừ khi tasks cụ thể chọn scope.

## Decisions

0. **Batch 1 (2026-03-22):** `rate-limiter` (đã pilot), **`security-header`**, **`async-handler`**. Cả ba có wiring qua merge trên `src/app.ts` (mvc/feature) hoặc — với `async-handler` **feature** — thêm merge trên `src/routes/index.ts`.

1. **`dedupe-shared-component-templates`:** change vẫn mở, **chưa** có tasks — ưu tiên: có thể chạy **song song** nhưng rollout merge **không phụ thuộc** dedupe; khi dedupe có shared tree, các batch sau SHOULD chuyển import sang shared trước khi thêm marker mới.

2. **Ưu tiên theo “điểm nóng” scaffold**: component trùng nhiều path với `express-starter` mvc/feature (logger, env, error stack, health, swagger, oauth, v.v.) lên trước trong **batch 2+** sau khi có bảng overlap (phụ lục A).

3. **Một slug = một cặp marker** trên cùng file integration cho đến khi có quyết định riêng về nhiều vùng; tránh chồng marker cùng tên.

4. **Foundation**: mỗi component được rollout có thể cần thêm khối marker rỗng trên `app.ts` (và tương đương feature) trong **cùng PR** với template component — hoặc ghi rõ “project cũ thêm marker tay” trong docs. `async-handler` **feature** thêm marker trên `src/routes/index.ts`. Khi dedupe đã cung cấp shared tree, component MUST import từ shared thay vì copy file trùng path.

## Risks / Trade-offs

- **[Risk]** Drift giữa mvc/feature hai nhánh template → **Mitigation**: checklist per component cho cả hai architecture khi component hỗ trợ cả hai.

- **[Risk]** User quên `--merge` → wiring không vào → **Mitigation**: giữ summary skip (đã có từ change trước) và doc rõ từng component đã hỗ trợ merge.

- **[Risk]** Marker bị user xóa → merge fail → **Mitigation**: message lỗi đã có pattern từ pilot; doc “restore marker” hoặc `--force` có cảnh báo.

## Migration Plan

1. Chọn batch 1 (N component) trong `tasks.md`.
2. Sửa template + registry → `servercn build` → commit `apps/web/public/sr`.
3. Chạy typecheck CLI + selftest merge-marker hiện có sau mỗi thay đổi CLI (nếu có).
4. Rollback: revert commit template/registry/artifact.

## Open Questions

- Default `add` có auto bật merge khi detect marker hay luôn explicit `--merge` (chờ sản phẩm)?
- Có cần marker generic (`// @servercn:begin components`) với nội dung ghép nhiều slug hay giữ một vùng một slug?

## Phụ lục A — Overlap path (built registry vs `express-starter` template)

Nguồn: so khớp `apps/web/public/sr/component/*.json` (path template) với cây `packages/templates/node/express/foundation/express-starter/{mvc,feature}`. Số = số path trùng tối thiểu (đếm theo architecture).

**Đuôi cao (nhiều overlap, ưu tiên batch 2+ sau dedupe/merge):** `oauth`, `file-upload`, `rbac`, `verify-auth-middleware`, `not-found-handler`, `global-error-handler`, `health-check`, `swagger-docs`, `logger`, `rate-limiter`, `request-validator`, …

**Ít hoặc không overlap (additive thuần, ít cần merge `app.ts`):** `security-header`, `generate-otp-token`, `cron-job`, `password-hashing` (variant), v.v.

Bảng chi tiết có thể tái sinh bằng script phân tích trong repo (so `findFilesByPath` / built JSON với foundation walk).
