## MODIFIED Requirements

### Requirement: Đường đi khuyến nghị sau init express-starter

Tài liệu CLI (và tài liệu cài đặt đồng bộ nếu có) SHALL mô tả rõ: sau `init` với foundation `express-starter`, đối với component có hỗ trợ merge theo registry, người dùng SHALL dùng `add <slug> --merge` thay vì chỉ `add <slug>` khi muốn wiring đầy đủ mà không ghi đè thủ công.

Ngoài marker-based guidance, CLI SHALL thực hiện dependency-aware validation cho các slug overlap-prone: nếu thứ tự add hiện tại vi phạm hard dependency rule thì MUST dừng với hướng dẫn thứ tự đúng; nếu vi phạm soft ordering rule thì SHALL cảnh báo và gợi ý remediation.

#### Scenario: Người dùng thêm component merge-enabled

- **WHEN** project đã được tạo bằng `express-starter` và component `<slug>` được định nghĩa là merge-enabled trong tài liệu
- **THEN** tài liệu SHALL hướng dẫn lệnh `add <slug> --merge` và giải thích vì sao tránh thiếu wiring so với copy/skip mặc định

#### Scenario: Vi phạm hard dependency trong add flow

- **WHEN** user chạy `add <slug>` cho component yêu cầu dependency bắt buộc chưa được cài
- **THEN** CLI SHALL báo lỗi dependency có hướng dẫn thứ tự lệnh, thay vì tiếp tục scaffold gây half-apply
