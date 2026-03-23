# express-starter-component-add Specification

## Purpose
TBD - created by archiving change express-starter-add-component-reliability. Update Purpose after archive.
## Requirements
### Requirement: Mô hình express-starter trong tài liệu

Tài liệu người dùng (CLI README và, nếu có, trang installation đồng bộ) SHALL mô tả `express-starter` như sau: đây là **foundation** kèm **mã đã được đóng gói sẵn** (tương đương nhiều phần của các component trong registry) trong một cây file duy nhất; `init` **không** chạy lần lượt `add` từng component. Người dùng dùng `add` sau init để **bổ sung** component khác hoặc **đồng bộ / cập nhật wiring** (đặc biệt qua `--merge` và marker).

#### Scenario: Đọc giới thiệu foundation

- **WHEN** người dùng mở tài liệu phần foundation `express-starter`
- **THEN** tài liệu SHALL giải thích rõ starter là snapshot đã gồm phần lõi và nhiều pattern sẵn có, và SHALL phân biệt với luồng “chỉ nền trống rồi add từng mảnh” nếu có foundation khác trong tương lai

### Requirement: Vùng marker trên mọi foundation Express merge-layout

Với **mỗi** foundation Express được liệt kê trong `EXPRESS_MERGE_FOUNDATIONS` (constant CLI; cùng bố cục slot với `express-starter`), template trong registry SHALL chứa cặp comment `// @servercn:begin <slug>` và `// @servercn:end <slug>` cho mỗi slug merge-enabled được hỗ trợ trên đúng file theo kiến trúc:

- **MVC**: `mvc/src/app.ts` SHALL có marker cho `rate-limiter`, `security-header`, `async-handler`, `request-validator`, `verify-auth-middleware`; và `mvc/src/configs/env.ts` SHALL có marker cho `oauth-google`, `oauth-github`, `rbac`, `jwt-utils`, `file-upload-cloudinary`, và `file-upload-imagekit`.
- **Feature**: `feature/src/app.ts` SHALL có marker cho `rate-limiter`, `security-header`; `feature/src/routes/index.ts` SHALL có marker cho `request-validator`, `async-handler`, `verify-auth-middleware`; và `feature/src/shared/configs/env.ts` SHALL có marker cho `oauth-google`, `oauth-github`, `rbac`, `jwt-utils`, `file-upload-cloudinary`, và `file-upload-imagekit`.

Các vùng giữa begin/end SHALL có thể để trống trong bản phát hành foundation (nội dung wiring do merge từ component khi người dùng chạy `add <slug> --merge`).

#### Scenario: Kiểm tra template MVC

- **WHEN** maintainer mở `mvc/src/app.ts` của bất kỳ foundation nào trong `EXPRESS_MERGE_FOUNDATIONS`
- **THEN** file SHALL chứa đủ các cặp marker cho mọi slug MVC nêu trên theo đúng tên slug

#### Scenario: Kiểm tra template Feature

- **WHEN** maintainer mở `feature/src/app.ts`, `feature/src/routes/index.ts`, và `feature/src/shared/configs/env.ts` trong cùng một foundation thuộc `EXPRESS_MERGE_FOUNDATIONS`
- **THEN** `app.ts` SHALL chứa marker cho `rate-limiter` và `security-header`, `routes/index.ts` SHALL chứa marker cho `request-validator`, `async-handler`, và `verify-auth-middleware`, và `shared/configs/env.ts` SHALL chứa đủ marker env như liệt kê ở trên

### Requirement: Đồng bộ ma trận marker với doctor và tài liệu

Danh sách slug và file kiểm tra marker trong lệnh `doctor` SHALL khớp với ma trận trong tài liệu (bảng merge / upgrades). Khi thêm hoặc đổi slug merge-enabled cho các foundation merge-layout, maintainer SHALL cập nhật **cả** template **mọi** foundation trong `EXPRESS_MERGE_FOUNDATIONS`, **cả** `doctor`, **cả** đoạn tài liệu có bảng ma trận.

