import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);

router.get("/get-me", controllers.getMe);
router.post("/change-paswrord", controllers.changePassword);

router.use(isAdmin);
router.get("/get-all-users", controllers.getAllUsers);

module.exports = router;
