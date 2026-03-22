## Why

Registry JSON trỏ tới đường dẫn template không khớp với filesystem (sai hoa thường hoặc thiếu thư mục `mvc`/`feature`), khiến `servercn build` cảnh báo và trên Linux (case-sensitive) `add --local` có thể thất bại hoặc sinh artifact rỗng. Ngoài ra, cập nhật `.env` bằng cách nối chuỗi có thể tạo file line endings hỗn hợp (CRLF + LF), lệch với Prettier/`endOfLine: lf`. Khi `add` component, nếu file đích đã tồn tại, CLI mặc định **skip** từng file — người dùng dễ không để ý, project thiếu export/import mới và **ESLint/TypeScript báo lỗi** dù lệnh vẫn “success”.

## What Changes

- Sửa khai báo `templates` trong `packages/registry` (hoặc đổi tên thư mục dưới `packages/templates`) để mọi path tồn tại và khớp chính xác trên Linux.
- Bổ sung hoặc hoàn thiện template còn thiếu (ví dụ `banking-app` PostgreSQL Drizzle `user` — nhánh `mvc` nếu registry hứa hẹn).
- Chuẩn hóa EOL khi ghi/ghi đè `.env` / `.env.example` trong `updateEnvKeys` để tránh file hỗn hợp.
- Cải thiện hành vi khi **file đã tồn tại** trong `add`/`init` scaffold: không để skip âm thầm — tổng hợp cảnh báo rõ, gợi ý `--force`, và/hoặc tùy chọn fail (ví dụ `--strict`) để CI không “xanh” khi thiếu file template. **Lưu ý sản phẩm:** `--force` chỉ thay nội dung file bằng template; không phải “sửa đúng” project — vẫn có thể sai (mất code tay, import lệch, lint fail) nếu template không khớp ngữ cảnh; cần document rõ để user không kỳ vọng sai.
- **Hướng dài hơn (đề nghị stakeholder):** có lộ trình để **áp dụng đủ “integration surface” của component** (export, route, middleware, v.v.) khi file đích đã có **mà không ghi đè cả file** — thông qua một trong các chiến lược trong `design.md` (marker, additive-only layout, manifest patch, sidecar diff, …), sau spike chọn phương án khả thi với codebase hiện tại.
- (Tùy chọn) Script hoặc bước CI kiểm tra registry path ↔ template trước khi merge.

## Capabilities

### New Capabilities

- `cli-registry-integrity`: Hành vi CLI và dữ liệu registry: mọi template path trong source registry phải resolve tới thư mục tồn tại sau khi build; scaffold không tạo file `.env` với line endings hỗn hợp sau khi merge keys; khi scaffold bỏ qua file vì đã tồn tại, user được báo rõ và có lối thoát (`--force` / `--strict`) để tránh trạng thái “success nhưng thiếu code”; tài liệu MUST phân biệt “ghi đè template” với “đảm bảo đúng / hết lint”; **mục tiêu sản phẩm** gồm lộ trình merge có kiểm soát (sau spike) để không mất nội dung user nhưng vẫn đủ wiring component.

### Modified Capabilities

- (Không có — chưa có spec cũ trong `openspec/specs/`.)

## Impact

- `packages/registry/**/*.json`
- `packages/templates/**` (đổi tên thư mục nếu chọn align với slug)
- `packages/cli/src/utils/update-env.ts`
- `apps/web/public/sr/**` sau khi chạy lại `servercn build`
- Người dùng `add` / `init` trên Linux và pipeline build registry
- `packages/cli/src/lib/copy.ts`, lệnh `add`/`init` (luồng `conflict: skip` vs `overwrite`)
- (Sau spike) có thể thêm manifest merge, marker trong template, hoặc module CLI mới cho chiến lược ghi
