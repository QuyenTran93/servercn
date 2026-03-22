## ADDED Requirements

### Requirement: Mọi đường dẫn template trong registry source phải tồn tại trên disk

Khi chạy `servercn build` trong monorepo, sau khi join `packages/templates` với path khai báo trong `packages/registry`, mỗi thư mục template được tham chiếu MUST tồn tại và MUST đọc được (ít nhất một file nguồn nếu product yêu cầu nội dung không rỗng — quy ước cụ thể: không được log `Template directory not found` cho path đã khai báo).

#### Scenario: Build registry trên Linux với filesystem case-sensitive

- **WHEN** developer chạy lệnh build registry trên Linux
- **THEN** không có cặp (registry entry, architecture key) nào trỏ tới thư mục không tồn tại vì sai hoa thường hoặc typo segment

#### Scenario: Scaffold local khớp registry

- **WHEN** user chạy `add` với `--local` cho một component đã khai báo đầy đủ `templates`
- **THEN** CLI MUST resolve được thư mục template tương ứng architecture đã chọn mà không exit vì missing directory

### Requirement: Ghi file environment qua CLI dùng line endings LF nhất quán

Hàm cập nhật biến môi trường (ví dụ `updateEnvKeys`) MUST ghi nội dung `.env` / `.env.example` với ký tự xuống dòng LF (`\n`) sau khi merge keys, kể cả khi file hiện có dùng CRLF.

#### Scenario: Thêm keys vào .env đã có CRLF

- **WHEN** file `.env` hiện tại dùng CRLF và CLI thêm một khối biến mới
- **THEN** file sau khi ghi MUST chỉ dùng LF làm line terminator (không còn `\r` trong nội dung text)

### Requirement: Cảnh báo rõ khi scaffold bỏ qua file đã tồn tại

Khi `add` hoặc `init` ghi template mà chính sách conflict là bỏ qua file trùng (mặc định khi không dùng `--force`), nếu ít nhất một file bị bỏ qua, CLI MUST in ra một thông điệp tổng hợp (sau bước scaffold) gồm số lượng file bỏ qua và gợi ý chạy lại với `--force` (hoặc tương đương documented) để áp dụng đầy đủ nội dung template. Thông điệp MUST dùng mức độ dễ nhận biết (ví dụ `warn` / màu cảnh báo) so với dòng log skip từng file.

#### Scenario: Một file template bị skip

- **WHEN** user chạy `add` cho một component và một đường dẫn đích đã tồn tại, không truyền `--force`
- **THEN** sau khi scaffold, output MUST chứa tóm tắt kiểu “N file skipped” (hoặc tương đương) và MUST nhắc rõ rằng code template có thể chưa được áp dụng đầy đủ

#### Scenario: Không có file nào bị skip

- **WHEN** mọi file template đều được tạo mới hoặc ghi đè (hoặc không có conflict)
- **THEN** không bắt buộc phải hiển thị cùng một cảnh báo tổng hợp “skipped” (tránh nhiễu)

### Requirement: Tùy chọn fail khi có file bị skip

CLI MUST hỗ trợ một cờ (ví dụ `--strict` hoặc tên documented tương đương) trên lệnh `add`/`init`: khi cờ được bật và có ít nhất một file bị bỏ qua vì đã tồn tại, tiến trình MUST kết thúc với exit code khác 0.

#### Scenario: Strict với skip

- **WHEN** user chạy `add` với cờ strict và ít nhất một file bị skip
- **THEN** exit code MUST khác 0

#### Scenario: Strict không skip

- **WHEN** user chạy `add` với cờ strict và không có file nào bị skip
- **THEN** exit code MUST bằng 0 (giả sử không có lỗi khác)

### Requirement: Tài liệu và kỳ vọng về `--force`

