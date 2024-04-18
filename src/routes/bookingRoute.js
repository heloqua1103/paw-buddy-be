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
router.get("/get-booking", controllers.getAllBookings);

router.use(isVeterinarian);
router.put("/vet/approve-booking", controllers.approveBooking);

module.exports = router;
