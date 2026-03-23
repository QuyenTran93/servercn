## Context

Batch 1 đã ship merge cho ba slug; foundation đã có marker tương ứng. Phase 2 lặp **cùng cơ chế** (`isMergeOnlyFragment`, `--merge`) cho nhóm component kế tiếp trong hàng đợi overlap (xem `expand-scaffold-merge-rollout` phụ lục A — archive hoặc bản copy trong repo).

## Goals / Non-Goals

**Goals:**

- Hoàn thành ít nhất **một** batch component mới với wiring merge documented.
- Giữ **không regress** batch 1 (selftest + bảng README).

**Non-Goals:**

- OAuth / file-upload / RBAC full stack trong một PR (overlap quá lớn — tách batch 3 hoặc đợi dedupe).
- Đổi default CLI `add` sang auto-merge.

## Decisions

1. **Batch 2 (đã chốt):** chỉ **`request-validator`**.  
   - **`health-check` — không đưa vào batch 2:** foundation đã mount `/api/health`; component health-check trùng controller/routes → merge vào `app` dễ xung đột route hoặc duplicate; để batch sau / thiết kế riêng.  
   - **`response-formatter` — hoãn:** không có wiring `app`/`routes` rõ; chỉ overlap primitives.

2. **Thứ tự thực hiện:** foundation markers → template từng slug → build → README + `doctor`.

3. **Dedupe:** nếu `dedupe-shared-component-templates` hoàn thành trước phase 2, **ưu tiên** gom primitives rồi mới thêm marker mới để giảm file skip.

## Risks / Trade-offs

- **[Risk]** `health-check` đụng route đã tồn tại → **Mitigation:** spike hoặc đưa ra khỏi batch 2.
- **[Risk]** `doctor` danh sách slug lệch README → **Mitigation:** một nguồn sự thật (mảng const chung) — optional refactor nhỏ trong tasks.

## Migration Plan

Giống batch 1: sửa template → `servercn build` → commit artifact; release note “Existing projects” nếu thêm marker foundation.

## Open Questions

- Batch 2 có cố định 2 slug hay mở rộng 4 sau khi spike `health-check`?
