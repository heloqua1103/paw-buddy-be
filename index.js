import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./src/routes";
dotenv.config();
require("./connect_DB");

const app = express();
const port = process.env.PORT || 3000;

initRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
