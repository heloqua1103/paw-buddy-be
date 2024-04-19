import db from "../models";

export const createServiceCategory = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.image = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.ServiceCategory.findOrCreate({
        where: { type_service: body.type_service },
        defaults: body,
      });
      if (fileData && !result) cloudinary.uploader.destroy(fileData.filename);
      resolve({
        success: result[1] > 0 ? true : false,
        message: result[1] > 0 ? "Successfully" : "Something went wrong!",
        data: result[1] > 0 ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateServiceCategory = (id, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.photo = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.ServiceCategory.update(
        {
          type_service: body.type_service,
        },
        {
          where: { id },
        }
      );
      if (fileData && !result[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
        data: result[0] > 0 ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteServiceCategory = (id) =>
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

export const getAllServiceCategory = ({
  limit,
  page,
  order,
  attributes,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      if (attributes) var options = attributes.split(", ");
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
        attributes: options,
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
