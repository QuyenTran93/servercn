## Why

Nhiều component (OAuth, RBAC, …) ship `env.ts` / `shared/configs/env.ts` **trùng path** với foundation nhưng **khác mô hình** (interface vs `zod`), nên `add` thường **skip** và thiếu biến môi trường. Cần **chuẩn hóa merge** trên file env theo thứ tự đã thống nhất: spike thiết kế → pilot một slug/kiến trúc → mở rộng foundation/arch → tài liệu.

## What Changes

- **Spike (design):** Foundation env dùng **`zod` làm chuẩn**; định nghĩa **inner merge** (cách thêm field vào schema + `safeParse` vẫn hợp lệ sau khi splice).
- **Pilot:** Một component cụ thể (đề xuất: **OAuth GitHub**, **feature**, **express-starter**): marker rỗng trên foundation `env`, fragment merge-only trên template component, mở rộng `EXPRESS_MERGE_SLOTS` + selftest/doctor cho **đúng path** đó.
- **Rollout:** Cùng pattern lên **MVC** và **mọi foundation** trong `EXPRESS_MERGE_FOUNDATIONS`.
- **Doc:** README, contributing, (tuỳ chỉnh) spec `express-starter-component-add` hoặc `scaffold-merge`.
- **BREAKING** (mềm): project cũ thiếu marker env phải thêm tay hoặc `--force` theo tài liệu.

## Capabilities

### New Capabilities

- `express-env-schema-merge`: Chuẩn zod + marker trên env, fragment component, slot CLI, pilot và rollout.

### Modified Capabilities

- (Tuỳ chỉnh sau pilot nếu cần delta vào `express-starter-component-add` — để trống tại proposal.)

## Impact

- `packages/templates/node/express/foundation/**` (env files)
- `packages/templates/node/express/component/oauth/**` (và component pilot)
- `packages/cli` (`express-merge-slots`, selftest, `doctor`)
- `apps/web/public/sr/**` sau `servercn build`
