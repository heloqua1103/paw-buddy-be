import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/", controllers.getAllNotifications);
router.put("/:id", controllers.updateNotification);
router.post("/:id", controllers.createNotification);

module.exports = router;
