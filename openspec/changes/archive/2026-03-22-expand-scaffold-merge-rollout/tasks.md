## 1. Chuẩn bị và ưu tiên

- [x] 1.1 Tái lập hoặc cập nhật bảng overlap path (foundation `express-starter` mvc/feature vs từng component) để làm cơ sở thứ tự rollout
- [x] 1.2 Chốt **batch 1** (3–5 slug) và ghi vào `design.md` mục Decisions hoặc phụ lục ngắn
- [x] 1.3 Rà soát trạng thái change `dedupe-shared-component-templates`: nếu đang mở, phối hợp thứ tự (shared trước hay merge trước từng phần)

## 2. Foundation: marker cho batch 1

- [x] 2.1 Thêm khối `// @servercn:begin <slug>` … `// @servercn:end <slug>` (rỗng ban đầu) trên `app.ts` mvc và feature của `express-starter` cho **mỗi** slug trong batch 1
- [x] 2.2 Chạy `servercn build`, commit `apps/web/public/sr` tương ứng

## 3. Refactor từng component (batch 1)

- [x] 3.1 Với slug đầu tiên: tách wiring sang file merge-only `src/app.ts` (hoặc điểm integration đã chốt), phần còn lại additive; cập nhật `packages/registry` nếu cần
- [x] 3.2 Lặp 3.1 cho các slug còn lại trong batch 1
- [x] 3.3 `servercn build` + xác nhận `add <slug> --merge` trên project mẫu có foundation mới

## 4. Kiểm thử và tài liệu

- [x] 4.1 Chạy `npm run typecheck` / `npm run test:merge-marker` trong `packages/cli` sau mọi chỉnh CLI (nếu có)
- [x] 4.2 Cập nhật `packages/cli/README.md` (hoặc docs web): liệt kê component đã hỗ trợ `--merge` và fallback thiếu marker
- [x] 4.3 Ghi chú regression `rate-limiter` trong checklist release hoặc `tasks.md` (đã verify / ngày)

**Regression `rate-limiter`:** 2026-03-22 — `npm run test:merge-marker` + `npm run typecheck` sau build registry; fragment `rate-limiter` vẫn trong built `apps/web/public/sr`.

## 5. Batch tiếp theo (tùy chọn)

- [x] 5.1 **Không thực hiện trong iteration này:** batch 2+ (lặp mục 2–4) để follow-up khi ổn định batch 1 — mở change/PR riêng hoặc tiếp tục `expand-scaffold-merge-rollout` sau review.
