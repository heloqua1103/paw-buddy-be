import db from "../models";

export const createFeedback = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkBooking = await db.Booking.findOne({
        where: {
          id: body.booking_id,
          user_id: userId,
        },
      });
      if (!checkBooking) {
        resolve({
          success: false,
          message: "Booking not found",
        });
      }
      if (checkBooking.dataValues.status === "completed") {
        const result = await db.Feedback.create({
          user_id: userId,
          booking_id: body.booking_id,
          point: body.point,
          comment: body.comment,
          rating_type: body.rating_type,
          service_id: body.service_id,
        });
        resolve({
          success: result ? true : false,
          message: result ? "Create role successfully" : "Create role failed",
          data: result,
        });
      } else {
        resolve({
          success: false,
          message: "You cannot feedback",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAllFeedbacks = ({ limit, page, order, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_FEEDBACK;
      queries.distinct = true;
      if (limit) {
        queries.offset = offset * fLimit;
        queries.limit = fLimit;
      }
      if (order) queries.order = [order];
      const result = await db.Feedback.findAndCountAll({
        where: query,
        ...queries,
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result.rows : null,
        count: result ? result.count : 0,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllFeedbackOfUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Feedback.findAndCountAll({
        where: { user_id: userId },
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result.rows : null,
        count: result ? result.count : 0,
      });
    } catch (error) {
      reject(error);
    }
  });
