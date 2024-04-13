import db from "../models";

export const createServiceCategory = body =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.ServiceCategory.findOrCreate({
        where: { type_service: body.type_service },
        defaults: body,
      });
      resolve({
        success: result[1] > 0 ? true : false,
        message: result[1] > 0 ? "Successfully" : "Something went wrong!",
        data: result[1] > 0 ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateServiceCategory = (id, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.ServiceCategory.update(
        {
          type_service: body.type_service,
        },
        {
          where: { id },
        },
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
        data: result[0] > 0 ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteServiceCategory = id =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.ServiceCategory.destroy({
        where: { id },
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllServiceCategory = ({ limit, page, order, ...query }) =>
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
      const result = await db.ServiceCategory.findAll({
        where: query,
        ...queries,
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });
