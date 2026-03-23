## Why

Nhiều component Express scaffold **cùng path** (vd `src/constants/status-codes.ts`, `src/utils/api-error.ts`) với nội dung copy-paste giữa `mvc`/`feature` và giữa các component khác nhau. Khi user `add` lần lượt, CLI **skip** file trùng → dễ dùng nhầm bản `ApiError`/`STATUS_CODES` của component trước, hoặc thiếu symbol mới, dẫn tới **TypeScript / ESLint lỗi** và khó bảo trì. Việc chuẩn hóa một **nguồn shared** (hoặc namespace path riêng) giảm drift và xung đột path.

## What Changes

- Định nghĩa **cây template shared** dưới `packages/templates/...` (vd `shared/errors`, `shared/constants`) hoặc quy ước path duy nhất được nhiều component import.
- Refactor dần các component hiện có: bỏ file trùng trong từng component, cập nhật import trong template; cập nhật `packages/registry` + rebuild `apps/web/public/sr` nếu cần. Khớp với hướng **additive** trong change `fix-registry-scaffold-integrity` (Decision 8): shared primitives để component chủ yếu thêm file mới + wiring qua marker.
- (Tùy chọn) Quy tắc **lint/format** trên thư mục template trong CI để file sinh ra khớp `prettier`/`eslint` của foundation.
- **BREAKING** (đối với user đã chỉnh tay file trùng path): sau migrate path có thể khác; cần ghi rõ trong release note / migration nhỏ.

## Capabilities

### New Capabilities

- `template-shared-primitives`: Quy ước và hành vi scaffold cho phần dùng chung (`ApiError`, `STATUS_CODES`, có thể mở rộng) — một nguồn, import nhất quán; giảm trùng path không cần thiết giữa các component.

### Modified Capabilities

- (Không có spec gốc trong `openspec/specs/` — để trống.)

## Impact

- `packages/templates/node/express/component/**` (nhiều slug)
- `packages/cli` (nếu thêm bước copy shared hoặc manifest)
- `apps/web/public/sr/**` sau `servercn build`
- Tài liệu README / hướng dẫn add component
