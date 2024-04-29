import moment from "moment";
import db from "../models";
import { CronJob } from "cron";
import { Op, where } from "sequelize";

let job;
export const createBooking = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const serviceIds = body.service_ids.split(",");
      const pet = await db.Pet.findOne({
        where: { id: +body.pet_id, user_id: userId },
      });
      if (pet) {
        const result = await db.Booking.create({
          ...body,
          status: "pending",
          user_id: userId,
          service_id: serviceIds,
        });
        const time = new Date(`${result.date} ${result.start_time}`);
        job = new CronJob(
          time,
          function () {
            cancelBooking(body.vet_id, result.id);
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
      const booking = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: options,
        include: [
          {
            model: db.User,
            as: "dataUser",
            attributes: ["id", "fullName", "email", "phone", "avatar"],
          },
          {
            model: db.Pet,
            as: "dataPet",
            exclude: ["user_id"],
          },
        ],
      });

      if (!booking) {
        resolve({
          success: false,
          message: "Booking not found",
        });
        return;
      }
      const services = await db.PetService.findAll({
        where: { id: booking.service_id },
      });
      const dataVet = await db.User.findOne({
        where: { id: booking.vet_id },
        attributes: ["id", "fullName", "phone", "avatar", "roleId"],
      });
      const result = {
        ...booking.toJSON(),
        services,
        dataVet,
      };
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
        { status: "confirmed" },
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
        `${data.dataValues.date} ${data.dataValues.end_time}`
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
export const getAllBookings = (
  userId,
  {
    limit,
    page,
    order,
    start_date,
    end_date,
    attributes,
    isUser,
    statuses,
    date,
    ...query
  }
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (attributes) var options = attributes.split(",");
      if (statuses) {
        query.status = { [Op.in]: statuses.split(",") };
      }
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
      if (date) query.date = new Date(date);
      if (isUser) query.user_id = userId;
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
            model: db.Pet,
            as: "dataPet",
            exclude: ["user_id"],
          },
        ],
      });
      for (const booking of result.rows) {
        if (booking.dataValues.service_id) {
          const serviceIds = booking.dataValues.service_id;
          const services = await db.PetService.findAll({
            where: { id: { [Op.in]: serviceIds } },
            include: [
              {
                model: db.ServiceCategory,
                as: "dataCategory",
              },
            ],
          });
          booking.dataValues.services = services;
        }
      }
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
