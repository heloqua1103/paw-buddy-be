import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.post("/create-pet", controllers.createPet);
router.put("/update-pet", controllers.updatePet);
router.delete("/delete-pet", controllers.deletePet);

module.exports = router;
