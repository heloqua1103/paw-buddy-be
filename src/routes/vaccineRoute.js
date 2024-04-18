import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/get-all-vaccine", controllers.getAllVaccines);

router.use(isAdmin);
router.post("/admin/create-vaccine", controllers.createVaccine);
router.put("/admin/update-vaccine/:vaccineId", controllers.updateVaccine);
router.delete("/admin/delete-vaccine/:vaccineId", controllers.deleteVaccine);

module.exports = router;
