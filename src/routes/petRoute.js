import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { uploadPet } from "../middlewares/uploader";

const router = express.Router();

router.use(verifyToken);

router.post("/create-pet", uploadPet.single("photo"), controllers.createPet);
router.put("/update-pet", uploadPet.single("photo"), controllers.updatePet);
router.delete("/delete-pet", controllers.deletePet);

module.exports = router;
