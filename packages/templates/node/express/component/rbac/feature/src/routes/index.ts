// @servercn:begin rbac
import UserRouter from "../modules/user/user.routes";

router.use("/v1/users", UserRouter);
// @servercn:end rbac
