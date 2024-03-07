import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/create-role", controllers.createRole);
router.put("/update-role/:id", controllers.updateRole);

module.exports = router;
