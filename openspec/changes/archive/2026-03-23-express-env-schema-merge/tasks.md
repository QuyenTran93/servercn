## 1. Spike — chuẩn inner merge (zod)

- [x] 1.1 Đọc `add` + registry variant OAuth GitHub; chốt **marker id** (slug) dùng cho lệnh `add … --merge` trên env
- [x] 1.2 Ghi vào `design.md` **một** quy ước inner (vd mở rộng `z.object` / `.extend`) + ví dụ before/after splice; rà lệch zod giữa foundation và `package.json` workspace

## 2. Pilot — OAuth GitHub, feature, express-starter

- [x] 2.1 Foundation `express-starter/feature/src/shared/configs/env.ts`: thêm cặp marker rỗng theo id đã chốt
- [x] 2.2 Component `oauth/github/feature/.../shared/configs/env.ts`: đổi thành **merge-only fragment** khớp zod foundation + field GitHub
- [x] 2.3 Mở rộng `EXPRESS_MERGE_SLOTS` (và export nếu cần) cho file env feature; cập nhật `doctor` / selftest cho **pilot path**
- [x] 2.4 `servercn build` + `npm run typecheck` (CLI) + `npm run test:cli-express-merge` (hoặc tập selftest đã mở rộng)

## 3. Rollout — MVC + mọi foundation `EXPRESS_MERGE_FOUNDATIONS`

- [x] 3.1 Lặp marker (và chỉnh template env foundation nếu chưa zod đồng bộ) cho **MVC** `src/configs/env.ts` trên từng foundation trong `EXPRESS_MERGE_FOUNDATIONS`
- [x] 3.2 Lặp cho **feature** `src/shared/configs/env.ts` (hoặc path tương đương) trên từng foundation; bổ sung fragment MVC cho OAuth GitHub nếu có path merge
- [x] 3.3 `servercn build` + full `test:express-merge-foundation` + typecheck

## 4. Tài liệu

- [x] 4.1 `packages/cli/README.md` + `contributing.md` (bảng / env merge)
- [x] 4.2 (Tuỳ chọn) delta `openspec/specs/express-starter-component-add/spec.md` nếu cần ghi env marker vào spec chính
