import moment from "moment";
import db from "../models";

export const createBooking = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const duration = await db.PetService.findOne({
        where: { id: +body.service_id },
        attributes: ["estimated_duration"],
      });
      let [hours, minutes, seconds] = body.start_time.split(":").map(Number);
      let newMinutes = minutes + duration.dataValues.estimated_duration;

      if (newMinutes >= 60) {
        hours++;
        newMinutes -= 60;
      }

      const newTimeString = `${hours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      const result = await db.Booking.create({
        ...body,
        user_id: userId,
        end_time: newTimeString,
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        result: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateBooking = (bookingId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const duration = await db.PetService.findOne({
        where: { id: +body.service_id },
        attributes: ["estimated_duration", "status"],
      });
      let [hours, minutes, seconds] = body.start_time.split(":").map(Number);
      let newMinutes = minutes + duration.dataValues.estimated_duration;

      if (newMinutes >= 60) {
        hours++;
        newMinutes -= 60;
      }

      const newTimeString = `${hours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      if (duration.dataValues.status === "pending") {
        const newBooking = await db.Booking.update(
          { ...body, end_time: newTimeString },
          { where: { id: +bookingId } }
        );
        resolve({
          success: newBooking[0] > 0 ? true : false,
          message: newBooking[0] > 0 ? "Successfully" : "Something went wrong!",
        });
      } else if (
        duration.dataValues.status === "confirmed" ||
        duration.dataValues.status === "completed"
      ) {
        resolve({
          success: false,
          message: "Cannot update booking",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const cancelBooking = (bookingId) =>
  new Promise(async (resolve, reject) => {
    try {
      const booking = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: ["start_time", "end_time", "date"],
      });
      const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const startTime = moment(
        `${booking.dataValues.date} ${booking.dataValues.start_time}`
      ).format("YYYY-MM-DD HH:mm:ss");
      const endTime = moment(
        `${booking.dataValues.date} ${booking.dataValues.end_time}`
      ).format("YYYY-MM-DD HH:mm:ss");
      if (currentTime > startTime && currentTime < endTime) {
        resolve({
          success: false,
          message: "Cannot cancel booking during service!",
        });
        return;
      } else {
        const cancelBooking = await db.Booking.update(
          {
            status: "cancelled",
          },
          { where: { id: +bookingId } }
        );
        resolve({
          success: cancelBooking[0] > 0 ? true : false,
          message:
            cancelBooking[0] > 0 ? "Successfully" : "Something went wrong!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const approveBooking = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Booking.update(
        { status: body.status },
        { where: { id: +body.booking_id } }
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
