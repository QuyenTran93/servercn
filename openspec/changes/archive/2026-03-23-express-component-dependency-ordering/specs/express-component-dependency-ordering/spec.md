## ADDED Requirements

### Requirement: Component dependency graph cho Express add flow

CLI MUST định nghĩa dependency/ordering graph cho các component Express có overlap cao, bao gồm hard dependencies (bắt buộc) và soft ordering rules (khuyến nghị).

#### Scenario: Hard dependency chưa thỏa

- **WHEN** user chạy `add <slug>` cho component yêu cầu dependency bắt buộc chưa hiện diện
- **THEN** CLI MUST dừng với lỗi rõ ràng và MUST gợi ý thứ tự lệnh cần chạy

#### Scenario: Soft ordering vi phạm

- **WHEN** user chạy `add <slug>` làm vi phạm soft ordering rule
- **THEN** CLI MUST cảnh báo cụ thể và SHOULD gợi ý thứ tự an toàn hơn

### Requirement: Dependency-aware remediation cho overlap

Khi có overlap trên merge-critical integration points, CLI MUST kết hợp dependency rules với marker/merge checks để tránh silent skip hoặc half-apply.

#### Scenario: Overlap với thứ tự add bất lợi

- **WHEN** component mới đụng merge-critical path của component đã cài và thứ tự hiện tại không an toàn theo graph
- **THEN** CLI MUST fail-fast hoặc warn theo mức rule, kèm remediation message có thể hành động ngay
