## 1. Dependency Scope

- [x] 1.1 Chốt danh sách component overlap-prone cần dependency rules cho MVC và feature
- [x] 1.2 Phân loại rule theo mức: hard dependency, soft ordering, conflict

## 2. CLI Implementation

- [x] 2.1 Thêm constants dependency graph cho Express components trong CLI
- [x] 2.2 Tích hợp validator dependency vào flow `add` trước bước scaffold
- [x] 2.3 Chuẩn hóa thông điệp remediation (lệnh gợi ý, khi nào dùng `--merge`/`--force`)

## 3. Overlap Integration

- [x] 3.1 Kết nối dependency validation với merge-critical path checks hiện có
- [x] 3.2 Cập nhật `doctor` để phản ánh dependency/order risks trên project hiện tại
- [x] 3.3 Bổ sung selftests cho dependency graph và các ordering permutations quan trọng

## 4. Docs & Validation

- [x] 4.1 Cập nhật `packages/cli/README.md` và `contributing.md` với dependency-aware add flow
- [x] 4.2 Chạy `npm run typecheck -w @quyentran93/servercn-cli` và test merge/dependency subset
- [x] 4.3 Smoke `init + add` theo nhiều thứ tự (ít nhất 1 case pass + 1 case fail-fast đúng kỳ vọng)
