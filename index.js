import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./src/routes";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import serverless from "serverless-http";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// OPEN AI CONFIGURATION
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
// init db
require("./src/dbs/connect_DB");
require("./src/dbs/conect_mongDB");
// const initRedis = require("./src/dbs/connect_redis");
// initRedis.initRedis();

initRoutes(app);

// module.exports.handler = serverless(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
