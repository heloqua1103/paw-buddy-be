const initRoutes = (app) => {
  app.use("/api/v1/auth", (req, res) => res.send("Welcome to the auth route"));
};

export default initRoutes;
