## ADDED Requirements

### Requirement: Template component ưu tiên file path mới (additive)

Scaffold cho component MUST ưu tiên tạo **file đích chưa tồn tại** trong foundation (và sau này trong cây **shared primitives** theo change `dedupe-shared-component-templates`). Component MUST NOT lặp lại toàn bộ nội dung primitives (errors, status codes, logger surface, v.v.) dưới path đã do foundation/shared sở hữu; thay vào đó MUST **import** từ nguồn đã thống nhất.

#### Scenario: Add sau express-starter không cần ghi đè primitive

- **WHEN** user đã `init` foundation express-starter và chạy `add` cho một component đã refactor theo quy ước additive
- **THEN** các file template của component MUST không trùng path với primitives đã có trong foundation/shared (trừ file wiring có marker — xem requirement tiếp theo)

### Requirement: Wiring vào file đã có qua vùng marker @servercn

Đối với file integration đã tồn tại (vd `src/app.ts`, `src/routes/index.ts`), phần do component quản lý MUST nằm trong một vùng có ranh giới:

- Dòng bắt đầu: `// @servercn:begin <id>`
- Dòng kết thúc: `// @servercn:end <id>`

`<id>` MUST là slug component hoặc giá trị documented tương đương trong registry. Khi CLI áp dụng chế độ merge đã documented (vd `--merge`), nó MUST chỉ thay thế nội dung **giữa** hai marker (bao gồm hoặc không bao gồm boundary lines theo spec implement — MUST nhất quán và documented); nội dung **ngoài** hai marker MUST giữ nguyên byte-for-byte trừ normalize EOL nếu có chính sách chung.

#### Scenario: User chỉnh tay ngoài vùng marker

- **WHEN** file đích đã có marker và user thêm code **ngoài** cặp `@servercn:begin/end` cho component đó
- **THEN** sau `add` với merge, phần code user ngoài vùng MUST vẫn còn

#### Scenario: Thiếu marker khi component yêu cầu merge

- **WHEN** user bật merge cho component pilot và file đích thiếu một trong hai marker hoặc `<id>` không khớp
- **THEN** CLI MUST báo lỗi rõ hoặc áp dụng fallback documented (không được im lặng bỏ wiring)

### Requirement: Đồng bộ với shared primitives

Khi change `dedupe-shared-component-templates` định nghĩa path shared (vd `src/shared/errors/...`), template component mới và pilot MUST được cập nhật để **không** còn nhúng bản sao file trùng chức năng; MUST dùng import từ shared theo quy ước trong proposal/spec của change đó.

#### Scenario: Hai component cùng dùng ApiError

- **WHEN** hai component khác nhau cần `ApiError`
- **THEN** cả hai MUST tham chiếu cùng module shared (một path), không hai bản `api-error.ts` trùng path scaffold

### Requirement: Manifest patch (C) không phải trục Phase 2

Registry-level manifest thao tác (insert sau regex, v.v.) MAY được đánh giá lại **sau** pilot marker + additive; không bắt buộc trong phạm vi proof-of-concept đầu tiên của change `fix-registry-scaffold-integrity`.
