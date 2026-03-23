## Why

Sau khi `init` với foundation `express-starter`, lệnh `add` component dễ để lại project **thiếu wiring**, **lỗi TypeScript/ESLint**, hoặc **trùng file bị skip** nếu người dùng không biết khi nào dùng `--merge` / `--force` và foundation chưa có vùng marker. Cần chuẩn hóa hành vi mong đợi, tài liệu và (tuỳ chọn) kiểm thử tự động để giảm ma sát.

## What Changes

- Ghi rõ **mô hình sản phẩm**: `express-starter` là foundation **cộng** snapshot code tương đương nhiều phần đã “add sẵn” (flatten trong cây file), kèm **vùng marker** để `add <slug> --merge` cập nhật wiring khi registry đổi hoặc project cũ thiếu marker.
- Ghi rõ **quy trình khuyến nghị** sau init: component có hỗ trợ merge → `add <slug> --merge`; khi nào cần `doctor`, khi nào chấp nhận `--force` và rủi ro.
- **Không bắt buộc** tạo foundation/starter mới chỉ để test; ưu tiên **cùng `express-starter`** + script/CI chạy `init` → `add` (ma trận slug) trên thư mục tạm.
- (Tuỳ phạm vi implement) Bổ sung hoặc củng cố **kiểm thử tích hợp** / fixture tối thiểu nếu repo chưa có vòng lặp E2E cho `init` + `add`.

## Capabilities

### New Capabilities

- `express-starter-component-add`: Hành vi và tài liệu đảm bảo thêm component sau `express-starter` có đường đi rõ ràng, ít lỗi build/lint, và chiến lược kiểm thử không yêu cầu starter riêng trừ khi có mục đích đặc biệt.

### Modified Capabilities

- (Không có — `openspec/specs/` hiện chưa có spec nền để delta.)

## Impact

- `packages/cli` (README, có thể thêm script test hoặc mở rộng doctor).
- Tài liệu web/installation nếu cần đồng bộ với CLI.
- Người dùng cuối: ít lỗi sau `add`, rõ ràng hơn về `--merge` và kiểm tra `doctor`.
