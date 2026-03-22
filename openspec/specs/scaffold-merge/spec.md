# scaffold-merge Specification

## Purpose

Mô tả yêu cầu cho rollout **theo từng component (hoặc batch nhỏ)** của scaffold merge — `add <slug> --merge` và cặp marker `// @servercn:begin|end <slug>` trên `express-starter`. Một PR/change có thể chỉ ship một hoặc vài slug; **toàn bộ hành vi mong muốn** được gói trong **một** spec này, không tách theo “phase-2 / phase-3 / rollout”.

## Requirements

### Requirement: Ưu tiên và phạm vi từng bước

Mỗi đợt làm việc MUST có tài liệu (thiết kế hoặc tasks) ghi **slug hoặc batch** đang xử lý, **thứ tự** ưu tiên (nếu có nhiều slug), và **tiêu chí** đưa vào phạm vi (vd overlap path với foundation, độ phức tạp wiring, phụ thuộc dedupe/shared).

#### Scenario: Maintainer đọc scope trước khi sửa template

- **WHEN** maintainer mở tài liệu thiết kế hoặc checklist tasks của đợt rollout đó
- **THEN** MUST thấy rõ slug (hoặc danh sách slug) trong phạm vi và tiêu chí “done” cho từng slug

### Requirement: Hoàn thành merge/additive cho từng slug trong phạm vi

Với **mỗi** slug được đánh dấu hoàn thành trong phạm vi đó, sau `add <slug> --merge` trên project đã `init` foundation có marker tương ứng, project MUST nhận **wiring tối thiểu** đã định nghĩa cho component đó (nội dung trong vùng marker và/hoặc file additive; không ghi đè phần ngoài marker).

#### Scenario: Foundation có marker cho slug

- **WHEN** user chạy `add <slug> --merge` và foundation đã chứa cặp `// @servercn:begin <slug>` … `// @servercn:end <slug>` trên đúng file integration
- **THEN** nội dung giữa hai marker MUST được cập nhật theo template merge-only của component và code ngoài marker MUST không bị ghi đè bởi bước merge đó

### Requirement: Không regress slug merge đã ship trước đó

Sau mỗi đợt thay đổi template/registry/CLI liên quan merge, `npm run test:merge-marker` (và các selftest merge foundation/slug trong repo) MUST vẫn pass; bảng slug `--merge` trong README MUST vẫn **khớp** `EXPRESS_MERGE_SLUGS` / `EXPRESS_MERGE_SLOTS`; **semantic** merge cho mọi slug đã có trong `EXPRESS_MERGE_SLUGS` trước thay đổi MUST không bị phá (foundation vẫn có đủ cặp marker, fragment template vẫn hợp lệ).

#### Scenario: Kiểm tra regression sau khi thêm slug mới

- **WHEN** maintainer chạy selftest merge-marker và đối chiếu README với `express-merge-slots.ts`
- **THEN** các slug merge đã tồn tại trước PR MUST không bị gỡ marker sai hoặc fragment template sai lệch

### Requirement: Đồng bộ merge slots, README và doctor

Khi thêm hoặc đổi slug merge-enabled, `EXPRESS_MERGE_SLUGS` và `EXPRESS_MERGE_SLOTS` MUST cập nhật; README CLI (và docs web đồng bộ nếu có) MUST cập nhật bảng merge target; `servercn doctor` SHOULD kiểm tra marker cho đúng slug và đúng file theo `EXPRESS_MERGE_SLOTS` trừ khi task ghi rõ hoãn.

#### Scenario: User chạy doctor trên foundation mới

- **WHEN** foundation đã có marker cho slug merge mới
- **THEN** doctor MUST (khi đã implement kiểm tra động từ slots) cảnh báo nếu thiếu marker tương ứng

### Requirement: Tài liệu migration cho project thiếu marker

README CLI hoặc docs web MUST có hướng dẫn: project cũ **không** có marker thì user MUST thêm khối marker (theo foundation hiện tại) hoặc dùng `--force` khi chấp nhận ghi đè, để đạt cùng wiring như `add <slug> --merge` trên foundation mới.

#### Scenario: User tra cứu sau khi nâng CLI/registry

- **WHEN** user đọc tài liệu merge hoặc upgrades
- **THEN** MUST thấy cách dùng `--merge` và fallback khi thiếu marker

### Requirement: Không regress pilot rate-limiter

Luồng `add rate-limiter --merge` trên foundation `express-starter` hiện tại MUST luôn áp dụng wiring rate limiter đúng semantic (import + `app.use` trong vùng marker `rate-limiter`), trừ khi có quyết định thiết kế có ghi rõ migration và cập nhật spec cùng lúc.

#### Scenario: Regression check rate-limiter

- **WHEN** maintainer chạy checklist hoặc selftest tương đương documented trong contributing/tasks
- **THEN** kết quả merge MUST khớp kỳ vọng (có wiring rate limiter trong vùng marker)
