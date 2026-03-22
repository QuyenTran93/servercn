## Context

Batch 1 (`rate-limiter`, `security-header`, `async-handler`) và batch 2 (`request-validator`) đã có marker trên foundation và fragment merge trong CLI. Foundation MVC `src/app.ts` đã gắn sẵn `notFoundHandler`, `errorHandler`, và `setupSwagger(app)` — các component cùng tên hoặc swagger có thể **trùng file** với foundation nhưng **điểm inject** cho `--merge` có thể khác với slug chỉ thêm middleware giữa route (cần spike vị trí marker).

Change `rbac-scaffold-merge` xử lý riêng RBAC; phase 3 **không** gộp RBAC/OAuth/file-upload để giữ PR review được.

## Goals / Non-Goals

**Goals:**

- Sau spike, chốt **1–2 slug** trong nhóm ứng viên và ship đủ: marker foundation + fragment merge + `EXPRESS_MERGE_*` + README + `doctor` + build artifact.
- Giữ **không regress** mọi slug merge đã ship (selftest + semantic marker).

**Non-Goals:**

- Triển khai RBAC merge trong change này (dùng `rbac-scaffold-merge` hoặc change sau).
- OAuth, file-upload, hoặc redesign default `add` (auto-merge).
- Thay thế hoàn toàn nội dung middleware có sẵn trong foundation bằng template component nếu không có quyết định rõ trong spike (tránh breaking im lặng).

## Decisions

1. **Batch 3 (đã chốt sau spike):** chỉ **`verify-auth-middleware`**.  
   - **`swagger-docs` — không đưa vào batch 3:** foundation đã gọi `setupSwagger(app)`; template gần tương đương `configs/swagger.ts`, merge ít giá trị.  
   - **`not-found-handler` / `global-error-handler` — hoãn:** cần bọc `app.use(notFoundHandler)` / `app.use(errorHandler)` hiện có trong marker hoặc thiết kế lại thứ tự; tách batch sau.  
   - **`verify-auth-middleware`:** wiring mount `user.routes` giống `request-validator` (MVC `app.ts`, feature `routes/index.ts`).
2. **Một slug = một cặp marker** trên một file cho đến khi có quyết định khác; tránh chồng vùng không tách biệt.
3. **Feature vs MVC:** giữ đối xứng với batch 1–2 — nếu wiring chỉ ở `app.ts` (feature), ghi rõ trong `EXPRESS_MERGE_SLOTS`; nếu ở `routes/index.ts`, tái dùng pattern `request-validator` / `async-handler`.
4. **Dedupe:** nếu `dedupe-shared-component-templates` land trước khi code phase 3, SHOULD ưu tiên gom primitives trước khi thêm marker mới (giảm skip không cần thiết).

## Risks / Trade-offs

- **[Risk]** Marker đặt sai thứ tự so với middleware hiện có → hành vi Express khác. **Mitigation:** spike + test thủ công `add <slug> --merge` trên temp project.
- **[Risk]** Hai component (not-found vs global-error) cùng đụng chuỗi middleware cuối. **Mitigation:** chốt từng slug riêng hoặc một marker có thứ tự được design rõ trong spike.
- **[Risk]** `doctor` / README lệch `EXPRESS_MERGE_SLUGS`. **Mitigation:** một nguồn sự thật trong `express-merge-slots.ts` và checklist task.

## Migration Plan

1. Spike + chốt slug trong `tasks.md` / cập nhật mục Decisions ở đây nếu lệch đề xuất ban đầu.
2. Sửa foundation + template → `servercn build` → commit `apps/web/public/sr`.
3. Cập nhật CLI const, README, `doctor`.
4. `npm run typecheck` + `npm run test:merge-marker`.
5. Rollback: revert commit template/registry/artifact/CLI.

## Open Questions

- Sau spike, có chọn **một** slug (vd chỉ `swagger-docs`) hay cặp error handlers trong cùng PR?
- Component có cần merge vào **cùng dòng** với `setupSwagger` / `notFoundHandler` hiện có hay chỉ thêm khối riêng có thứ tự tương đương?
