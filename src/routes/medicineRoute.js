import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);
router.get("/get-all-medicine", controllers.getAllMedicines);

router.use(isAdmin);
router.post("/admin/create-medicine", controllers.createMedicine);
router.put("/admin/update-medicine/:medicineId", controllers.updateMedicine);
router.delete("/admin/delete-medicine/:medicineId", controllers.deleteMedicine);

module.exports = router;
