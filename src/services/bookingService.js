import moment from "moment";
import db from "../models";
import { CronJob } from "cron";
import { Op } from "sequelize";

let job;

export const createBooking = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const pet = await db.Pet.findOne({
        where: { id: +body.pet_id, user_id: userId },
      });
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
      if (pet) {
        const result = await db.Booking.create({
          ...body,
          user_id: userId,
          end_time: newTimeString,
        });
        const time = new Date(`${result.date} ${result.start_time}`);
        job = new CronJob(
          time,
          function () {
            cancelBooking(result.id);
          },
          null,
          true,
          "Asia/Ho_Chi_Minh"
        );
        resolve({
          success: result ? true : false,
          message: result ? "Successfully" : "Something went wrong!",
          result: result ? result : null,
        });
      } else {
        resolve({
          success: false,
          message: "Pet not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const updateBooking = (bookingId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const duration = await db.PetService.findOne({
        where: { id: +body.service_id },
        attributes: ["estimated_duration"],
      });
      const booking = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: ["status"],
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
      if (booking.dataValues.status === "pending") {
        const newBooking = await db.Booking.update(
          { ...body, end_time: newTimeString },
          { where: { id: +bookingId } }
        );
        const time = new Date(`${body.date} ${body.start_time}`);
        if (job && job.running) job.stop();
        job = new CronJob(
          time,
          function () {
            cancelBooking(+bookingId);
          },
          null,
          true,
          "Asia/Ho_Chi_Minh"
        );
        resolve({
          success: newBooking[0] > 0 ? true : false,
          message: newBooking[0] > 0 ? "Successfully" : "Something went wrong!",
        });
      } else if (
        booking.dataValues.status === "confirmed" ||
        booking.dataValues.status === "completed"
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

export const getBookingById = (bookingId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Booking.findOne({
        where: { id: +bookingId },
        include: [
          {
            model: db.User,
            as: "dataUser",
            attributes: ["id", "fullName", "email", "phone"],
          },
          {
            model: db.PetService,
            as: "dataService",
          },
          {
            model: db.Pet,
            as: "dataPet",
            exclude: ["user_id"],
          },
        ],
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

// Admin
// Need create health record
export const approveBooking = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Booking.update(
        { status: body.status },
        { where: { id: +body.booking_id } }
      );
      const vetsId = await db.User.findAll({
        where: { roleId: 2 },
        attributes: ["id"],
      });
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllBookings = ({
  limit,
  page,
  order,
  start_date,
  end_date,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_PET;
      queries.distinct = true;
      if (limit) {
        queries.offset = offset * fLimit;
        queries.limit = fLimit;
      }
      if (order) queries.order = [order];
      if (start_date && end_date) {
        const data = await db.Booking.findAll();
        const ids = [];
        data.forEach((booking) => {
          if (
            moment(booking.dataValues.date).format("YYYY-MM-DD") >=
              moment(start_date).format("YYYY-MM-DD") &&
            moment(booking.dataValues.date).format("YYYY-MM-DD") <=
              moment(end_date).format("YYYY-MM-DD")
          ) {
            ids.push(booking.dataValues.id);
          }
        });
        query.id = { [Op.in]: ids };
      }
      const result = await db.Booking.findAndCountAll({
        where: query,
        ...queries,
        include: [
          {
            model: db.User,
            as: "dataUser",
            attributes: ["id", "fullName", "email", "phone"],
          },
          {
            model: db.PetService,
            as: "dataService",
          },
          {
            model: db.Pet,
            as: "dataPet",
            exclude: ["user_id"],
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Get pet successfully" : "Get pet failed",
        counts: result.count,
        data: result ? result.rows : [],
      });
    } catch (error) {
      reject(error);
    }
  });
