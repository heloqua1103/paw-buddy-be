import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

// router.post("/create-pet", uploadPet.single("photo"), controllers.createPet);

module.exports = router;
