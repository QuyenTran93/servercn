## 1. CLI merge id resolution

- [x] 1.1 Tạo helper resolve OAuth variant -> merge ids (`oauth-google`, `oauth-github`) trong flow `add`/`copy`
- [x] 1.2 Cập nhật logic merge cho variant `google-github` để apply vào cả hai marker trong một lần add
- [x] 1.3 Bổ sung thông báo lỗi/cảnh báo khi thiếu marker mới và bỏ fallback marker cũ `oauth`

## 2. Foundation + component templates

- [x] 2.1 Thêm marker rỗng `oauth-google` + `oauth-github` vào env path của mọi foundation trong `EXPRESS_MERGE_FOUNDATIONS` (MVC + feature)
- [x] 2.2 Chuyển `oauth/google` env templates (mvc + feature) sang merge-only fragments theo marker `oauth-google`
- [x] 2.3 Chuyển `oauth/github` env templates (mvc + feature) sang merge-only fragments theo marker `oauth-github` và xử lý `oauth/google-github` theo composite flow

## 3. Slot matrix, doctor, selftests

- [x] 3.1 Cập nhật `EXPRESS_MERGE_SLOTS` và types liên quan để phản ánh marker env mới
- [x] 3.2 Cập nhật `doctor` để kiểm tra `oauth-google`/`oauth-github` và đưa hướng dẫn migrate warn-only cho project cũ
- [x] 3.3 Mở rộng selftests (merge marker / foundation) cho case add OAuth theo từng variant và composite variant

## 4. Docs, build artifacts, verification

- [x] 4.1 Cập nhật `packages/cli/README.md` + `contributing.md` với ma trận marker OAuth mới và policy migration warn-only
- [x] 4.2 Chạy `npm run build -w packages/cli` + `node packages/cli/dist/cli.js build` để cập nhật `apps/web/public/sr/**`
- [x] 4.3 Chạy `npm run typecheck -w packages/cli` + `npm run test:cli-express-merge` và xác nhận pass
