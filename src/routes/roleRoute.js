import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);
router.post("/admin/create-role", controllers.createRole);
router.put("/admin/update-role/:id", controllers.updateRole);
router.delete("/admin/delete-role/:id", controllers.deleteRole);

module.exports = router;
