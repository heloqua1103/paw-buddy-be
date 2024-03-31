import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.get("/test", controllers.test);

module.exports = router;
