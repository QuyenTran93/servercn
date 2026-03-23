## ADDED Requirements

### Requirement: Danh sách ưu tiên rollout merge

Change MUST có tài liệu (trong `design.md` hoặc `tasks.md`) liệt kê **thứ tự** component được chuyển sang pattern merge-only + additive, kèm **tiêu chí** đưa vào batch (vd overlap path với foundation, độ dùng, phụ thuộc shared).

#### Scenario: Batch được định nghĩa trước khi refactor hàng loạt

- **WHEN** team bắt đầu implement rollout
- **THEN** MUST có danh sách ưu tiên có thể trích dẫn (ít nhất batch đầu tiên) và cập nhật khi thay đổi scope

### Requirement: Mỗi component trong scope MUST có wiring merge hoặc chỉ additive

Với mỗi component được đánh dấu “done” trong change này, sau `add <slug> --merge` trên project đã `init` foundation có marker tương ứng, project MUST nhận **wiring tối thiểu** đã định nghĩa cho component đó (middleware/route/register trong vùng marker hoặc chỉ file mới nếu không cần đụng `app.ts`).

#### Scenario: Foundation có marker cho slug component

- **WHEN** user chạy `add <slug> --merge` và foundation đã chứa cặp `// @servercn:begin <slug>` … `// @servercn:end <slug>`
- **THEN** nội dung giữa hai marker trên file integration MUST được cập nhật theo template merge-only của component và code ngoài marker MUST không bị ghi đè bởi bước merge đó

### Requirement: Tài liệu migration cho project thiếu marker

Đối với mỗi component rollout, README CLI hoặc docs web MUST có hướng dẫn ngắn: nếu project cũ **không** có marker, user MUST thêm khối marker (hoặc dùng `--force`) để đạt cùng kết quả wiring.

#### Scenario: User tra cứu component đã rollout

- **WHEN** user đọc tài liệu cho component slug đã được mở rộng merge
- **THEN** MUST thấy cách dùng `--merge` và fallback khi thiếu marker

### Requirement: Không regress pilot rate-limiter

Sau các thay đổi template/registry trong change này, luồng `add rate-limiter --merge` trên foundation mới MUST vẫn áp dụng wiring rate limiter như trước (cùng semantic: import + `app.use` trong vùng marker).

#### Scenario: Regression check rate-limiter

- **WHEN** chạy lại scenario tương đương selftest hoặc hướng dẫn thủ công documented trong `tasks.md`
- **THEN** kết quả merge MUST khớp kỳ vọng (có `rateLimiter` trong vùng marker)
