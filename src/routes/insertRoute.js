import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/insert-role", controllers.insertRoles);

module.exports = router;
