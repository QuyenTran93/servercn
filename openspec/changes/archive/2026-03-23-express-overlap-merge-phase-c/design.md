## Context

Hiện tại merge strategy của Express tập trung vào một số slot cố định (`src/app.ts`, `src/routes/index.ts`, `src/configs/env.ts`, `src/shared/configs/env.ts`). Qua rà soát overlap matrix, còn nhiều path có tần suất đụng cao giữa foundation và component, cũng như giữa các component với nhau (đặc biệt user routes và shared primitives như `status-codes`, `api-error`, `logger`, `error-handler`) chưa có strategy rõ ràng, dẫn tới skip hoặc half-apply.

## Goals / Non-Goals

**Goals:**
- Chuẩn hóa danh sách merge-critical overlaps Phase C và đưa vào contract spec.
- Thiết kế cơ chế merge/guard cho các path chưa slot hóa nhưng có rủi ro cao.
- Tránh silent skip ở các điểm integration gây thiếu wiring.
- Đồng bộ constants, doctor, docs và selftests theo cùng một ma trận.

**Non-Goals:**
- Không giải quyết toàn bộ dedupe template trong cùng change này.
- Không thay đổi contract API business của component (chỉ xử lý scaffold/merge behavior).
- Không tự động migrate toàn bộ project cũ; chỉ cung cấp guard + hướng dẫn.

## Decisions

1. **Ưu tiên theo risk trước, không phủ toàn bộ path ngay**
   - Phase C chỉ đưa vào nhóm overlap có xác suất gây half-apply cao nhất.
   - Alternatives:
     - Phủ toàn bộ path một lần: rủi ro scope lớn, khó review.
     - Chỉ thêm docs cảnh báo: không đủ để giảm lỗi thực tế.

2. **Tách 2 nhóm kỹ thuật: marker-slot merge và collision-guard**
   - Nhóm có cấu trúc rõ (integration files) dùng marker-slot.
   - Nhóm khó merge an toàn (một số shared primitives) trước mắt dùng guard fail-fast với message actionable, tránh silent skip.
   - Alternatives:
     - Merge heuristic tự do cho mọi file: dễ sai và khó dự đoán.

3. **Giữ tương thích với flow `add --merge` hiện có**
   - Mọi mở rộng vẫn đi qua cơ chế marker hiện tại trong `copy.ts`.
   - Cập nhật `doctor` để check marker/collision theo cùng matrix.
   - Alternatives:
     - Tạo command mới riêng cho overlap: tăng độ phức tạp UX.

4. **Spec-first cho modified capability**
   - Cập nhật `express-starter-component-add` để mở rộng requirement về marker/merge-critical paths.
   - Thêm capability mới `express-overlap-merge` cho phần guard + strategy mới.

5. **Phase C shortlist (chốt overlap + phân loại strategy)**
   - **Marker-slot merge**:
     - `mvc/src/app.ts`: thêm marker `rbac` đồng bộ trên toàn bộ foundations merge-layout.
     - `feature/src/routes/index.ts`: thêm marker `rbac` đồng bộ trên toàn bộ foundations merge-layout.
   - **Guard fail-fast**:
     - `src/routes/user.routes.ts` (MVC) cho các slug: `request-validator`, `verify-auth-middleware`, `rbac`.
     - `src/modules/user/user.routes.ts` (feature) cho các slug: `request-validator`, `verify-auth-middleware`, `rbac`.
   - **Theo dõi tiếp (không implement ngay trong Phase C)**:
     - shared primitives (`status-codes`, `api-error`, `logger`, `error-handler`) tiếp tục theo dõi ở phase sau nếu cần marker hóa sâu hơn.

## Risks / Trade-offs

- **[Risk]** Marker proliferation làm template khó đọc hơn  
  **Mitigation:** chỉ thêm ở các path integration ổn định, giữ thứ tự marker nhất quán.

- **[Risk]** Guard fail-fast có thể làm người dùng thấy “strict hơn trước”  
  **Mitigation:** message hướng dẫn cụ thể (`--merge`, thêm marker, hoặc `--force` nếu chấp nhận overwrite).

- **[Risk]** Component-order vẫn ảnh hưởng ở shared files chưa merge-safe hoàn toàn  
  **Mitigation:** khoanh vùng trong spec, thêm test regression theo thứ tự add khác nhau.

## Migration Plan

1. Chốt overlap shortlist và cập nhật spec artifacts.
2. Implement constants/slots/doctor/copy theo matrix Phase C.
3. Build registry (`servercn build`) và sync docs.
4. Chạy regression marker + wiring tests cho foundation và component overlap batch.
5. Với project cũ: cung cấp checklist doctor + hướng dẫn thêm marker thủ công.

## Open Questions

- Path nào trong shared primitives nên vào marker-slot ngay ở Phase C, path nào chỉ guard fail-fast?
- Có cần chuẩn hóa mount path conflict (ví dụ `/v1/users`) thành policy cứng trong CLI không?
- Có tách tiếp Phase D cho dedupe shared templates sau khi Phase C ổn định không?
