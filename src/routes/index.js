import user from "./userRoute";
import auth from "./authRoute";
import role from "./roleRoute";
import pet from "./petRoute";

const initRoutes = (app) => {
  app.use("/api/v1/users", user);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/roles", role);
  app.use("/api/v1/pets", pet);
};

export default initRoutes;
