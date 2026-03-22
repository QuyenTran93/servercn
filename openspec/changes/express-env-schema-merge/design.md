## Context

Merge marker hiện chỉ áp dụng cho `app.ts` / `routes/index.ts`. File `env` trùng path nhưng khác cấu trúc khiến `--merge` không dùng được. Maintainer đã **thống nhất thứ tự**: (1) spike chuẩn inner merge + zod, (2) pilot một case, (3) rollout đầy đủ foundation/arch, (4) doc.

## Goals / Non-Goals

**Goals:**

- Một **quy ước inner** rõ ràng (sau spike) để `applyMarkerMerge` sinh file TypeScript hợp lệ.
- Pilot **end-to-end**: `add <pilot> --merge` cập nhật env trên project đã `init` foundation có marker.

**Non-Goals:**

- Gộp mọi provider OAuth trong một PR pilot (chỉ một variant đã chốt trong tasks).
- Thay thế toàn bộ `dedupe-shared-component-templates` trong change này.

## Decisions

1. **Chuẩn foundation:** `env` dùng **`zod` + `safeParse` + export typed**; component pilot MUST refactor fragment để **khớp** mô hình đó (không giữ `interface` + object literal trên path merge).
2. **Vị trí marker:** Trên pilot, marker nằm trên file env đích đã chốt (vd feature `src/shared/configs/env.ts` cho express-starter). ID marker = **slug merge** đã chốt trong tasks (sau spike; có thể trùng registry slug hoặc suffix provider nếu CLI `add` yêu cầu).
3. **Inner merge:** Spike MUST chọn một trong các kiểu: mở rộng `z.object({...})` (fields mới trong object literal), hoặc `envSchema = baseSchema.extend({...})`, hoặc block `// merged fields` — **một** kiểu cho toàn bộ rollout để tránh mỗi component một kiểu.
4. **Rollout:** Sau pilot pass test, lặp **MVC** (`src/configs/env.ts` tương đương) và **mọi** mục `EXPRESS_MERGE_FOUNDATIONS` có cùng relative path env.

## Risks / Trade-offs

- **[Risk]** Zod version / import path lệch giữa foundation và component → **Mitigation:** spike trên một foundation, một lockfile.
- **[Risk]** Nhiều component cùng sửa env → thứ tự merge hoặc nhiều vùng marker → **Mitigation:** pilot một slug; document thứ tự `add` nếu cần.

## Migration Plan

1. Ship pilot + doc “Existing projects”.
2. Rollout foundation; `servercn build`; selftest.
3. Rollback: revert template + slots.

## Open Questions

- Marker id chính xác cho OAuth GitHub (registry slug vs `oauth-github`) — **chốt trong task spike** sau khi đọc lệnh `add` + variant.
