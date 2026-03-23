## Why

Hiện tại các change về merge marker chủ yếu xử lý theo path, nhưng chưa có contract rõ cho dependency và thứ tự cài giữa các component. Khi `add` theo thứ tự khác nhau, project có thể gặp skip/half-apply hoặc xung đột wiring dù đã dùng `--merge`.

## What Changes

- Bổ sung cơ chế khai báo dependency/ordering cho component Express theo architecture (`mvc`, `feature`).
- Định nghĩa policy resolve khi có overlap giữa các component liên quan cùng integration point (ví dụ user routes, auth middleware chain, env contributors).
- Mở rộng CLI `add` để cảnh báo/chặn sớm khi thứ tự add vi phạm dependency graph, đồng thời gợi ý lệnh remediation.
- Đồng bộ docs + doctor + selftests để bảo đảm thứ tự cài đặt nhất quán, giảm lỗi do add sai thứ tự.
- **BREAKING (mềm)**: một số luồng `add` trước đây im lặng skip có thể chuyển thành fail-fast có hướng dẫn khi vi phạm dependency rules.

## Capabilities

### New Capabilities
- `express-component-dependency-ordering`: Chuẩn hóa dependency graph, thứ tự add, và hành vi guard/remediation cho component Express có overlap.

### Modified Capabilities
- `express-starter-component-add`: Mở rộng requirement về hành vi `add` để bao gồm dependency-aware validation thay vì chỉ marker-path merge.

## Impact

- `packages/cli/src/commands/add/**`
- `packages/cli/src/lib/copy.ts`
- `packages/cli/src/commands/doctor.ts`
- `packages/cli/src/constants/express-merge-slots.ts` (hoặc constants dependency mới)
- `packages/templates/node/express/component/**` (metadata/contract nếu cần)
- `packages/cli/README.md`, `contributing.md`
