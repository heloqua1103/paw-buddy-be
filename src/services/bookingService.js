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
      if (pet) {
        const result = await db.Booking.create({
          ...body,
          status: "pending",
          user_id: userId,
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

export const cancelBooking = (vetId, bookingId) =>
  new Promise(async (resolve, reject) => {
    try {
      const booking = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: ["start_time", "end_time", "date", "pet_id"],
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
        await db.MedicalRecord.destroy({
          where: {
            pet_id: booking.dataValues.pet_id,
            vet_id: vetId,
            booking_id: +bookingId,
          },
        });
        if (job && job.running) job.stop();

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

export const getBookingById = (bookingId, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { attributes } = query;
      if (attributes) var options = attributes.split(",");
      const result = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: options,
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

// Vet
export const approveBooking = (vetId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Booking.update(
        { status: body.status },
        { where: { id: +body.booking_id } }
      );
      const data = await db.Booking.findOne({
        where: { id: +body.booking_id },
      });
      await db.MedicalRecord.create({
        pet_id: data.dataValues.pet_id,
        vet_id: vetId,
        booking_id: +body.booking_id,
      });
      const time = new Date(
        `${data.dataValues.date} ${data.dataValues.start_time}`
      );
      if (job && job.running) job.stop();
      job = new CronJob(
        time,
        function () {
          finishBooking(+body.booking_id);
        },
        null,
        true,
        "Asia/Ho_Chi_Minh"
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const finishBooking = async (bookingId) => {
  try {
    await db.Booking.update(
      {
        status: "completed",
      },
      {
        where: { id: bookingId },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Admin
export const getAllBookings = ({
  limit,
  page,
  order,
  start_date,
  end_date,
  attributes,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      if (attributes) var options = attributes.split(",");
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
        attributes: options,
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
