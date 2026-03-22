## ADDED Requirements

### Requirement: Tài liệu phân loại drift sau init

Tài liệu user-facing (README CLI và/hoặc docs web) MUST phân biệt ít nhất các trường hợp: (a) chỉ nâng phiên bản CLI; (b) registry/template có wiring mới (marker, component refactor); (c) foundation thay đổi. Với mỗi lớp MUST gợi ý hành động phù hợp (không đổi file / chỉnh tay theo doc / `--merge` / `--force` có cảnh báo / project mới).

#### Scenario: Developer đọc README sau khi bump CLI

- **WHEN** user mở README phần upgrade hoặc troubleshooting sau init
- **THEN** MUST tìm thấy hướng dẫn ngắn cho “project đã init từ bản cũ” và biết khi nào cần đụng code vs chỉ bump package

### Requirement: Release note cho thay đổi scaffold

Mỗi release CLI hoặc publish registry artifact làm thay đổi hành vi scaffold (marker, path, `--merge`) SHOULD có mục **Existing projects** (hoặc tương đương) trong changelog/release note template được team tuân thủ.

#### Scenario: Maintainer ghi release có breaking scaffold

- **WHEN** một PR thay template/registry làm lệch kỳ vọng project cũ
- **THEN** checklist release MUST nhắc ghi migration một dòng cho user đã init

### Requirement: (Tùy chọn) Lệnh báo cáo drift

Nếu implement `doctor` (hoặc tên tương đương), lệnh MUST **chỉ** đọc project và in gợi ý (thiếu marker, file gợi ý đối chiếu doc); MUST NOT ghi đè file mặc định trong phase đầu.

#### Scenario: Chạy doctor trên project cũ

- **WHEN** user chạy lệnh doctor đã documented
- **THEN** output MUST là báo cáo/gợi ý chứ không tự sửa file (trừ khi có cờ explicit được spec riêng sau này)
