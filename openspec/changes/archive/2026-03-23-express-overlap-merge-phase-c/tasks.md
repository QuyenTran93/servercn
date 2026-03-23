## 1. Overlap Matrix & Scope

- [x] 1.1 Chốt danh sách merge-critical overlaps (foundation <-> component, component <-> component) cho MVC và feature
- [x] 1.2 Phân loại từng path: marker-slot merge hoặc guard fail-fast

## 2. CLI Merge Strategy

- [x] 2.1 Mở rộng `express-merge-slots.ts` theo ma trận Phase C (slug/path/order)
- [x] 2.2 Cập nhật `copy.ts` để tránh silent skip trên merge-critical paths và trả lỗi actionable
- [x] 2.3 Cập nhật `doctor.ts` để kiểm tra marker/collision tương ứng các path mới

## 3. Template & Registry Sync

- [x] 3.1 Cập nhật foundation/component templates theo strategy đã chọn (marker fragments hoặc guard contract)
- [x] 3.2 Chạy `servercn build` để sync `apps/web/public/sr/**`
- [x] 3.3 Cập nhật selftests liên quan merge marker/slug/overlap regression

## 4. Docs & Validation

- [x] 4.1 Cập nhật `packages/cli/README.md` và `contributing.md` cho ma trận overlap Phase C
- [x] 4.2 Chạy `npm run typecheck -w @quyentran93/servercn-cli` và test subset merge-critical
- [x] 4.3 Thực hiện smoke `init + add --merge` cho ít nhất một case foundation<->component và một case component<->component
