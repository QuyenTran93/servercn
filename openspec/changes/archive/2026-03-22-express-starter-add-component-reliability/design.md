## Context

Foundation `express-starter` là **một snapshot**: nền tối thiểu **cộng** các phần tương đương component đã được **đóng gói sẵn** trong cây file (không phải chuỗi lệnh `add` lúc `init`). Marker (`// @servercn:begin|end <slug>`) là **điểm mở** để `add … --merge` bổ sung hoặc đồng bộ wiring có tên, khi registry hoặc project lệch so với bản khuyến nghị.

Vẫn còn ma sát: người dùng quen `add` không `--merge`, file trùng bị **skip** (để lại import/route thiếu), hoặc project cũ **không có marker** trùng foundation mới.

## Goals / Non-Goals

**Goals:**

- Chuẩn hóa **đường đi khuyến nghị**: sau `init express-starter`, với component đã hỗ trợ merge → `add <slug> --merge`; chạy `doctor` khi nghi ngờ drift.
- Làm rõ **không cần starter thứ hai** cho hầu hết test: dùng **cùng** `express-starter`, thư mục tạm, và ma trận `init` → `add` (theo slug).
- (Tuỳ triển khai) Thêm hoặc mở rộng **E2E/CI** tối thiểu để regression không phá luồng trên.

**Non-Goals:**

- Thay thế toàn bộ cơ chế `skip`/`--force` bằng thiết kế mới trong một change này (có thể thuộc change khác như dedupe shared templates).
- Bắt buộc mọi component đều merge-only ngay lập tức.

## Decisions

1. **Một starter cho test mặc định** — Chọn `express-starter` làm nền duy nhất cho script kiểm thử `init` + `add`. Starter riêng chỉ xét khi cần biến thể foundation (ví dụ kiến trúc khác), không phải để “tránh lỗi” thông thường.

2. **Ưu tiên `--merge` trên slug đã khai báo marker** — Giảm chỉnh tay và giảm lỗi TS do thiếu import/router.

3. **`doctor` là điểm kiểm tra sau drift** — Phát hiện thiếu marker hoặc hướng dẫn đồng bộ với foundation; không thay thế đọc release note.

4. **`--force` là escape hatch** — Ghi rõ rủi ro ghi đè; dùng khi người dùng chấp nhận merge thủ công hoặc tái tạo file primitives.

## Risks / Trade-offs

- [Người dùng bỏ quên `--merge`] → Mitigation: README/installation nhấn mạnh; `doctor` cảnh báo; (tuỳ chọn) cảnh báo CLI khi `add` slug merge-known mà không có `--merge`.
- [Project cũ không có marker] → Mitigation: hướng dẫn copy khối marker từ foundation hiện tại hoặc init project mới.
- [E2E chậm] → Mitigation: chạy ma trận rút gọn trên CI nightly hoặc chỉ các slug merge-critical.

## Migration Plan

- Không migration dữ liệu runtime; chỉ cập nhật tài liệu và (nếu có) thêm bước CI. Rollback: revert commit tài liệu/script.

## Open Questions

- Ma trận slug nào là **tối thiểu** cho CI (tất cả merge-enabled hay subset)?
- Có nên **mặc định** bật merge cho slug đã hỗ trợ (breaking UX) hay giữ cờ explicit?
