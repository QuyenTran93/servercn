## ADDED Requirements

### Requirement: Batch 2 được định nghĩa và hoàn thành

Change MUST ghi rõ danh sách slug batch 2 trong `design.md` hoặc `tasks.md` (sau bước chốt) và MUST hoàn thành refactor merge/additive + marker foundation cho **từng** slug trong phạm vi đã chốt.

#### Scenario: Maintainer đọc scope phase 2

- **WHEN** mở change `expand-scaffold-merge-phase-2`
- **THEN** MUST thấy batch 2 cụ thể và tiêu chí “done” cho từng slug

### Requirement: Không regress batch 1

Sau khi merge PR phase 2, `npm run test:merge-marker` và bảng slug `--merge` trong README MUST vẫn bao phủ đầy đủ các slug batch 1 (`rate-limiter`, `security-header`, `async-handler`) với cùng semantic như trước.

#### Scenario: Kiểm tra regression

- **WHEN** chạy selftest merge-marker và đối chiếu README
- **THEN** batch 1 MUST không bị gỡ marker foundation hoặc fragment template sai lệch

### Requirement: Tài liệu và doctor đồng bộ

Nếu thêm slug merge mới, README MUST cập nhật bảng merge target; `servercn doctor` SHOULD kiểm tra marker cho các slug mới trên đúng file (cùng quy tắc batch 1) trừ khi task ghi rõ hoãn mở rộng `doctor`.

#### Scenario: User chạy doctor sau khi init foundation mới

- **WHEN** foundation đã có marker batch 2
- **THEN** doctor MUST (khi đã implement mở rộng) cảnh báo thiếu marker cho slug batch 2 tương ứng
