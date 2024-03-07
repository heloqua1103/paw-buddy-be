import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/create-role", controllers.createRole);
router.put("/update-role/:id", controllers.updateRole);
router.delete("/delete-role/:id", controllers.deleteRole);

module.exports = router;
