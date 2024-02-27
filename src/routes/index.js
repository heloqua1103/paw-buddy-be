import user from "./userRoute";
import auth from "./authRoute";

const initRoutes = (app) => {
  app.use("/api/v1/users", user);
  app.use("/api/v1/auth", auth);
};

export default initRoutes;
