// @servercn:begin verify-auth-middleware
import userRoutes from "./routes/user.routes";

app.use("/api/v1/users", userRoutes);
// @servercn:end verify-auth-middleware
