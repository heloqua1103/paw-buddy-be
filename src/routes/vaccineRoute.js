import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);
router.post("/create-vaccine", controllers.createVaccine);
router.put("/update-vaccine/:vaccineId", controllers.updateVaccine);
router.delete("/delete-vaccine/:vaccineId", controllers.deleteVaccine);

module.exports = router;
