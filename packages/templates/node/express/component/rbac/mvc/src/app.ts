// @servercn:begin rbac
import userRoutes from "./routes/user.routes";

app.use("/api/v1/users", userRoutes);
// @servercn:end rbac
