## 1. Sửa registry path `validate-objectid`

- [x] 1.1 Cập nhật `packages/registry/component/validate-objectid.json` để các giá trị `templates.mvc` / `templates.feature` trỏ đúng thư mục `validate-objectId/...` (khớp case trên Linux)
- [x] 1.2 Chạy `servercn build` và xác nhận không còn warning `Template directory not found` cho component này

## 2. Schema `banking-app` — PostgreSQL Drizzle `user`

- [x] 2.1 Quyết định theo `design.md`: thêm tree template `mvc` dưới `packages/templates/node/express/schema/banking-app/user/postgresql/drizzle/mvc` **hoặc** gỡ khai báo `mvc` khỏi `packages/registry/schema/banking-app.json` cho cặp DB/ORM này
- [x] 2.2 Áp dụng thay đổi đã chọn và xác nhận build không báo thiếu thư mục cho path đó

## 3. Rà soát registry còn lại

- [x] 3.1 Chạy `servercn build` sạch (không log `Template directory not found`); nếu còn, lặp lại quy trình sửa registry hoặc bổ sung template
- [x] 3.2 (Tùy chọn) Thêm script kiểm tra path hoặc fail build khi phát hiện path không tồn tại

## 4. Chuẩn hóa EOL cho `.env`

- [x] 4.1 Trong `packages/cli/src/utils/update-env.ts`, import và áp dụng `normalizeEol` cho nội dung đọc/ghi trước khi `writeFileSync`
- [x] 4.2 Kiểm tra thủ công: `.env` CRLF → sau `add` có env keys, file chỉ còn LF

## 5. Publish artifact

- [x] 5.1 Commit `apps/web/public/sr/**` sau khi build registry thành công
- [x] 5.2 Chạy test/lint liên quan (`packages/cli` typecheck nếu có)

## 6. Scaffold: file đã tồn tại (skip)

- [x] 6.1 Thu thập danh sách path bị skip trong `copyTemplate` và `cloneServercnRegistry` (hoặc một lớp gọi chung) khi `conflict === "skip"` và file đích đã tồn tại
- [x] 6.2 Sau scaffold trong `add`/`init`, nếu có skip: in summary (số file + gợi ý `--force`) bằng logger mức `warn` hoặc tương đương nổi bật
- [x] 6.3 Thêm option CLI (ví dụ `--strict`) trên `add` và `init`; khi bật và có skip → `process.exit(1)` (hoặc throw) sau khi in summary
- [x] 6.4 Cập nhật help/README cho `packages/cli`: skip vs `--force` vs `--strict`; **nêu rõ `--force` = replace template, không đảm bảo hết lint, có thể mất chỉnh sửa tay**
- [x] 6.5 (Tùy chọn) Khi có overwrite bởi `--force`, thêm một dòng nhắc “review diff / chạy lint” trong summary sau scaffold (tránh trùng với log overwrite từng file)

## 7. Merge: giữ nội dung user + đủ wiring component

- [x] 7.1 **Spike** (≤ ~2–3 ngày làm việc): đọc bảng phương án trong `design.md`; đánh giá A/B/C (và D/E nếu cần) trên codebase thật; ghi **quyết định chốt** + lý do vào `design.md` (mục Decisions)
- Quyết định sản phẩm đã ghi: **A + B** (additive + marker), cờ pilot **`--merge`**, xem `design.md` Decision 8 và `specs/template-additive-scaffold/spec.md`.
- [x] 7.2 Chọn **một component pilot** (vd `rate-limiter` hoặc component có barrel): liệt kê chính xác “wiring tối thiểu” cần có sau `add` (exports, import trong `app.ts`, v.v.)
- [x] 7.3 **Proof-of-concept**: implement một luồng merge theo quyết định (marker / append / manifest tối thiểu) cho pilot; thêm test hoặc fixture script chứng minh: file user-owned ngoài vùng merge giữ nguyên, wiring component xuất hiện
- [x] 7.4 Document trong README/help: khi nào dùng merge vs `--force` vs skip; hành vi fallback khi thiếu marker / điều kiện merge

**Follow-up (change riêng, không thuộc scope đóng change này):** mở rộng quy ước additive + marker cho thêm N component hoặc toàn bộ template (trước đây mục 7.5). Khi làm, tạo proposal/workflow OpenSpec mới (có thể kết hợp `dedupe-shared-component-templates`).
