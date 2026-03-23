## ADDED Requirements

### Requirement: Spike định nghĩa inner merge zod trước khi pilot

Change MUST có mô tả trong `design.md` (sau task spike) về **cách** nội dung giữa `// @servercn:begin` và `// @servercn:end` trên file env được ghép vào foundation mà vẫn **parse TypeScript** và chạy `safeParse` đúng (field mới, schema mở rộng).

#### Scenario: Maintainer đọc spike

- **WHEN** maintainer mở `design.md` sau bước spike env merge
- **THEN** MUST thấy một quy ước inner merge duy nhất áp dụng cho pilot và rollout

### Requirement: Pilot merge env hoàn chỉnh trên một foundation và một kiến trúc

Sau pilot, với foundation và kiến trúc đã chốt trong `tasks.md`, template foundation MUST có cặp marker rỗng trên đúng file env; template component pilot MUST có **merge-only** fragment cùng path; `EXPRESS_MERGE_SLOTS` (hoặc tương đương) MUST trỏ tới file đó; `npm run test:express-merge-foundation` (hoặc selftest mở rộng) MUST pass cho pilot.

#### Scenario: User add pilot với merge

- **WHEN** user đã `init` foundation pilot và chạy `add` với `--merge` cho slug pilot trên file env
- **THEN** biến môi trường / schema pilot MUST xuất hiện trong env đích mà không ghi đè toàn file ngoài vùng marker (trừ khi `--force`)

### Requirement: Rollout MVC và mọi foundation merge-layout

Sau pilot, MUST áp cùng pattern marker + (nếu có) fragment tương ứng lên **MVC** và **mọi** foundation trong `EXPRESS_MERGE_FOUNDATIONS` cho đúng relative path env từng kiến trúc.

#### Scenario: Selftest foundation sau rollout

- **WHEN** chạy selftest merge foundation sau rollout env
- **THEN** mọi foundation trong `EXPRESS_MERGE_FOUNDATIONS` MUST có đủ marker env theo quy ước đã chốt

### Requirement: Tài liệu và doctor

README / contributing MUST mô tả env merge (khi nào dùng `--merge`, project cũ thiếu marker). `doctor` SHOULD cảnh báo thiếu marker env khi slot env đã được định nghĩa, trừ khi task ghi rõ hoãn.

#### Scenario: User đọc hướng dẫn upgrade

- **WHEN** user đọc mục merge / upgrades sau rollout
- **THEN** MUST thấy env được liệt kê cùng `app.ts` / routes nếu đã hỗ trợ
