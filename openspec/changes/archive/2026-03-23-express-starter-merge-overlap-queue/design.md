## Context

Spec `scaffold-merge` đã gom yêu cầu hành vi merge theo từng đợt. Trong registry, **20** slug Express có **ít nhất một file** trùng đường dẫn tương đối với cây `packages/templates/node/express/foundation/express-starter/{mvc,feature}` (so khớp bằng walk file; không dùng built JSON). Năm slug đã nằm trong `EXPRESS_MERGE_SLUGS`; phần còn lại là backlog trong **một** `tasks.md`.

## Goals / Non-Goals

**Goals:**

- Một thứ tự **cố định** trong `tasks.md` (overlap count giảm dần); maintainer xử lý **tuần tự** từng mục.
- Mỗi mục kết thúc bằng trạng thái rõ: **merge-enabled** (đủ bar `scaffold-merge`), **hoãn / không merge** (ghi lý do trong task hoặc design), hoặc **ủy quyền** change khác (vd `rbac`).

**Non-Goals:**

- Một PR duy nhất cho cả 20 slug.
- Bắt buộc merge-enable mọi slug (vd chỉ overlap `env.ts` có thể chỉ cần dedupe hoặc doc).

## Decisions

1. **Thứ tự hàng đợi:** theo **số path trùng** (mvc + feature, đếm distinct `arch:path`) **giảm dần**; slug **cùng mức** xếp theo tên slug alphabet. Danh sách đã tính tại thời điểm mở change (xem `tasks.md`).
2. **Tái sinh danh sách:** chạy script một lần (vd `node` + `glob`) so `packages/registry/component/*.json` → đường template `packages/templates/node/express/component/...` với tập file foundation; cập nhật `tasks.md` khi thêm/xóa component overlap.
3. **`rbac`:** ưu tiên align với change `rbac-scaffold-merge` — tránh hai PR cùng sửa wiring; có thể tick mục queue sau khi change kia merge hoặc gộp quyết định trong một nhánh.
4. **`dedupe-shared-component-templates`:** các slug overlap chủ yếu primitives (vd `env`, `http-status-codes`) có thể **hoàn thành mục** bằng quyết định “chỉ dedupe + doc, không thêm marker” ghi rõ trong task.

## Tiến độ queue — quyết định spike (apply)

Đã chạy lại script đếm overlap (2026-03-22): **20 slug**, số path trùng khớp bảng trong `tasks.md`.

| Slug | Quyết định | Ghi chú ngắn |
|------|------------|----------------|
| `oauth` | Hoãn merge-enabled | Nhiều path + multi-provider; cần change/PR riêng, không gói trong một mục queue. |
| `file-upload` | Hoãn | Overlap lớn (middleware, utils); spike wiring riêng. |
| `verify-auth-middleware` | Đã merge-enabled | Giữ như hiện trạng. |
| `rbac` | Ủy quyền | Theo `rbac-scaffold-merge`; tránh trùng PR. |
| `not-found-handler` | Hoãn | Cần thiết kế bọc `app.use(notFoundHandler)` cuối `app.ts` / tương đương feature. |
| `global-error-handler` | Hoãn | Tương tự chuỗi error cuối `app.ts`. |
| `health-check` | Hoãn | Trùng `/api/health` với foundation. |
| `swagger-docs` | Hoãn / doc | Foundation đã `setupSwagger(app)`; merge ít giá trị. |
| `logger` | Hoãn / dedupe | Chủ yếu trùng `logger.ts` / `app.ts`; ưu tiên dedupe shared. |
| `rate-limiter` … `security-header` | Đã merge-enabled | Năm slug trong `EXPRESS_MERGE_SLUGS` (gồm `verify-auth-middleware`). |
| `error-handler` | Hoãn | Overlap primitives + pipeline lỗi; chưa có điểm merge rõ. |
| `response-formatter` | Hoãn | Overlap `api-response` / constants; chưa có wiring merge rõ. |
| `email-service` | Hoãn | Overlap chủ yếu `env.ts`. |
| `env` | Không merge marker | File trùng foundation; `--merge` không có chỗ splice wiring riêng. |
| `http-status-codes` | Không merge marker | Chỉ constants; dedupe/doc. |
| `jwt-utils` | Không merge marker | Overlap `env`; wiring JWT không qua vùng marker chung. |
| `shutdown-handler` | Không merge marker | Template chỉ `utils/shutdown.ts`; foundation `server.ts` đã `configureGracefulShutdown` — không fragment merge riêng. |

## Risks / Trade-offs

- **[Risk]** Thứ tự overlap count không phản ánh phụ thuộc nghiệp vụ → **Mitigation:** chỉnh thứ tự trong `tasks.md` có ghi chú, giữ nguyên nguyên tắc “một list”.
- **[Risk]** Danh sách lệch sau khi registry đổi → **Mitigation:** chạy lại script trước khi đóng change.
- **[Risk]** PR dài nếu nhiều slug một lần → **Mitigation:** nhiều PR nhỏ nhưng cùng cập nhật `tasks.md` trong change này.

## Migration Plan

Không có migration end-user tập trung ngoài từng slug merge-enabled (đã mô tả trong `scaffold-merge`).

## Open Questions

- Có gộp slug “chỉ overlap nhẹ” thành một task dedupe chung hay vẫn tách dòng?

## Phụ lục — Script tham chiếu (reproduce overlap)

Chạy từ root repo (cần `glob` từ dependency workspace):

```bash
node <<'NODE'
const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const root = process.cwd();
const foundationBase = path.join(root, "packages/templates/node/express/foundation/express-starter");
function collectFiles(archRoot) {
  if (!fs.existsSync(archRoot)) return new Set();
  return new Set(
    globSync("**/*", { cwd: archRoot, nodir: true }).map((f) => f.replace(/\\/g, "/"))
  );
}
const fMvc = collectFiles(path.join(foundationBase, "mvc"));
const fFeat = collectFiles(path.join(foundationBase, "feature"));
const registryDir = path.join(root, "packages/registry/component");
for (const rf of fs.readdirSync(registryDir).filter((f) => f.endsWith(".json"))) {
  const j = JSON.parse(fs.readFileSync(path.join(registryDir, rf), "utf8"));
  const slug = j.slug;
  const express = j.runtimes?.node?.frameworks?.express;
  if (!express) continue;
  /* … walk templates.mvc / templates.feature / variants … */
}
NODE
```

(Bản đầy đủ đã dùng khi tạo `tasks.md`; có thể trích vào `packages/cli` hoặc `scripts/` sau nếu muốn CI.)
