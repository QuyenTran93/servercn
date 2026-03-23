## ADDED Requirements

### Requirement: Marker env cho rbac, jwt-utils và file-upload trên foundation merge-layout

Với mỗi foundation trong `EXPRESS_MERGE_FOUNDATIONS`, file env theo kiến trúc SHALL chứa cặp marker rỗng cho `rbac`, `jwt-utils`, `file-upload-cloudinary`, và `file-upload-imagekit` (bên cạnh marker OAuth theo provider đã định nghĩa trước đó), đặt trong `export const envSchema = z.object({ … })` theo quy ước inner merge đã thống nhất.

#### Scenario: Maintainer kiểm tra MVC env

- **WHEN** maintainer mở `mvc/src/configs/env.ts` của bất kỳ foundation nào trong `EXPRESS_MERGE_FOUNDATIONS`
- **THEN** file SHALL chứa đủ các cặp `// @servercn:begin|end` cho `rbac`, `jwt-utils`, `file-upload-cloudinary`, và `file-upload-imagekit`

#### Scenario: Maintainer kiểm tra feature env

- **WHEN** maintainer mở `feature/src/shared/configs/env.ts` của bất kỳ foundation nào trong `EXPRESS_MERGE_FOUNDATIONS`
- **THEN** file SHALL chứa đủ các cặp marker tương tự MVC cho cùng các id

### Requirement: Fragment merge-only env từ component

Template component `rbac`, `jwt-utils`, và từng variant `file-upload` (Cloudinary, Imagekit) SHALL ship file env tại path trùng foundation dưới dạng merge-only (một cặp begin/end đúng marker id), inner body SHALL là các field `zod` tương thích với foundation (không ship full module `safeParse` trong file fragment).

#### Scenario: Merge rbac env

- **WHEN** user chạy `add rbac --merge` trên project đã có marker `rbac` trong env foundation
- **THEN** các biến môi trường cần cho rbac SHALL xuất hiện trong schema env đích trong vùng marker mà không ghi đè toàn file ngoài marker

#### Scenario: Merge jwt-utils env

- **WHEN** user chạy `add jwt-utils --merge` trên project đã có marker `jwt-utils`
- **THEN** các field JWT SHALL được splice vào đúng vùng marker

#### Scenario: Merge file-upload theo variant

- **WHEN** user chạy `add file-upload --merge` và chọn Cloudinary (hoặc Imagekit)
- **THEN** merge SHALL áp dụng vào marker `file-upload-cloudinary` (hoặc `file-upload-imagekit`) tương ứng mà không ghi đè marker của variant kia

### Requirement: CLI và selftest đồng bộ ma trận env

`EXPRESS_MERGE_SLOTS` (và mọi selftest foundation đọc từ đó) SHALL liệt kê đủ marker env Phase B trên đúng path file per architecture. `resolveExpressMergeMarkerIds` SHALL map `file-upload` + variant sang đúng marker id.

#### Scenario: Selftest foundation sau Phase B

- **WHEN** maintainer chạy selftest merge foundation cho Express
- **THEN** mọi foundation trong `EXPRESS_MERGE_FOUNDATIONS` SHALL có đủ dòng `// @servercn:begin` cho từng marker env được khai báo trong slots
