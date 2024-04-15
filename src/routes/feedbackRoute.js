import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/create-feedback", controllers.createFeedback);

module.exports = router;
