import user from "./userRoute";
import auth from "./authRoute";
import role from "./roleRoute";

const initRoutes = (app) => {
  app.use("/api/v1/users", user);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/roles", role);
};

export default initRoutes;
