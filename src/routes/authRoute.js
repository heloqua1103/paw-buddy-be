import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.post("/refresh-token", controllers.refreshToken);
router.post("/logout", controllers.logout);
router.post("/reset-password", controllers.resetPassword);

module.exports = router;
