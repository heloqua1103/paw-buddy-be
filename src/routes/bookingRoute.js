import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);

router.post("/create-booking", controllers.createBooking);
router.put("/update-booking/:id", controllers.updateBooking);
router.delete("/cancel-booking/:id", controllers.cancelBooking);

router.use(isAdmin);
router.put("/approve-booking", controllers.approveBooking);

module.exports = router;
