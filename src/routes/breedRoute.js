import express from "express";
import * as controllers from "../controllers";
import { breedService } from "../middlewares/uploader";

const router = express.Router();

router.post(
  "/create-breed",
  breedService.single("image"),
  controllers.createBreed
);
router.put(
  "/update-breed/:id",
  breedService.single("image"),
  controllers.updateBreed
);
router.delete("/delete-breed/:id", controllers.deleteBreed);
router.get("/get-all-breed", controllers.getAllBreeds);

module.exports = router;
