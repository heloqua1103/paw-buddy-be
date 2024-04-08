import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";
import { uploadService } from "../middlewares/uploader";

const router = express.Router();

router.get("/get-all-service", controllers.getAllService);

router.use(verifyToken);
router.use(isAdmin);
router.post(
  "/create-service",
  uploadService.single("photo"),
  controllers.createService
);

router.put(
  "/update-service/:serviceId",
  uploadService.single("photo"),
  controllers.updateService
);

router.delete("/delete-service/:serviceId", controllers.deleteService);

module.exports = router;
