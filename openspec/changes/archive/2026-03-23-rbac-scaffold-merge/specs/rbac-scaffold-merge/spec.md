## ADDED Requirements

### Requirement: Foundation có marker rbac

Foundation `express-starter` (MVC và feature) MUST chứa cặp rỗng `// @servercn:begin rbac` … `// @servercn:end rbac` trên đúng file integration (MVC: `src/app.ts`; feature: `src/routes/index.ts`).

#### Scenario: Init foundation mới

- **WHEN** user `init express-starter` sau khi change được apply
- **THEN** file integration MUST có khối marker rbac rỗng ở vị trí documented

### Requirement: Template rbac có merge-only wiring

Component `rbac` MUST ship merge-only nội dung (một cặp marker + inner) cho `slug` `rbac` trên cùng path dest như các component merge khác; inner MUST mount router user (import + `app.use` hoặc `router.use`) khớp design.

#### Scenario: add rbac --merge

- **WHEN** user chạy `add rbac --merge` trên project đã có marker
- **THEN** vùng giữa marker MUST được điền wiring mount router; phần ngoài marker MUST không bị thay bởi bước merge

### Requirement: Doc và doctor

README MUST liệt kê `rbac` trong bảng merge; `doctor` MUST kiểm tra thiếu marker `rbac` cùng nhóm slug MVC app / feature routes như các slug cùng loại.

#### Scenario: User chạy doctor

- **WHEN** architecture MVC và thiếu `// @servercn:begin rbac` trong `src/app.ts`
- **THEN** doctor MUST cảnh báo tương tự các slug merge khác

### Requirement: Không regress slug merge trước

Sau apply change, selftest merge-marker và wiring batch trước (`rate-limiter`, `security-header`, `async-handler`, `request-validator`) MUST vẫn đúng theo README hiện hành.

#### Scenario: Regression

- **WHEN** chạy `npm run test:merge-marker` và đối chiếu built registry
- **THEN** không được xóa nhầm marker hoặc fragment của slug đã có
