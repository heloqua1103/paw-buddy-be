import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/register", controllers.register);

module.exports = router;
