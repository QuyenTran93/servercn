## Why

Project đã `init` từ một phiên bản CLI/registry/template cũ không tự đồng bộ khi upstream thêm marker `@servercn`, đổi foundation, hoặc refactor component. User dễ **không biết** phải làm gì khi nâng `servercn-cli` hoặc khi tài liệu yêu cầu block marker mới — dẫn tới `add --merge` fail, skip im lặng, hoặc buộc `--force` mù.

## What Changes

- **Tài liệu hạng nhất** (README CLI + ít nhất một mục docs web nếu có): ma trận tình huống — *đã init trước khi có feature X* → hành động (thêm marker tay, chạy lại `init`/foundation có điều kiện, `add --merge`, `--force`, hoặc chỉ bump dependency).
- **(Tùy chọn / phase sau)** Lệnh hoặc cờ CLI kiểu `doctor` / `sync` chỉ **đọc** và **báo cáo** drift (thiếu marker, version config) — không bắt buộc auto-sửa trong phase đầu.
- **Release note / changelog** template: mỗi thay đổi breaking scaffold MUST có mục “Existing projects”.
- **Không** hứa merge tự động hai chiều toàn project trong phase đầu (quá rủi ro).

## Capabilities

### New Capabilities

- `post-init-upgrade-guidance`: Kỳ vọng documented và (sau này) kiểm tra tùy chọn cho project đã init khi CLI/template/registry thay đổi.

### Modified Capabilities

- (Không có spec gốc trong `openspec/specs/` — để trống.)

## Impact

- `packages/cli/README.md`, có thể `apps/web` docs
- (Tùy chọn) `packages/cli` lệnh mới hoặc mở rộng `add`/`init` help
- Quy trình release / CONTRIBUTING nếu có hướng dẫn ghi chú migration