CLI MUST mô tả trong `--help` của lệnh `add` và `init` (hoặc README `packages/cli` được help tham chiếu) rằng `--force` **ghi đè toàn bộ nội dung** các file trùng đường dẫn bằng bản template, **không** merge với chỉnh sửa hiện có, và **không** đảm bảo project pass lint hay TypeScript sau lệnh.

#### Scenario: Đọc help về force

- **WHEN** user xem phần mô tả option `--force` (hoặc `-f`) trên `add`/`init`
- **THEN** văn bản MUST nêu rủi ro ghi đè tay và/hoặc việc vẫn phải tự sửa import / chạy lint sau scaffold

### Requirement: (Tùy chọn) Nhắc sau khi ghi đè

Khi ít nhất một file được ghi đè do `--force` (hoặc `conflict: overwrite`), CLI SHOULD in một dòng nhắc ngắn (sau bước scaffold) rằng user nên review diff và chạy lint/typecheck — trừ khi đã merge thông điệp tương đương vào summary chung không gây trùng lặp.

#### Scenario: Force overwrite ít nhất một file

- **WHEN** user chạy `add` với `--force` và có file đích đã tồn tại được ghi đè
- **THEN** output SHOULD chứa nhắc review/lint hoặc nội dung tương đương documented trong cùng một khối summary sau scaffold

### Requirement: Spike chiến lược merge scaffold (không mất nội dung user)

Trước khi coi phần “merge thông minh” của change này **hoàn tất**, team MUST hoàn thành spike ghi trong `tasks.md` (mục 7.x): so sánh các phương án trong `design.md` (bảng chiến lược), chọn **một hướng chính** (hoặc kết hợp rõ ràng), và MUST cập nhật `design.md` mục **Decisions** với quyết định cuối + tiêu chí áp dụng (loại file nào merge kiểu nào, fallback khi không có marker).

**Đã chốt (sản phẩm):** **A (layout additive) + B (marker regions)** — xem `design.md` Decision 8 và spec `template-additive-scaffold/spec.md`. Pilot và CLI `--merge` vẫn MUST hoàn thành theo các scenario “Sau spike” bên dưới.

#### Scenario: Spike xong có quyết định ghi nhận

- **WHEN** spike kết thúc
- **THEN** `design.md` MUST chứa đoạn quyết định có thể trích dẫn được (tên phương án + lý do ngắn) và `tasks.md` phần 7 MUST có checkbox spike được đánh hoàn thành hoặc ghi defer có lý do

### Requirement: (Sau spike) Hành vi merge đã chọn

Sau khi spike chốt phương án, CLI (hoặc workflow documented bắt buộc) MUST hỗ trợ ít nhất một đường đi cho user để **áp dụng component lên project đã có file trùng** mà **không** yêu cầu ghi đè toàn bộ mọi file conflict để đạt **đủ wiring** (export / register route hoặc tương đương được định nghĩa cho component mẫu trong phạm vi pilot). Cụ thể kỹ thuật MUST khớp **Decision 8** (`design.md`): file mới additive + cập nhật có giới hạn trong vùng `@servercn:begin` / `@servercn:end` khi dùng chế độ merge documented.

#### Scenario: Pilot component với file barrel/router đã tồn tại

- **WHEN** user chạy `add` cho component pilot với behavior merge documented (cờ hoặc convention đã chọn) và một file integration đã tồn tại có chỉnh sửa user **ngoài** vùng do component quản lý
- **THEN** sau lệnh, file đó MUST vẫn chứa chỉnh sửa user ngoài vùng đó VÀ project MUST nhận được phần wiring bắt buộc của component pilot (theo định nghĩa test/pilot trong `tasks.md`)

#### Scenario: Fallback khi không áp dụng được merge

- **WHEN** điều kiện để merge an toàn không thỏa (vd thiếu marker khi phương án B)
- **THEN** CLI MUST fail rõ hoặc fallback documented (vd chỉ gợi ý `--force` / sidecar) chứ không im lặng tạo trạng thái thiếu wiring
