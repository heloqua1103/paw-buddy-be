import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./src/routes";
dotenv.config();
require("./connect_DB");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
