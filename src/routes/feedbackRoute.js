import express from "express";
import verifyToken from "../middlewares/verify_token";
import * as controllers from "../controllers";

const router = express.Router();

router.use(verifyToken);
router.post("/create-feedback", controllers.createFeedback);

module.exports = router;
