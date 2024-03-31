import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.get("/breed", controllers.getBreed);

module.exports = router;
