## ADDED Requirements

### Requirement: OAuth env merge dùng provider-specific marker
Với component `oauth`, hệ thống merge SHALL dùng marker id theo provider thay vì marker chung: `oauth-google` cho variant Google và `oauth-github` cho variant GitHub.

#### Scenario: Add OAuth Google không ghi đè GitHub
- **WHEN** project đã có marker `oauth-google` và `oauth-github`, user chạy `add oauth --merge` và chọn provider `google`
- **THEN** chỉ vùng marker `oauth-google` được cập nhật và vùng `oauth-github` giữ nguyên

#### Scenario: Add OAuth GitHub không ghi đè Google
- **WHEN** project đã có marker `oauth-google` và `oauth-github`, user chạy `add oauth --merge` và chọn provider `github`
- **THEN** chỉ vùng marker `oauth-github` được cập nhật và vùng `oauth-google` giữ nguyên

### Requirement: OAuth google-github SHALL merge vào cả hai marker provider
Variant `google-github` của component `oauth` SHALL apply merge cho cả marker `oauth-google` và `oauth-github` trong cùng lần add.

#### Scenario: Add OAuth Google+GitHub
- **WHEN** user chạy `add oauth --merge` và chọn provider `google-github`
- **THEN** destination env SHALL chứa đầy đủ fields Google ở marker `oauth-google` và fields GitHub ở marker `oauth-github`

### Requirement: Project cũ chỉ có marker `oauth` SHALL nhận cảnh báo migrate
Khi destination thiếu marker provider-specific nhưng có marker cũ `oauth`, CLI/doctor MUST cảnh báo migrate marker và không auto-fallback merge vào marker cũ.

#### Scenario: Marker cũ không còn hợp lệ cho variant-aware flow
- **WHEN** user chạy `add oauth --merge` trên project chỉ có `// @servercn:begin oauth`
- **THEN** hệ thống SHALL báo thiếu marker mới (`oauth-google`/`oauth-github`) và hướng dẫn thêm marker mới trước khi merge
