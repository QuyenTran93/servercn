## ADDED Requirements

### Requirement: Batch 3 được định nghĩa sau spike và hoàn thành trong phạm vi đã chốt

Change MUST ghi rõ danh sách slug batch 3 (sau bước spike/chốt) trong `design.md` hoặc `tasks.md` và MUST hoàn thành refactor merge/additive + marker foundation cho **từng** slug trong phạm vi đã chốt.

#### Scenario: Maintainer đọc scope phase 3

- **WHEN** mở change `expand-scaffold-merge-phase-3`
- **THEN** MUST thấy batch 3 cụ thể và tiêu chí “done” cho từng slug

### Requirement: Không regress slug merge đã ship

Sau khi merge PR phase 3, `npm run test:merge-marker` và bảng slug `--merge` trong README MUST vẫn bao phủ đầy đủ các slug đã có trước phase 3 (`rate-limiter`, `security-header`, `async-handler`, `request-validator`) với cùng semantic như trước.

#### Scenario: Kiểm tra regression

- **WHEN** chạy selftest merge-marker và đối chiếu README
- **THEN** các slug batch 1–2 MUST không bị gỡ marker foundation hoặc fragment template sai lệch

### Requirement: Tài liệu, doctor và merge slots đồng bộ

Nếu thêm slug merge mới, `EXPRESS_MERGE_SLUGS` / `EXPRESS_MERGE_SLOTS` MUST cập nhật; README MUST cập nhật bảng merge target; `servercn doctor` SHOULD kiểm tra marker cho các slug mới trên đúng file (cùng quy tắc batch 1–2) trừ khi task ghi rõ hoãn mở rộng `doctor`.

#### Scenario: User chạy doctor sau khi init foundation mới

- **WHEN** foundation đã có marker batch 3
- **THEN** doctor MUST (khi đã implement mở rộng) cảnh báo thiếu marker cho slug batch 3 tương ứng
