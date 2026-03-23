## Why

Sau Phase A/B, merge marker cho Express đã ổn ở một số file integration chính (`app.ts`, `routes/index.ts`, `env.ts`), nhưng vẫn còn nhiều vùng overlap giữa foundation và component, cũng như giữa các component với nhau, chưa có chiến lược merge nhất quán. Kết quả là `add <slug>` dễ rơi vào trạng thái skip/half-apply, đặc biệt ở các file user routes và shared primitives.

## What Changes

- Chuẩn hóa ma trận overlap có rủi ro cao cho Express templates (foundation <-> component, component <-> component), ưu tiên các path integration và shared primitives.
- Bổ sung capability mới cho merge strategy ở các path chưa được slot hóa (đặc biệt user route files và shared error/status utilities).
- Mở rộng hành vi guard của CLI để không silent-skip ở các path đã được đánh dấu là merge-critical.
- Đồng bộ docs/doctor/selftest để phản ánh các merge path mới và cảnh báo rõ ràng khi marker thiếu hoặc conflict strategy chưa thỏa.
- **BREAKING (mềm)**: project cũ thiếu marker mới sẽ cần thêm marker thủ công hoặc dùng `--force`, tương tự các phase trước.

## Capabilities

### New Capabilities
- `express-overlap-merge`: Bao phủ yêu cầu merge cho các path overlap ngoài scope env/app hiện có, bao gồm integration collisions và shared primitives.

### Modified Capabilities
- `express-starter-component-add`: Mở rộng requirement vùng marker/merge-critical path cho các trường hợp overlap phase C.

## Impact

- `packages/templates/node/express/foundation/**`
- `packages/templates/node/express/component/**`
- `packages/cli/src/constants/express-merge-slots.ts`
- `packages/cli/src/lib/copy.ts`
- `packages/cli/src/commands/doctor.ts`
- `packages/cli/README.md`, `contributing.md`
- `apps/web/public/sr/**`
