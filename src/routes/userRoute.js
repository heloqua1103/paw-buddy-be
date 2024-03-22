import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";
import { uploadUser } from "../middlewares/uploader";

const router = express.Router();

router.use(verifyToken);

// Get all information of user
router.get("/get-me", controllers.getUser);
// Change password
router.post("/change-paswrord", controllers.changePassword);
// Update user information
router.put("/update-me", uploadUser.single("avatar"), controllers.updateUser);

router.use(isAdmin);
router.get("/get-all-users", controllers.getAllUsers);

module.exports = router;
