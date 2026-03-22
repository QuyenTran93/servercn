## Context

Registry nguồn (`packages/registry/*.json`) ánh xạ slug tới thư mục dưới `packages/templates/...`. Build CLI (`servercn build`) đọc file template và nhúng vào `apps/web/public/sr`. Trên Linux, đường dẫn phân biệt hoa thường; một số entry dùng tên khác với thư mục thật (`validate-objectid` vs `validate-objectId`). Một số cặp `architecture` (mvc/feature) được khai báo nhưng chỉ một bên có template (ví dụ `banking-app/user/postgresql/drizzle`). `updateEnvKeys` đọc/ghi `.env*` bằng chuỗi nối mà không chuẩn hóa EOL.

## Goals / Non-Goals

**Goals:**

- Mọi path template trong registry source (sau khi resolve đầy đủ base path monorepo) trỏ tới thư mục tồn tại trước khi coi build registry thành công.
- `add` / `init` với `--local` trên Linux không fail vì sai path.
- File `.env` / `.env.example` sau khi CLI thêm keys dùng line endings nhất quán (LF).
- Sau `add`/`init`, nếu có file template **không được ghi** vì đã tồn tại (chế độ skip), user **luôn thấy hậu quả** (banner/summary + gợi ý `--force`), không chỉ vài dòng `skip` lẫn trong log.
- **Lộ trình sản phẩm:** giảm dần phụ thuộc vào “skip vs full overwrite” bằng **layout additive + vùng marker** (đã chốt; xem Decision 8) và change `dedupe-shared-component-templates` cho primitives dùng chung.

**Non-Goals:**

- Đổi format JSON registry hoặc schema public (trừ bổ sung field nhỏ phục vụ manifest merge nếu spike chọn hướng đó).
- Thêm tính năng component mới ngoài phạm vi sửa path/template thiếu.
- Sửa toàn bộ tooling Prettier/ESLint toàn monorepo.
- Đảm bảo sau `add --force` project luôn pass ESLint/TypeScript (cần chỉnh tay hoặc tính năng merge sau này).
- Giải bài toán merge hoàn hảo cho mọi ngôn ngữ/file trong một sprint — ưu tiên **phương án khả thi + mở rộng dần**.

## Decisions

1. **Ưu tiên sửa registry JSON thay vì đổi tên hàng loạt thư mục** khi chỉ lệch hoa thường: ít đụng git history, ít risk link ngoài. Nếu slug công khai phải khớp URL (`validate-objectid`), chỉ cần sửa giá trị `templates` trỏ đúng folder `validate-objectId`.

2. **Template thiếu nhánh `mvc`**: hoặc (A) copy/derive template từ `feature` sang `mvc` nếu product cần cả hai, hoặc (B) bỏ khai báo `mvc` trong registry nếu không hỗ trợ. Quyết định cụ thể từng item khi implement (ưu tiên khớp kỳ vọng blueprint/schema hiện có).

3. **`updateEnvKeys`**: gọi chung `normalizeEol` (cùng logic với scaffold) trên `existing` và trên `content` cuối trước `writeFileSync`, đảm bảo output LF.

4. **Kiểm tra tự động (tùy chọn)**: script Node nhỏ hoặc bước trong `servercn build` fail nếu còn path missing — tránh regress. Trade-off: build có thể fail cứng cho đến khi registry sạch.

5. **Scaffold khi file đã tồn tại** (`copyTemplate` + `cloneServercnRegistry` với `conflict !== "overwrite"`):
   - Giữ mặc định **không ghi đè** (an toàn cho repo đã chỉnh tay) nhưng **bắt buộc** có bước tổng kết sau scaffold: số file skipped, liệt kê ngắn (hoặc đầy đủ nếu ít), dòng gợi ý `servercn add ... --force` / `init -f`.
   - **Tùy chọn `strict`** (tên cờ có thể là `--strict` hoặc `--fail-on-skip`): nếu có bất kỳ skip nào → exit code khác 0 để CI/script không tưởng đã apply đủ template.
   - **Phương án đã loại (breaking mặc định)**: đổi default thành fail hoặc prompt tương tác — tránh phá workflow hiện có; ưu tiên cảnh báo + cờ `strict` trước.

6. **`--force` không phải “sửa lint” hay merge thông minh**: chỉ **replace** nội dung file trùng path bằng bytes template (sau normalize EOL nếu có). Hệ quả: (a) có thể **ghi đè** chỉnh sửa của user; (b) các file *khác* trong project vẫn có thể import symbol cũ → **lint/TS vẫn lỗi** nếu user chưa cập nhật chỗ gọi; (c) template có thể không khớp version stack. Giải pháp trong scope change này: **documentation + cảnh báo ngắn khi dùng `--force`** (ví dụ một dòng trong summary sau overwrite), không bắt buộc AST merge trong phase này.

7. **Chiến lược “không mất nội dung trước + đủ content component”** (bảng tham chiếu các phương án; **đã chốt A+B** ở Decision 8):

