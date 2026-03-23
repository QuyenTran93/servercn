// @servercn:begin rate-limiter
import { rateLimiter } from "./shared/middlewares/rate-limiter";

app.use(rateLimiter);
// @servercn:end rate-limiter
