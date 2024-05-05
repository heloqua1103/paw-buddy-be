import { Op } from "sequelize";
import db from "../models";

export const createService = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.photo = fileData[0]?.path;
        body.fileNameImage = fileData[0]?.filename;
      }
      const result = await db.PetService.findOrCreate({
        where: { name_service: body.name_service },
        defaults: { ...body },
      });
      if (fileData && result[1] < 0) {
        cloudinary.uploader.destroy(fileData.filename);
      }
      resolve({
        success: result[1] > 0 ? true : false,
        message: result[1] > 0 ? "Successfully!" : "Something went wrong!",
        data: result[1] > 0 ? result[0] : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateService = (serviceId, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.photo = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.PetService.update(
        {
          ...body,
        },
        {
          where: { id: serviceId },
        }
      );
      if (fileData && result[0] < 0)
        cloudinary.uploader.destroy(fileData.filename);
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully!" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteService = (serviceId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.PetService.destroy({
        where: { id: serviceId },
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully!" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllService = ({
  limit,
  order,
  page,
  attributes,
  serviceIds,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      if (attributes) var options = attributes.split(",");
      if (serviceIds) query.id = { [Op.in]: serviceIds.split(",") };
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_PET;
      queries.distinct = true;
      if (limit) {
        queries.offset = offset * fLimit;
        queries.limit = fLimit;
      }
      if (order) queries.order = [order];
      const result = await db.PetService.findAndCountAll({
        where: query,
        ...queries,
        attributes: options,
        include: [
          {
            model: db.ServiceCategory,
            as: "dataCategory",
            attributes: ["type_service"],
          },
          {
            model: db.PetSpecies,
            as: "dataSpecies",
            attributes: ["name"],
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully!" : "Something went wrong!",
        data: result ? result.rows : null,
        count: result ? result.count : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getService = (serviceId, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { attributes } = query;
      if (attributes) var options = attributes.split(",");
      const feedbacks = await db.Feedback.findAndCountAll({
        where: { service_id: serviceId },
        attributes: ["point"],
      });
      const rate = feedbacks.rows.reduce((acc, cur) => acc + cur.point, 0);
      const avgRate = Math.round((rate / feedbacks.count) * 100) / 100;
      const countBooking = await db.Booking.findAndCountAll({
        where: { service_id: serviceId },
      });
      const result = await db.PetService.findOne({
        where: { id: serviceId },
        attributes: options,
        include: [
          {
            model: db.ServiceCategory,
            as: "dataCategory",
            attributes: ["type_service"],
          },
          {
            model: db.PetSpecies,
            as: "dataSpecies",
            attributes: ["name"],
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully!" : "Something went wrong!",
        data: result ? result : null,
        count: countBooking.count,
        rate: avgRate,
      });
    } catch (error) {
      reject(error);
    }
  });
