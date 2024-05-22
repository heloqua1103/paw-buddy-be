import moment from "moment";
import db from "../models";
import { CronJob } from "cron";
import { Op } from "sequelize";
import { sendMessage } from "./messageService.js";
import User from "../modelsChat/user.model.js";
import { createNotification } from "../controllers/notificationController.js";

let job;

export const createBookingAgain = (vetId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const pet = await db.Pet.findOne({
        where: { id: +body.pet_id, user_id: body.user_id },
      });
      let [hours, minutes, seconds] = body.start_time.split(":").map(Number);

      minutes += 30;

      if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
      }

      hours = String(hours).padStart(2, "0");
      minutes = String(minutes).padStart(2, "0");
      seconds = String(seconds).padStart(2, "0");

      let end_time = `${hours}:${minutes}:${seconds}`;

      if (pet) {
        const result = await db.Booking.create({
          pet_id: body.pet_id,
          date: body.date,
          start_time: body.start_time,
          vet_id: vetId,
          status: "confirmed",
          user_id: body.user_id,
          end_time: end_time,
          service_id: [3],
        });

        await db.MedicalRecord.create({
          pet_id: body.pet_id,
          vet_id: vetId,
          booking_id: result.id,
          exam_date: body.date,
        });

        const time = new Date(`${result.date} ${result.start_time}`);
        await db.MedicalRecord.update(
          {
            next_appointment_date: time,
          },
          {
            where: {
              pet_id: body.pet_id,
              vet_id: vetId,
              booking_id: body.booking_id,
            },
          }
        );

        // Logic send notification
        const user = await db.User.findOne({
          where: { id: body.user_id },
          attributes: ["email"],
        });
        const receiver = await User.findOne({
          email: user.email,
        });
        createNotification(receiver._id, result.id, "You have a new booking!");

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
            cancelBookingSystem(body.vet_id, result.id, userId);
          },
          null,
          true,
          "Asia/Ho_Chi_Minh"
        );

        // Logic send notification
        const vet = await db.User.findOne({
          where: { id: body.vet_id },
          attributes: ["email"],
        });
        const receiver = await User.findOne({
          email: vet.email,
        });
        createNotification(receiver._id, result.id, "You have a new booking!");

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

export const cancelBookingSystem = (vetId, bookingId, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const booking = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: ["start_time", "end_time", "date", "pet_id"],
      });
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

      // Send message
      const vet = await db.User.findOne({
        where: { id: vetId },
        attributes: ["email", "fullName"],
      });
      const sender = await User.findOne({
        email: vet.email,
      });
      const user = await db.User.findOne({
        where: { id: userId },
        attributes: ["email", "fullName"],
      });
      const receiver = await User.findOne({
        email: user.email,
      });
      const message = `Hi ${user.fullName}! Your appointment has been cancelled. We hope to see you again soon!`;
      sendMessage(sender._id, receiver._id, message);

      // logic send notification
      createNotification(
        receiver._id,
        +bookingId,
        "Your booking has been cancelled!"
      );
      resolve({
        success: cancelBooking[0] > 0 ? true : false,
        message:
          cancelBooking[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const cancelBooking = (vetId, bookingId) =>
  new Promise(async (resolve, reject) => {
    try {
      const booking = await db.Booking.findOne({
        where: { id: +bookingId },
        attributes: ["start_time", "end_time", "date", "pet_id", "user_id"],
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
      } else if (currentTime > endTime) {
        resolve({
          success: false,
          message: "Cannot cancel booking after finish service!",
        });
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

        // logic send notification
        const user = await db.User.findOne({
          where: { id: booking.dataValues.user_id },
          attributes: ["email"],
        });
        const receiver = await User.findOne({
          email: user.email,
        });
        createNotification(
          receiver._id,
          +bookingId,
          "Your booking has been cancelled!"
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
          {
            model: db.MedicalRecord,
            as: "dataRecord",
            attributes: ["id"],
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
      // logic of approve booking
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
        exam_date: data.dataValues.date,
      });

      // logic send message
      const vet = await db.User.findOne({
        where: { id: vetId },
        attributes: ["email", "fullName"],
      });
      const sender = await User.findOne({
        email: vet.email,
      });
      const user = await db.User.findOne({
        where: { id: data.dataValues.user_id },
        attributes: ["email", "fullName"],
      });
      const receiver = await User.findOne({
        email: user.email,
      });

      const message = `Hi ${user.fullName}! Appointment confirmed! We'll be expecting you at ${data.dataValues.date} ${data.dataValues.start_time}.`;
      sendMessage(sender._id, receiver._id, message);

      // logic send notification
      createNotification(
        receiver._id,
        +body.booking_id,
        "Your booking has been confirmed!"
      );

      // schedule
      // if (job && job.running) job.stop();
      // job = new CronJob(
      //   time,
      //   function () {
      //     finishBooking(+body.booking_id, sender._id, receiver._id);
      //   },
      //   null,
      //   true,
      //   "Asia/Ho_Chi_Minh"
      // );

      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const finishBooking = async (bookingId, senderId, receiverId) => {
  try {
    await db.Booking.update(
      {
        status: "completed",
      },
      {
        where: { id: bookingId },
      }
    );
    const message = `We sincerely thank you for choosing our services! Your appointment has concluded, and we hope it met your expectations. Have a wonderful day!`;
    sendMessage(senderId, receiverId, message);
    createNotification(
      receiverId,
      bookingId,
      "Your booking has been completed!"
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
          {
            model: db.MedicalRecord,
            as: "dataRecord",
            attributes: ["id"],
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
