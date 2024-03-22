import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/create-record", controllers.createRecord);

module.exports = router;
