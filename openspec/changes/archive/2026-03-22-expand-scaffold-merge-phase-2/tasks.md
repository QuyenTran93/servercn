## 1. Chốt scope batch 2

- [x] 1.1 Spike nhanh `health-check` vs route `/api/health` có sẵn — quyết định **có/không** đưa vào batch 2
- [x] 1.2 Chốt danh sách slug cuối (đề xuất mặc định: `request-validator`, và tùy chọn `response-formatter` hoặc bỏ nếu không có wiring merge) — cập nhật `design.md` Decision 1

## 2. Foundation + build

- [x] 2.1 Thêm marker rỗng `@servercn` cho từng slug batch 2 trên đúng file integration (mvc + feature)
- [x] 2.2 `servercn build` và commit `apps/web/public/sr` tương ứng

## 3. Refactor component

- [x] 3.1 Refactor slug đầu batch 2: merge-only + additive; cả hai architecture nếu component hỗ trợ
- [x] 3.2 Lặp cho slug còn lại — **N/A:** batch 2 chỉ một slug (`request-validator`)

## 4. CLI doc + doctor

- [x] 4.1 Cập nhật `packages/cli/README.md` (bảng slug merge)
- [x] 4.2 Mở rộng `doctor.ts` danh sách slug/file kiểm tra (hoặc ghi rõ “hoãn” trong `design.md` nếu không làm)

## 5. Kiểm thử

- [x] 5.1 `npm run typecheck` + `npm run test:merge-marker`
- [x] 5.2 (Tùy chọn) `add <slug> --merge` trên project mẫu `test-svcn` hoặc temp dir — **Smoke:** `npm run typecheck` + `servercn build`; E2E trên `test-svcn` tùy maintainer khi foundation đã có marker mới
