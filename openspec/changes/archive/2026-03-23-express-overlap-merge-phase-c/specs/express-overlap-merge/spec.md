## ADDED Requirements

### Requirement: Bảo vệ overlap non-slot có rủi ro cao

CLI MUST có chiến lược xác định cho các overlap path rủi ro cao chưa nằm trong slot merge hiện tại (ưu tiên user route files và shared primitives thường bị nhiều component cùng chạm tới), để tránh trạng thái scaffold half-apply sau `add`.

#### Scenario: Add nhiều component đụng cùng user route file

- **WHEN** user thêm tuần tự các component cùng chạm `src/routes/user.routes.ts` (MVC) hoặc `src/modules/user/user.routes.ts` (feature)
- **THEN** CLI MUST xử lý theo strategy đã khai báo (merge hoặc fail-fast có hướng dẫn), và MUST không silent skip làm thiếu wiring bắt buộc

### Requirement: Guard cho integration-path collision

Khi nhiều component có intent mount trùng path integration (ví dụ cùng mount users route), CLI MUST phát hiện collision và phản hồi quyết định được (idempotent merge hoặc fail với thông điệp remediation), thay vì để xung đột ngầm.

#### Scenario: Collision mount path

- **WHEN** user thêm component mới tạo mount trùng integration path đã tồn tại
- **THEN** CLI MUST báo rõ path bị collision và hành động kế tiếp được khuyến nghị

### Requirement: Không silent-skip ở merge-critical path

Với các path được định danh merge-critical trong Phase C, nếu `add --merge` không thể áp dụng fragment an toàn thì CLI MUST fail với lỗi có ngữ cảnh (file, slug, marker kỳ vọng), thay vì skip im lặng.

#### Scenario: Fragment không thỏa điều kiện merge-critical

- **WHEN** template fragment không khớp marker/strategy cho một merge-critical path
- **THEN** CLI MUST dừng với thông điệp actionable để maintainer/user sửa marker hoặc chọn phương án phù hợp
