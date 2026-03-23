## Context

Env merge cho OAuth vừa được rollout theo marker chung `oauth`, nhưng cơ chế `applyMarkerMerge` hiện thay toàn bộ phần inner giữa marker begin/end. Vì vậy khi user chạy `add oauth --merge` nhiều lần với các variant khác nhau, nội dung env provider có thể bị ghi đè theo thứ tự lệnh. Mục tiêu của change này là tách merge identity theo provider để hành vi merge ổn định và dễ dự đoán.

## Goals / Non-Goals

**Goals:**
- Tách marker env OAuth thành provider-specific markers để `google` và `github` không ghi đè nhau.
- Chuẩn hóa merge resolution trong CLI theo variant được chọn.
- Giữ policy migration ở mức warn-only cho project cũ chỉ có marker `oauth`.
- Đồng bộ foundation templates, component fragments, `doctor`, selftests, và tài liệu.

**Non-Goals:**
- Tự động sửa project hiện có để thêm marker mới.
- Mở rộng sang các component khác ngoài OAuth trong cùng change.
- Thay đổi cơ chế merge marker chung của toàn CLI (vẫn dùng replace inner theo marker id).

## Decisions

1. **Variant-aware merge id cho OAuth env**
   - `oauth/google` dùng marker `oauth-google`.
   - `oauth/github` dùng marker `oauth-github`.
   - `oauth/google-github` apply vào cả hai marker (`oauth-google` và `oauth-github`) thay vì tạo marker thứ ba.
   - Lý do: tránh overwrite theo thứ tự add, và mô hình vẫn mở rộng được khi thêm provider mới.

2. **Foundation env tách hai slot cố định**
   - Mọi foundation trong `EXPRESS_MERGE_FOUNDATIONS` (MVC + feature env paths) phải có cặp marker rỗng cho `oauth-google` và `oauth-github`.
   - Lý do: đảm bảo doctor/selftest có ma trận kiểm tra nhất quán.

3. **Merge fragment chuẩn hóa theo provider**
   - Mỗi template env provider chỉ là merge-only fragment chứa field `zod` của provider tương ứng.
   - `google-github` giữ vai trò orchestration ở mức add flow; không đóng vai trò marker mới.

4. **Migration policy: warn-only**
   - Nếu destination chỉ có marker cũ `oauth`, CLI/doctor cảnh báo rõ cách migrate marker mới và dừng merge cho variant-aware flow.
   - Không fallback sang marker cũ để tránh behavior mơ hồ.

## Risks / Trade-offs

- **[Risk]** Tăng số marker trong foundation env, làm template dài hơn.  
  **Mitigation:** giữ marker block rỗng, gom gần cuối `envSchema`, và ghi rõ ma trận trong README.

- **[Risk]** User cũ đang quen marker `oauth` sẽ gặp fail khi merge variant-aware.  
  **Mitigation:** doctor + thông báo lỗi có hướng dẫn migrate tối thiểu (copy marker blocks từ foundation mới).

- **[Risk]** `google-github` cần ghi vào hai marker nên flow add phức tạp hơn.  
  **Mitigation:** tách helper resolve merge ids theo variant và thêm selftest riêng cho case composite.

## Migration Plan

1. Cập nhật constants/doctor/selftests để nhận `oauth-google` + `oauth-github`.
2. Cập nhật foundation env templates và OAuth component env fragments.
3. Cập nhật build output registry (`servercn build`) và docs.
4. Rollback nếu cần: khôi phục marker chung `oauth` và mapping cũ trong CLI.

## Open Questions

- Có nên đưa helper “in-place marker snippet” vào message lỗi để user copy nhanh khi thiếu marker?
- Với provider mới trong tương lai (ví dụ GitLab), có dùng naming `oauth-<provider>` cố định làm convention toàn cục không?
