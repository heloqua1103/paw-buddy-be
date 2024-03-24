import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);
router.post("/create-species", controllers.createSpecies);
router.put("/update-species/:id", controllers.updateSpecies);
router.delete("/delete-species/:id", controllers.deleteSpecies);
router.get("/get-all-species", controllers.getAllSpecies);

module.exports = router;
