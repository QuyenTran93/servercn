// @servercn:begin verify-auth-middleware
import UserRouter from "../modules/user/user.routes";

router.use("/v1/users", UserRouter);
// @servercn:end verify-auth-middleware
