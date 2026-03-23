## Why

Sau Phase A (`oauth-variant-aware-env-merge`), env merge cho OAuth đã ổn định theo marker theo provider. Các component **auth / upload** còn lại (`rbac`, `jwt-utils`, `file-upload` với variant Cloudinary và Imagekit) vẫn ship `env` trùng path với foundation nhưng dạng `interface` + object literal, nên `add … --merge` không thể splice schema `zod` giống OAuth — dễ skip hoặc lệch kiểu so với foundation.

## What Changes

- Mở rộng ma trận merge env trên `mvc/src/configs/env.ts` và `feature/src/shared/configs/env.ts` cho các marker mới: `rbac`, `jwt-utils`, `file-upload-cloudinary`, `file-upload-imagekit` (bên cạnh `oauth-google` / `oauth-github` đã có).
- Thêm cặp marker rỗng tương ứng trên **mọi** foundation trong `EXPRESS_MERGE_FOUNDATIONS`.
- Đổi template env của component thành **merge-only fragment** (inner fields `zod` khớp convention foundation), theo đúng marker id (component slug hoặc variant-specific cho `file-upload`).
- Mở rộng `resolveExpressMergeMarkerIds` (và `EXPRESS_MERGE_COMPONENT_SLUGS` nếu cần) để `file-upload` map variant → `file-upload-cloudinary` | `file-upload-imagekit`.
- Cập nhật selftest merge slugs / foundation, `doctor` (qua `EXPRESS_MERGE_SLOTS`), README, contributing.
- `servercn build` để đồng bộ `apps/web/public/sr/**`.
- **BREAKING** (mềm): project cũ thiếu marker env mới phải copy khối marker từ foundation hiện tại hoặc dùng `--force` theo tài liệu.

## Capabilities

### New Capabilities

- `auth-upload-env-merge`: Chuẩn hóa env merge `zod` + marker cho `rbac`, `jwt-utils`, và `file-upload` (theo variant) trên Express merge-layout foundations.

### Modified Capabilities

- `express-starter-component-add`: Cập nhật requirement “Vùng marker … env” để bao gồm toàn bộ marker env hiện hành (OAuth theo provider + Phase B) thay vì chỉ mô tả cũ.

## Impact

- `packages/cli/src/constants/express-merge-slots.ts` (và selftest liên quan)
- `packages/cli/src/lib/copy.ts` (nếu cần chỉnh resolution merge id cho component mới)
- `packages/templates/node/express/foundation/**/…/env.ts`
- `packages/templates/node/express/component/rbac/**/configs/env.ts`
- `packages/templates/node/express/component/jwt-utils/**/configs/env.ts`
- `packages/templates/node/express/component/file-upload/cloudinary/**/configs/env.ts`
- `packages/templates/node/express/component/file-upload/imagekit/**/configs/env.ts`
- `packages/cli/README.md`, `contributing.md`
- `apps/web/public/sr/**` sau `servercn build`
- Điều phối với change `rbac-scaffold-merge` nếu cùng chạm template `rbac` (ưu tiên không xung đột: env merge vs route merge là hai trục độc lập).
