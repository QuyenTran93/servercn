## Context

`rbac` là component “nặng” overlap (xếp cao trong phụ lục overlap của rollout). Pattern đã chuẩn: **một cặp marker / slug** trên điểm integration; merge-only fragment; phần còn lại additive.

## Goals / Non-Goals

**Goals:**

- Sau `add rbac --merge` trên foundation mới, **router RBAC** được mount đúng; file user-owned ngoài marker không bị ghi đè.
- Đồng bộ README + `doctor` với danh sách slug merge.

**Non-Goals:**

- Trong cùng change: gỡ toàn bộ file trùng primitives (`api-error`, `env`, …) — có thể follow-up cùng `dedupe-shared-component-templates`.
- Đổi contract API route ngoài việc cần thiết để khớp mount hiện có (MVC vs feature).

## Decisions

1. **Mount path:** giữ **tương thích** với template feature hiện tại: `router.use("/v1/users", UserRouter)`; MVC: `app.use("/api/v1/users", userRoutes)` (giống `request-validator` để user có thể kết hợp cả hai component trên cùng prefix — nếu xung đột route, user tự tách path trong fork).

2. **Vị trí marker trên foundation:** chèn khối `rbac` **sau** `request-validator` và **trước** `async-handler` trên cùng file (MVC `app.ts`, feature `routes/index.ts`) để thứ tự đọc ổn định.

3. **Feature `rbac`:** thay `feature/src/routes/index.ts` từ full router chỉ có users → **merge-only** fragment (foundation đã có health + markers khác).

4. **Tests template:** `app.test.ts` / `server.test.ts` trong component — không đụng trừ khi path import vỡ; ưu tiên không phá build.

## Risks / Trade-offs

- **[Risk]** Hai component cùng mount `/api/v1/users` — **Mitigation:** document; user đổi path trong merge fragment nếu cần.
- **[Risk]** Skip vẫn xảy ra với file primitives — **Mitigation:** ghi trong README; sau dedupe shared.

## Migration Plan

1. Sửa foundation + template rbac.
2. `servercn build`, commit artifact.
3. Typecheck + `test:merge-marker`.

## Open Questions

- Có tách mount prefix mặc định sang `/api/rbac/...` trong bản major sau không?
