import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);
router.post("/create-service-category", controllers.createSeriveCategory);
router.put("/update-service-category/:id", controllers.updateSeriveCategory);
router.delete("/delete-service-category/:id", controllers.deleteSeriveCategory);
router.get("/get-all-service-category", controllers.getAllServiceCategory);

module.exports = router;