#### Scenario: Thêm slug merge mới

- **WHEN** một slug mới được hỗ trợ `add <slug> --merge` trên `express-starter`
- **THEN** foundation template SHALL có marker tương ứng, `doctor` SHALL kiểm tra đúng path/slug, và README (hoặc tài liệu tương đương) SHALL liệt kê slug và file đích

### Requirement: Đường đi khuyến nghị sau init express-starter

Tài liệu CLI (và tài liệu cài đặt đồng bộ nếu có) SHALL mô tả rõ: sau `init` với foundation `express-starter`, đối với component có hỗ trợ merge theo registry, người dùng SHALL dùng `add <slug> --merge` thay vì chỉ `add <slug>` khi muốn wiring đầy đủ mà không ghi đè thủ công.

#### Scenario: Người dùng thêm component merge-enabled

- **WHEN** project đã được tạo bằng `express-starter` và component `<slug>` được định nghĩa là merge-enabled trong tài liệu
- **THEN** tài liệu SHALL hướng dẫn lệnh `add <slug> --merge` và giải thích vì sao tránh thiếu wiring so với copy/skip mặc định

### Requirement: Kiểm tra drift và marker

CLI hoặc tài liệu SHALL chỉ ra cách dùng `doctor` (hoặc tương đương) để phát hiện foundation thiếu marker hoặc lệch so với bản khuyến nghị, trước hoặc sau khi `add`.

#### Scenario: Project cũ thiếu marker

- **WHEN** người dùng có project tạo từ bản foundation cũ không có vùng `@servercn:begin|end`
- **THEN** tài liệu SHALL mô tả hành động khắc phục (ví dụ đồng bộ marker từ foundation hiện tại hoặc tạo project mới) và SHALL liên kết với lệnh kiểm tra `doctor` nếu có

### Requirement: Chiến lược kiểm thử không yêu cầu starter riêng

Quy trình kiểm thử được đề xuất (tài liệu contributor hoặc script trong repo) SHALL dùng **cùng** foundation `express-starter` trên thư mục tạm: `init` rồi `add` một hoặc nhiều slug; SHALL **không** yêu cầu một foundation thứ hai chỉ để “test add” trừ khi giải thích mục đích đặc biệt (ví dụ kiến trúc khác).

#### Scenario: Regression init + add trên CI hoặc local

- **WHEN** maintainer chạy script kiểm thử scaffold
- **THEN** script SHALL tạo project từ `express-starter` trong thư mục tạm và chạy `add` với các slug trong phạm vi đã chọn mà không phụ thuộc một starter tách biệt chỉ để mục đích đó

### Requirement: Ghi nhận `--force` như lựa chọn có rủi ro

Tài liệu SHALL mô tả `--force` như cách ghi đè file trùng với rủi ro mất chỉnh sửa cục bộ, và SHALL phân biệt với `--merge` (chèn có marker).

#### Scenario: Người dùng cần ghi đè file đã tồn tại

- **WHEN** người dùng cố `add` và gặp file đã tồn tại
- **THEN** tài liệu SHALL giải thích khi nào `--merge` đủ, khi nào cần `--force`, và hậu quả có thể xảy ra

### Requirement: Bản đồ starter ↔ component (tài liệu)

Tài liệu SHALL có mục (bảng hoặc danh sách) liệt kê **các phần trong starter** dễ trùng với file component khi `add` không `--merge` (ví dụ util/middleware tương ứng slug `async-handler`, cấu hình swagger tương ứng `swagger-docs`, v.v.), và SHALL ghi chú rằng đó là **trùng snapshot** chứ không phải dependency động. Mục đích là giảm lỗi skip và hiểu khi nào cần `--merge` hoặc chỉnh tay.

#### Scenario: Người dùng gỡ rối sau add

- **WHEN** người dùng thấy file “đã tồn tại” hoặc thiếu import sau `add`
- **THEN** tài liệu SHALL trỏ tới bản đồ starter ↔ component và nhắc lại `--merge` / `doctor` cho slug merge-enabled

