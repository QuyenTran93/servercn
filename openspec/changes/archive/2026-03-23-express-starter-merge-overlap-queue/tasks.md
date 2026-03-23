## 1. Chuẩn bị

- [x] 1.1 Chạy lại phương pháp đếm overlap trong `design.md` trước khi đóng change; nếu danh sách slug khác mục 2 bên dưới, cập nhật lại các mục 2.x cho khớp — **Đã verify 2026-03-22:** 20 slug, count khớp bảng dưới

## 2. Hàng đợi slug — xử lý tuần tự (overlap path count giảm dần; mvc/feature so với `express-starter`)

Thứ tự và overlap count (distinct `arch:path`) tại thời điểm tạo change: `oauth` 17, `file-upload` 15, `verify-auth-middleware` 14, `rbac` 13, `not-found-handler` 12, `global-error-handler` 10, `health-check` 9, `swagger-docs` 7, `logger` 6, `rate-limiter` 6, `request-validator` 6, `async-handler` 4, `error-handler` 4, `response-formatter` 4, `email-service` 2, `env` 2, `http-status-codes` 2, `jwt-utils` 2, `security-header` 2, `shutdown-handler` 2.

- [x] 2.1 `oauth` — **Hoãn** merge-enabled (xem mục **Tiến độ queue** trong `design.md`)
- [x] 2.2 `file-upload` — **Hoãn** (xem `design.md`)
- [x] 2.3 `verify-auth-middleware` — đã merge-enabled (phase 3); giữ regression `scaffold-merge`
- [x] 2.4 `rbac` — **Ủy quyền** `rbac-scaffold-merge` (xem `design.md`)
- [x] 2.5 `not-found-handler` — **Hoãn** (xem `design.md`)
- [x] 2.6 `global-error-handler` — **Hoãn** (xem `design.md`)
- [x] 2.7 `health-check` — **Hoãn** (xem `design.md`)
- [x] 2.8 `swagger-docs` — **Hoãn** / doc (xem `design.md`)
- [x] 2.9 `logger` — **Hoãn** / dedupe (xem `design.md`)
- [x] 2.10 `rate-limiter` — đã merge-enabled (batch 1); giữ regression
- [x] 2.11 `request-validator` — đã merge-enabled (batch 2); giữ regression
- [x] 2.12 `async-handler` — đã merge-enabled (batch 1); giữ regression
- [x] 2.13 `error-handler` — **Hoãn** (xem `design.md`)
- [x] 2.14 `response-formatter` — **Hoãn** (xem `design.md`)
- [x] 2.15 `email-service` — **Hoãn** (xem `design.md`)
- [x] 2.16 `env` — **Không merge marker** — dedupe/doc (xem `design.md`)
- [x] 2.17 `http-status-codes` — **Không merge marker** (xem `design.md`)
- [x] 2.18 `jwt-utils` — **Không merge marker** (xem `design.md`)
- [x] 2.19 `security-header` — đã merge-enabled (batch 1); giữ regression
- [x] 2.20 `shutdown-handler` — **Không merge marker** (xem `design.md`)

## 3. Đóng change

- [x] 3.1 Sau khi mọi mục 2.x còn `[ ]` đã được xử lý (hoặc hoãn có lý do ghi trong task/design): `npm run typecheck` trong `packages/cli` + `npm run test:cli-express-merge` từ root
- [x] 3.2 Rà soát README / `express-merge-slots` / `express-starter-component-add` spec nếu có slug merge mới trong quá trình queue — **Không thêm slug merge** trong session này