| Phương án | Ý tưởng | Ưu | Nhược |
|-----------|---------|-----|--------|
| **A. Layout additive** | Template component chủ yếu thêm **file path mới** (`src/.../rate-limiter.ts`); file “trùng” chỉ là barrel/router — tách template thành file nhỏ + **chỉ append** export/register có marker | Ít conflict, dễ hiểu | Cần refactor template/registry; barrel vẫn cần quy tắc append |
| **B. Marker regions** | Trong file dễ trùng (vd `app.ts`, `index.ts`), template ship vùng `// @servercn:begin <id>` … `// @servercn:end <id>`; CLI **chỉ thay thế vùng** đó, giữ phần ngoài | Kiểm soát rõ, diff nhỏ | User xóa marker → merge fail; cần doc & fallback |
| **C. Manifest patch** | Registry kèm **danh sách thao tác** (append line, insert after regex, add import) thay vì full file | Linh hoạt theo component | Chi phí schema + engine patch; dễ lỗi nếu project lệch chuẩn |
| **D. Sidecar / unified diff** | Ghi `path.servercn-new` hoặc `.patch`, user hoặc `git apply` | An toàn tuyệt đối cho file gốc | UX nặng, không “một lệnh xong” |
| **E. Three-way / git merge-file** | Cần base (template cũ) — khó khi không có lịch sử | Chuẩn industry | Khó embed trong CLI tối giản |

**Lộ trình triển khai:** Phase 1 = visibility (`strict`, summary skip, doc `--force`) **đã nêu ở trên**. Phase 2 = prototype merge theo Decision 8 trên 1–2 component pilot. **Phase 3** (mở rộng hàng loạt registry/template) = **follow-up change riêng**, không gói trong việc đóng `fix-registry-scaffold-integrity`; xem `tasks.md` mục follow-up.

8. **Merge scaffold — hướng đã chốt (sản phẩm):** kết hợp **A. Layout additive** và **B. Marker regions**.
   - **Additive:** component MUST chủ yếu thêm **file path mới**; không ship lại toàn bộ primitives đã thuộc foundation hoặc **shared** (đường đi cụ thể do change `dedupe-shared-component-templates` và quy ước template). Trùng path chỉ chấp nhận khi file đó **thuộc quyền sở hữu rõ của component** và không chồng lên file foundation đã cố định.
   - **Marker:** các điểm wiring vào file đã có (vd `app.ts`, `routes/index.ts`) MUST dùng cặp `// @servercn:begin <component-id>` … `// @servercn:end <component-id>`; CLI (Phase 2) MUST chỉ cập nhật nội dung **giữa** hai marker, giữ nguyên phần ngoài. ID MUST khớp slug hoặc giá trị documented trong registry cho component đó.
   - **Manifest patch (C):** không chọn làm trục chính trong phase đầu; có thể đánh giá lại sau pilot nếu marker không đủ cho một lớp component.
   - **Cờ CLI:** ưu tiên prototype với **`--merge`** (hoặc tên tương đương documented) khi áp dụng hành vi marker; mặc định `add` không `--merge` giữ hành vi skip/`--force` hiện tại cho đến khi pilot ổn định và quyết định default sau.
   - **Fallback:** nếu thiếu marker khi user bật merge cho component yêu cầu marker, MUST fail rõ hoặc documented fallback (gợi ý `--force` / chỉnh tay) — không im lặng bỏ wiring.

## Risks / Trade-offs

- **[Risk]** Đổi path trong registry làm lệch với tài liệu / bookmark cũ → **Mitigation**: slug không đổi, chỉ đổi đường dẫn nội bộ `templates`.

- **[Risk]** Thêm template `mvc` trùng lặp `feature` gây drift → **Mitigation**: nếu hai architecture phải giống nhau, cân nhắc symlink hoặc một nguồn (ngoài scope nếu tooling không hỗ trợ).

- **[Risk]** `normalizeEol` trên `.env` làm thay đổi toàn file (diff lớn) → **Mitigation**: chỉ áp dụng khi CLI thực sự ghi file (đã có thay đổi keys).

- **[Risk]** `--strict` làm fail các script cũ vốn cố tình skip trùng file → **Mitigation**: chỉ bật khi user/CI truyền cờ; mặc định vẫn exit 0 nếu chỉ cảnh báo.

- **[Risk]** User tưởng `--force` = “hết lỗi” → **Mitigation**: help/README + (tùy chọn) dòng nhắc sau khi có file bị overwrite bằng `--force`.

- **[Risk]** Marker merge làm hỏng file nếu regex/anchor sai → **Mitigation**: dry-run mode hoặc preview diff; unit test trên mẫu file.

## Migration Plan

1. Sửa registry + template trên branch.
2. Chạy `servercn build`, commit `apps/web/public/sr`.
3. Publish web + CLI theo quy trình release hiện có.
4. Rollback: revert commit và redeploy artifact cũ.

## Open Questions

- Có schema `user` PostgreSQL Drizzle bắt buộc có cả `mvc` và `feature` không, hay có thể giữ một architecture và cập nhật registry cho khớp?
- Tên cờ CLI cuối cùng: `--strict` vs `--fail-on-skip` (document trong README/help).
- Sau pilot: có đổi **mặc định** `add` thành auto-merge khi file đích có marker hay luôn yêu cầu `--merge` — quyết định khi có dữ liệu pilot và feedback.
