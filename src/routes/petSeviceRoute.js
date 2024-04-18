import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";
import { uploadService, logoService } from "../middlewares/uploader";

const router = express.Router();

router.get("/get-all-service", controllers.getAllService);

router.get("/get-service/:id", controllers.getService);

router.use(verifyToken);
router.use(isAdmin);
router.post(
  "/admin/create-service",
  uploadService.single("photo"),
  controllers.createService
);

router.put(
  "/admin/update-service/:serviceId",
  uploadService.single("photo"),
  controllers.updateService
);

router.delete("/admin/delete-service/:serviceId", controllers.deleteService);

module.exports = router;
