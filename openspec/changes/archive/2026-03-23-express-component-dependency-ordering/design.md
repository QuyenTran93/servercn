## Context

Các phase trước đã thiết lập marker-based merge và fail-fast cho một số merge-critical path, nhưng vẫn chưa giải quyết triệt để vấn đề “thứ tự add”. Nhiều component có quan hệ phụ thuộc logic (hoặc shared integration points) nên cài sai thứ tự dễ gây skip, duplicate wiring hoặc thiếu middleware chain.

## Goals / Non-Goals

**Goals:**
- Định nghĩa dependency graph rõ ràng cho component Express có overlap cao.
- Thiết kế rule kiểm tra thứ tự add tại thời điểm chạy `servercn add`.
- Cung cấp remediation rõ ràng (gợi ý add trước component nào, khi nào dùng `--merge`/`--force`).
- Đồng bộ test/docs/doctor theo cùng policy.

**Non-Goals:**
- Không thay đổi business behavior của từng component.
- Không giải quyết toàn bộ dedupe shared template trong change này.
- Không tự động refactor project cũ ngoài cảnh báo/hướng dẫn.

## Decisions

1. **Dependency rules dạng explicit graph**
   - Mỗi component overlap-prone khai báo `requires` / `conflictsWith` / `orderAfter`.
   - Ưu tiên lưu tại constants của CLI để tựtest dễ, không phụ thuộc registry schema mới ngay.
   - Alternative: suy luận động từ file overlap -> khó ổn định, dễ false positive.

2. **Validation tại command `add`**
   - Trước scaffold, CLI kiểm tra graph so với components đã tồn tại trong project.
   - Nếu vi phạm hard dependency -> fail-fast kèm lệnh đề xuất.
   - Nếu soft ordering -> warn có remediation.

3. **Dependency-aware overlap policy**
   - Merge-critical path vẫn dùng marker/fail-fast như hiện tại.
   - Dependency graph là lớp bảo vệ bổ sung, quyết định “nên add cái gì trước/sau”.

4. **Incremental rollout**
   - Phase đầu chỉ áp dụng cho nhóm slug rủi ro cao (`rbac`, `request-validator`, `verify-auth-middleware`, và nhóm liên quan nếu xác nhận).
   - Mở rộng dần khi có telemetry/selftest chứng minh hiệu quả.

## Risks / Trade-offs

- **[Risk]** Rule quá chặt gây chặn flow hợp lệ của user  
  **Mitigation:** phân loại hard vs soft rules, cho phép override có chủ đích.

- **[Risk]** Rule drift giữa docs và code  
  **Mitigation:** selftest cho dependency graph + docs checklist trong PR.

- **[Risk]** Tăng độ phức tạp khi bảo trì  
  **Mitigation:** giữ graph tập trung một chỗ, naming rõ, regression tests bắt buộc.

## Migration Plan

1. Chốt shortlist component cần dependency rules.
2. Implement constants + validator cho `add`.
3. Wire warning/fail messages và doctor hints.
4. Cập nhật docs/selftests.
5. Smoke `init + add` theo nhiều ordering permutations.

## Open Questions

- Dependency graph có cần đẩy lên registry schema để data-driven hoàn toàn không?
- Cần flag `--ignore-deps` cho advanced users hay giữ policy cứng?
- Phạm vi phase này có bao gồm nhóm `oauth`/`file-upload` variants hay để phase sau?
