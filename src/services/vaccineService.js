import db from "../models";

export const getAllVaccines = ({ order, page, limit, attributes, ...query }) =>
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
      const result = await db.Vaccine.findAndCountAll({
        where: query,
        ...queries,
        attributes: options,
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result.rows : null,
        count: result ? result.count : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createVaccine = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Vaccine.create({
        ...body,
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

export const updateVaccine = (vaccineId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Vaccine.update(
        { ...body },
        { where: { id: vaccineId } }
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteVaccine = (vaccineId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Vaccine.destroy({ where: { id: vaccineId } });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
