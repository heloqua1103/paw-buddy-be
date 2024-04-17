import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import { uploadCategory } from "../middlewares/uploader";

const router = express.Router();

router.get("/all", controllers.getAllServiceCategory);

router.use(verifyToken);
router.use(isAdmin);
router.post(
  "/create-service-category",
  uploadCategory.single("image"),
  controllers.createServiceCategory
);
router.put(
  "/update-service-category/:id",
  uploadCategory.single("image"),
  controllers.updateServiceCategory
);
router.delete(
  "/delete-service-category/:id",
  controllers.deleteServiceCategory
);

module.exports = router;
