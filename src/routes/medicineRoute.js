import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.post("/create-medicine", controllers.createMedicine);
router.put("/update-medicine/:medicineId", controllers.updateMedicine);
router.delete("/delete-medicine/:medicineId", controllers.deleteMedicine);
router.get("/get-all-medicine", controllers.getAllMedicines);

module.exports = router;
