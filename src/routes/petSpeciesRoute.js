import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.get("/get-all-species", controllers.getAllSpecies);

router.use(isAdmin);
router.post("/admin/create-species", controllers.createSpecies);
router.put("/admin/update-species/:id", controllers.updateSpecies);
router.delete("/admin/delete-species/:id", controllers.deleteSpecies);

module.exports = router;
