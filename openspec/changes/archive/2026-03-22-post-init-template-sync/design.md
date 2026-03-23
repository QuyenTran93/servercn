## Context

`init` tạo snapshot tại thời điểm T: foundation + `servercn.config.json`. Registry/template/CLI phát triển liên tục (marker mới, component refactor, `--merge`). Repo user **không** được cập nhật tự động; drift là trạng thái bình thường.

## Goals / Non-Goals

**Goals:**

- Làm rõ **các lớp thay đổi** (CLI behavior vs nội dung template remote vs file đã scaffold) và **hành động** tương ứng cho project cũ.
- Chuẩn hóa **messaging release** (“existing projects”) để giảm surprise.

**Non-Goals:**

- Công cụ nâng cấp tự động rewrite toàn bộ repo (không có trong phase đầu).
- Đảm bảo mọi tổ hợp version CLI × template luôn pass CI trên project user.

## Decisions

1. **Phân lớp drift**
   - **Chỉ bump CLI** (bugfix, log đẹp hơn): thường **không** cần đụng repo trừ khi user gặp bug cụ thể.
   - **Registry/template mới** (file mới, marker mới, path component đổi): user cần **đọc release note** + một trong: thêm marker/copy đoạn từ doc, `add <x> --merge` sau khi có marker, `add --force` (có cảnh báo), hoặc tạo project mới và port tay.
   - **Foundation thay đổi** (express-starter): project cũ **không** được ghi đè tự động; hướng dẫn diff có chọn lọc hoặc init project mới.

2. **Không bắt buộc `servercn.config` version schema** trong phase đầu; có thể đánh giá sau để `doctor` đọc `version` / `templateGeneration` (Open Question).

3. **Ưu tiên doc + changelog** trước `doctor`; CLI `doctor` là tăng cường, không chặn release doc.

4. **So với `git pull` upstream app**: scaffold user-owned = user chịu trách nhiệm merge; ServerCN chỉ cung cấp **recipe**, không thay thế judgment.

## Risks / Trade-offs

- **[Risk]** User bỏ qua release note → lỗi khi `--merge` → **Mitigation**: message lỗi đã rõ + link doc trong README.
- **[Risk]** `doctor` false positive → **Mitigation**: chỉ báo “có thể”, không auto-edit.

## Migration Plan

1. Ship doc + checklist trong một PR.
2. (Tùy chọn) PR sau: stub `servercn doctor` in ra checklist tĩnh hoặc so khớp marker tối thiểu.
3. Mỗi release scaffold breaking: thêm một dòng vào changelog.

## Open Questions

- Có nên lưu `scaffoldSchemaVersion` trong `servercn.config.json` để `doctor` so sánh với CLI không?
- Có cung cấp `npx servercn-cli add fd express-starter --merge` (foundation merge) hay coi foundation là one-shot?
