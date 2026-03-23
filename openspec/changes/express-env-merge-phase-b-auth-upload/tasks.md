## 1. CLI — ma trận merge và resolution

- [x] 1.1 Mở rộng `EXPRESS_MERGE_SLUGS` với `rbac`, `jwt-utils`, `file-upload-cloudinary`, `file-upload-imagekit`; gom các id env vào slot `src/configs/env.ts` (MVC) và `src/shared/configs/env.ts` (feature) cùng nhóm OAuth hiện có
- [x] 1.2 Mở rộng `EXPRESS_MERGE_COMPONENT_SLUGS` với `rbac`, `jwt-utils`, `file-upload`
- [x] 1.3 Mở rộng `resolveExpressMergeMarkerIds` cho `file-upload` + variant (`cloudinary` → `file-upload-cloudinary`, `imagekit` → `file-upload-imagekit`)
- [x] 1.4 Cập nhật `express-merge-slugs.selftest.ts` (và bất kỳ assert merge id nào) cho slug/component mới

## 2. Foundation — marker rỗng trên env

- [x] 2.1 Chèn cặp marker rỗng `rbac`, `jwt-utils`, `file-upload-cloudinary`, `file-upload-imagekit` vào `mvc/src/configs/env.ts` cho từng foundation trong `EXPRESS_MERGE_FOUNDATIONS` (thứ tự thống nhất với `design.md`)
- [x] 2.2 Lặp tương tự cho `feature/src/shared/configs/env.ts`

## 3. Component templates — fragment merge-only

- [x] 3.1 `rbac` (MVC + feature): đổi `configs/env.ts` / `shared/configs/env.ts` thành merge-only fragment khớp marker `rbac` + field `zod` cần thiết
- [x] 3.2 `jwt-utils` (MVC + feature): tương tự với marker `jwt-utils`
- [x] 3.3 `file-upload/cloudinary` (MVC + feature): fragment với marker `file-upload-cloudinary`
- [x] 3.4 `file-upload/imagekit` (MVC + feature): fragment với marker `file-upload-imagekit`

## 4. Copy / merge pipeline

- [x] 4.1 Rà `packages/cli/src/lib/copy.ts`: đảm bảo mọi file env merge cho component Phase B dùng đúng `mergeMarkerIds` từ `resolveExpressMergeMarkerIds` (không hard-code chỉ OAuth)

## 5. Tài liệu và artifact registry

- [x] 5.1 Cập nhật `packages/cli/README.md` (bảng merge + ví dụ lệnh cho `rbac`, `jwt-utils`, `file-upload`)
- [x] 5.2 Cập nhật `contributing.md` (danh slug merge-critical nếu có liệt kê)
- [x] 5.3 Chạy `servercn build` (hoặc `node packages/cli/dist/cli.js build`) và kiểm tra diff `apps/web/public/sr/**`

## 6. Kiểm thử

- [x] 6.1 `npm run typecheck -w packages/cli`
- [x] 6.2 `npm run test:cli-express-merge` từ repo root
- [ ] 6.3 (Tuỳ chọn) smoke `add` local với `--merge` trên temp dir cho một foundation + một component Phase B

## 7. Điều phối

- [x] 7.1 Nếu `rbac-scaffold-merge` đang mở: rebase/merge để tránh xung đột cùng file template `rbac` (ưu tiên giữ cả route merge và env merge) — **đã ghi rủi ro trong proposal/design; người mở PR điều phối khi merge nhánh**
