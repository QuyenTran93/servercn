## 1. Foundation

- [x] 1.1 Thêm marker rỗng `rbac` trên `express-starter` mvc `src/app.ts` và feature `src/routes/index.ts` (thứ tự: sau `request-validator`, trước `async-handler`)

## 2. Template rbac

- [x] 2.1 Thêm `mvc/src/app.ts` merge-only: mount `user.routes` (path theo `design.md`)
- [x] 2.2 Thay `feature/src/routes/index.ts` bằng merge-only fragment (bỏ full router chỉ users — foundation đã có health)

## 3. Artifact + CLI

- [x] 3.1 `servercn build`, kiểm tra `apps/web/public/sr`
- [x] 3.2 Cập nhật `packages/cli/README.md` (bảng + ví dụ lệnh)
- [x] 3.3 Mở rộng `doctor.ts`: thêm `rbac` vào `MERGE_APP_SLUGS_MVC` và `MERGE_ROUTES_SLUGS_FEATURE`

## 4. Kiểm thử

- [x] 4.1 `npm run typecheck` + `npm run test:merge-marker`
