import user from "./userRoute";
import auth from "./authRoute";
import role from "./roleRoute";
import pet from "./petRoute";
import insert from "./insertRoute";

const initRoutes = (app) => {
  app.use("/api/v1/users", user);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/roles", role);
  app.use("/api/v1/pets", pet);
  app.use("/api/v1/insert", insert);
};

export default initRoutes;
