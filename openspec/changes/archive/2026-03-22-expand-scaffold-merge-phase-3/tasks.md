## 1. Chốt scope batch 3 (spike)

- [x] 1.1 Spike nhanh từng ứng viên (`swagger-docs`, `not-found-handler`, `global-error-handler`, `verify-auth-middleware`): file integration, thứ tự middleware so với foundation MVC `src/app.ts` và feature `src/app.ts` / `src/routes/index.ts`
- [x] 1.2 Chốt danh sách slug cuối (tối đa 1–2 slug mỗi iteration); cập nhật `design.md` Decision 1 nếu khác đề xuất mặc định; loại trừ RBAC nếu đang theo change `rbac-scaffold-merge`

## 2. Foundation + build

- [x] 2.1 Thêm marker rỗng `@servercn` cho từng slug batch 3 trên đúng file integration (mvc + feature)
- [x] 2.2 `servercn build` và commit `apps/web/public/sr` tương ứng

## 3. Refactor component

- [x] 3.1 Refactor slug đầu batch 3: merge-only + additive; cả hai architecture nếu component hỗ trợ
- [x] 3.2 Lặp cho slug còn lại trong phạm vi đã chốt — **N/A:** batch 3 chỉ một slug (`verify-auth-middleware`)

## 4. CLI merge slots + doc + doctor

- [x] 4.1 Cập nhật `packages/cli/src/constants/express-merge-slots.ts` (`EXPRESS_MERGE_SLUGS`, `EXPRESS_MERGE_SLOTS`)
- [x] 4.2 Cập nhật `packages/cli/README.md` (bảng slug merge)
- [x] 4.3 Mở rộng `doctor.ts` danh sách slug/file kiểm tra (hoặc ghi rõ “hoãn” trong `design.md` nếu không làm) — **Đủ:** `doctor` đọc `EXPRESS_MERGE_SLOTS` động, slug mới tự được kiểm tra

## 5. Kiểm thử

- [x] 5.1 `npm run typecheck` + `npm run test:merge-marker` — **Đã chạy:** `npm run typecheck` trong workspace `@quyentran93/servercn-cli` + `npm run test:cli-express-merge` từ repo root
- [x] 5.2 (Tùy chọn) `add <slug> --merge` trên project mẫu `test-svcn` hoặc temp dir — **Smoke:** `test:express-merge-foundation` + registry build; E2E `init`+`add` tùy maintainer
