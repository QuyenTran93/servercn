// @servercn:begin rate-limiter
import { rateLimiter } from "./middlewares/rate-limiter";

app.use(rateLimiter);
// @servercn:end rate-limiter
