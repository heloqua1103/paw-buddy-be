import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/conversations", controllers.getAllConversations);

router.get("/:id", controllers.getMessages);
router.post("/send/:id", controllers.sendMessage);

export default router;
