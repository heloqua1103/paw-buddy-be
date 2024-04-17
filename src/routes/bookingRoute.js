import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin, isVeterinarian } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);

router.post("/create-booking", controllers.createBooking);
// router.put("/update-booking/:id", controllers.updateBooking);
router.delete("/cancel-booking/:bookingId", controllers.cancelBooking);
router.get("/get-booking/:id", controllers.getBookingById);

router.use(isVeterinarian);
router.put("/approve-booking", controllers.approveBooking);

router.use(isAdmin);
router.get("/get-booking", controllers.getAllBookings);

module.exports = router;
