## Context

Phase A đã hoàn tất trong `oauth-variant-aware-env-merge`: marker env OAuth tách `oauth-google` / `oauth-github`, `resolveExpressMergeMarkerIds` xử lý variant `google-github`. Foundation Express merge-layout đã dùng `zod` + `safeParse` trên file env.

Phase B mở rộng cùng pattern cho **RBAC / JWT utils / file upload** — các component có `env` trùng path với foundation nhưng template vẫn kiểu cũ.

## Goals / Non-Goals

**Goals:**

- Một marker id rõ ràng cho mỗi “vùng splice” env; fragment component chỉ chứa inner fields `zod` trong `z.object({ … })`.
- `add rbac|jwt-utils|file-upload --merge` splice đúng marker, không ghi đè toàn file env.
- Variant `file-upload` không ghi đè lẫn nhau: marker riêng `file-upload-cloudinary` vs `file-upload-imagekit` (tương tự OAuth).

**Non-Goals:**

- Refactor toàn bộ dedupe shared templates (`dedupe-shared-component-templates`) trong change này.
- Thay đổi contract route / mount của `rbac` (thuộc `rbac-scaffold-merge`); change này chỉ **env schema merge** trừ khi cần sửa import tối thiểu do file env chỉ còn fragment.

## Decisions

1. **Marker ids**
   - `rbac` → marker `rbac` (slug component = `rbac`).
   - `jwt-utils` → marker `jwt-utils`.
   - `file-upload` → `file-upload-cloudinary` | `file-upload-imagekit` theo variant (map trong `resolveExpressMergeMarkerIds`, giống OAuth).

2. **Inner merge convention** (giữ thống nhất Phase A): marker nằm **trong** `export const envSchema = z.object({ … })`; inner fragment chỉ là các dòng field + dấu phẩy hợp lệ.

3. **Field typing**: khớp style foundation hiện có — URL dùng `z.url()` khi semantic là URL; secret string dùng `z.string()` (có thể `.min(n)` nếu đã thống nhất ở component khác như `env-config`).

4. **EXPRESS_MERGE_COMPONENT_SLUGS**: thêm `rbac`, `jwt-utils`, `file-upload` để `add` cảnh báo `--merge` giống các component merge-enabled khác.

5. **Thứ tự marker trên foundation env**: nhóm OAuth (google/github) trước, sau đó `rbac`, `jwt-utils`, rồi `file-upload-*` (hoặc thứ tự alphabet theo slug) — chốt một thứ tự cố định trong PR và giữ đồng bộ mọi foundation.

## Risks / Trade-offs

- **[Risk]** Song song `rbac-scaffold-merge` sửa cùng tree `rbac` → **Mitigation:** rebase theo thứ tự; tách commit env vs route nếu cần.
- **[Risk]** User đã chỉnh tay `env.ts` trong vùng marker → merge vẫn replace inner → **Mitigation:** document; khuyến nghị custom ngoài marker.
- **[Risk]** Thiếu dependency `zod` trên project cũ không dùng foundation mới → **Mitigation:** foundation/registry đã khai báo `zod`; không thuộc Phase B trừ khi phát hiện lệch registry.

## Migration Plan

1. Ship templates + CLI matrix + docs.
2. `servercn build`; chạy `npm run test:cli-express-merge` và typecheck CLI.
3. Rollback: revert template + slots.

## Open Questions

- JWT secrets có bắt buộc `.min(32)` trên fragment `rbac`/`jwt-utils` để khớp `env-config` hay giữ `z.string()` tối thiểu để không phá project dev sẵn có secret ngắn?
