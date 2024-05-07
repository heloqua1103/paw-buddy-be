import express from "express";
import verifyToken from "../middlewares/verify_token";
import * as controllers from "../controllers";

require("dotenv").config();

const router = express.Router();

router.use(verifyToken);

router.post("/chat", controllers.chat);
router.get("/", controllers.getChat);

export default router;
