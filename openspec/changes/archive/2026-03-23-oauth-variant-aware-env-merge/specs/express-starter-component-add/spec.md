## MODIFIED Requirements

### Requirement: Vùng marker trên mọi foundation Express merge-layout
Với **mỗi** foundation Express được liệt kê trong `EXPRESS_MERGE_FOUNDATIONS` (constant CLI; cùng bố cục slot với `express-starter`), template trong registry SHALL chứa cặp comment `// @servercn:begin <slug>` và `// @servercn:end <slug>` cho mỗi slug merge-enabled được hỗ trợ trên đúng file theo kiến trúc:

- **MVC**: `mvc/src/app.ts` SHALL có marker cho `rate-limiter`, `security-header`, `async-handler`, `request-validator`, `verify-auth-middleware`; và `mvc/src/configs/env.ts` SHALL có marker cho `oauth-google` và `oauth-github`.
- **Feature**: `feature/src/app.ts` SHALL có marker cho `rate-limiter`, `security-header`; `feature/src/routes/index.ts` SHALL có marker cho `request-validator`, `async-handler`, `verify-auth-middleware`; và `feature/src/shared/configs/env.ts` SHALL có marker cho `oauth-google` và `oauth-github`.

Các vùng giữa begin/end SHALL có thể để trống trong bản phát hành foundation (nội dung wiring do merge từ component khi người dùng chạy `add <slug> --merge`).

#### Scenario: Kiểm tra template MVC

- **WHEN** maintainer mở `mvc/src/app.ts` của bất kỳ foundation nào trong `EXPRESS_MERGE_FOUNDATIONS`
- **THEN** file SHALL chứa đủ các cặp marker cho mọi slug MVC nêu trên theo đúng tên slug

#### Scenario: Kiểm tra template Feature

- **WHEN** maintainer mở `feature/src/app.ts`, `feature/src/routes/index.ts`, và `feature/src/shared/configs/env.ts` trong cùng một foundation thuộc `EXPRESS_MERGE_FOUNDATIONS`
- **THEN** `app.ts` SHALL chứa marker cho `rate-limiter` và `security-header`, `routes/index.ts` SHALL chứa marker cho `request-validator`, `async-handler`, và `verify-auth-middleware`, và `shared/configs/env.ts` SHALL chứa marker cho `oauth-google` và `oauth-github`
