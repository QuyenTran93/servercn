## 1. Tài liệu mô hình và đường đi khuyến nghị

- [x] 1.1 Bổ sung mô tả **foundation + mã đóng gói sẵn** cho `express-starter` (README + installation nếu đồng bộ), phân biệt với `init` không chạy chuỗi `add`.
- [x] 1.2 Thêm **bản đồ starter ↔ component** (spec § “Bản đồ starter ↔ component”): phần nào trong starter dễ trùng file component, khi nào dùng `--merge`.
- [x] 1.3 Rà soát `packages/cli/README.md` (và `apps/web/.../installation.mdx` nếu cần) để đoạn “sau `init express-starter`” nêu rõ `add <slug> --merge` cho slug merge-enabled và phân biệt với `--force`.
- [x] 1.4 Bổ sung hoặc siết mục `doctor`: khi nào chạy, ý nghĩa thiếu marker / drift so với foundation hiện tại; giữ **đồng bộ** với bảng ma trận merge trong README.
- [x] 1.5 Xác minh template `packages/templates/node/express/foundation/express-starter` khớp spec **Vùng marker trên foundation** (MVC `src/app.ts`, Feature `src/app.ts` + `src/routes/index.ts`); chỉnh template nếu thiếu/sai slug.

## 2. Kiểm thử và ma trận slug

- [x] 2.1 Quyết định subset slug tối thiểu cho regression (ưu tiên merge-critical), ghi trong contributing hoặc comment script.
- [x] 2.2 Thêm hoặc mở rộng script/CI: thư mục tạm → `init express-starter` → `add <slug> --merge` cho từng slug trong subset; xác nhận `build`/`lint` pass (hoặc bước tối thiểu đã thống nhất).

## 3. (Tuỳ chọn) Cảnh báo CLI

- [x] 3.1 Đánh giá có nên cảnh báo khi `add` slug merge-known mà thiếu `--merge` (không breaking); nếu làm, cập nhật test CLI tương ứng.

## 4. Hoàn tất

- [x] 4.1 Chạy `openspec validate express-starter-add-component-reliability --type change` và sửa lỗi nếu có.
- [x] 4.2 Archive change sau khi implement và review (theo quy trình repo).
