## Why

Flow env merge cho OAuth hiện dùng chung marker `oauth`, nên khi user chạy `add oauth --merge` nhiều lần với các variant khác nhau (`google`, `github`) thì lần sau có thể ghi đè nội dung lần trước. Cần tách merge id theo variant để kết quả không phụ thuộc thứ tự lệnh.

## What Changes

- Tách marker env OAuth theo variant: `oauth-google` và `oauth-github` trên cả MVC + feature foundation env path.
- Cập nhật template fragment env của OAuth variants để merge theo marker mới thay vì marker chung `oauth`.
- Mở rộng CLI merge resolution để chọn merge id theo variant đã chọn; với variant `google-github` thì apply vào cả hai marker provider.
- Cập nhật `doctor`, selftest, và tài liệu để phản ánh ma trận marker mới.
- Chính sách migration cho project cũ chỉ có marker `oauth`: cảnh báo + hướng dẫn migrate marker mới (warn-only), không auto-convert.

## Capabilities

### New Capabilities
- `oauth-variant-aware-env-merge`: Merge env OAuth theo provider-specific marker để tránh overwrite do thứ tự add.

### Modified Capabilities
- `express-starter-component-add`: Thay đổi requirement marker env OAuth từ marker chung sang provider-specific markers, và bổ sung hành vi merge cho variant tổng hợp.

## Impact

- `packages/cli/src/constants/express-merge-slots.ts`
- `packages/cli/src/commands/add/index.ts`
- `packages/cli/src/lib/copy.ts`
- `packages/cli/src/commands/doctor.ts`
- `packages/cli/src/lib/express-merge-foundation.selftest.ts` và/hoặc selftest merge liên quan
- `packages/templates/node/express/foundation/**/mvc/src/configs/env.ts`
- `packages/templates/node/express/foundation/**/feature/src/shared/configs/env.ts`
- `packages/templates/node/express/component/oauth/{google,github,google-github}/**/configs/env.ts`
- `packages/cli/README.md`, `contributing.md`
- `apps/web/public/sr/**` sau `servercn build`
