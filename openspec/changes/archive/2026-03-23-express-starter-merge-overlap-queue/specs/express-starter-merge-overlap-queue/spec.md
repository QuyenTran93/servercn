## ADDED Requirements

### Requirement: Một danh sách task tuần tự bao phủ mọi slug overlap

Change MUST duy trì đúng **một** file `tasks.md` liệt kê **mọi** slug Express trong registry có **ít nhất một path file** trùng với cây template `express-starter` (MVC và/hoặc feature), theo **một thứ tự** định nghĩa trong `design.md` hoặc `tasks.md`. Không MUST hoàn thành toàn bộ trong một PR; MUST có thể tick dần qua nhiều PR cùng change.

#### Scenario: Maintainer mở hàng đợi

- **WHEN** maintainer mở change `express-starter-merge-overlap-queue`
- **THEN** MUST thấy một chuỗi checkbox theo thứ tự, mỗi slug overlap xuất hiện đúng một mục (trừ khi hai slug được gộp có lý do ghi rõ)

### Requirement: Xử lý tuần tự và ghi nhận kết quả từng slug

Với mỗi mục trong hàng đợi, khi bắt đầu MUST ưu tiên làm theo thứ tự đã chốt; khi kết thúc MUST ghi nhận bằng checkbox và/hoặc ghi chú: **merge-enabled** (đủ marker + fragment + slots + doc theo `scaffold-merge`), **hoãn** (lý do), **không merge** (vd chỉ dedupe/tài liệu), hoặc **tham chiếu change khác** (vd `rbac-scaffold-merge`).

#### Scenario: Hoàn thành một slug

- **WHEN** maintainer kết thúc xử lý một slug trong danh sách
- **THEN** trạng thái trong `tasks.md` MUST phản ánh rõ và các artifact code (nếu merge-enabled) MUST khớp `EXPRESS_MERGE_SLUGS` / foundation / README tương ứng

### Requirement: Không làm suy giảm slug merge đã ship

Trong suốt vòng đời change, các slug đã có trong `EXPRESS_MERGE_SLUGS` trước khi bắt đầu mục mới MUST không bị gỡ marker hoặc fragment sai lệch; selftest merge trong `packages/cli` MUST vẫn pass sau mỗi nhóm chỉnh sửa liên quan.

#### Scenario: Regression sau chỉnh backlog

- **WHEN** chạy `npm run test:cli-express-merge` (hoặc tập selftest merge tương đương) sau khi merge PR cập nhật queue
- **THEN** các slug merge-enabled hiện hữu MUST vẫn đạt kỳ vọng
