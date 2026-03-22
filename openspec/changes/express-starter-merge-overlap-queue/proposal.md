## Why

Nhiều component Express trong registry **trùng đường dẫn file** với foundation `express-starter`, nên `add` mặc định thường **skip** và thiếu wiring. Đã có spec tổng `scaffold-merge` và một số slug đã merge-enabled; cần **một change OpenSpec duy nhất** với **một `tasks.md` tuần tự** bao phủ **toàn bộ** slug có overlap (theo phân tích template), tránh tách nhiều change “phase” và không sót slug.

## What Changes

- Một **hàng đợi có thứ tự** trong `tasks.md`: mỗi mục = một slug overlap (hoặc nhóm quyết định rõ), làm **lần lượt**; ghi kết quả: merge-enabled, hoãn (lý do), hoặc chỉ dedupe/tài liệu khi không có wiring `app`/`routes`.
- Với slug chọn **merge-enabled**: foundation markers + fragment merge + `EXPRESS_MERGE_*` + README/docs + `servercn build` + selftest — theo bar trong `scaffold-merge`.
- **BREAKING** (mềm): từng slug merge-enabled như hiện tại (project cũ thiếu marker).
- Phối hợp change **`rbac-scaffold-merge`** cho slug `rbac` để tránh trùng PR/scope (task ghi rõ).

## Capabilities

### New Capabilities

- `express-starter-merge-overlap-queue`: Hàng đợi slug overlap có thứ tự, tiêu chí hoàn thành từng mục, và ràng buộc xử lý tuần tự trong một change.

### Modified Capabilities

- (Không đổi requirement cấp spec khác tại proposal — chi tiết kỹ thuật vẫn thuộc `scaffold-merge` và `express-starter-component-add`.)

## Impact

- `packages/templates/**`, `apps/web/public/sr/**`, `packages/cli` (slots, README, doctor khi thêm slug merge).
- Có thể phụ thuộc hoặc song song `dedupe-shared-component-templates` cho nhóm slug chỉ overlap primitives.
