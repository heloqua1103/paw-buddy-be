import db from "../models";

export const createService = (body, photo) =>
  new Promise(async (resolve, reject) => {
    try {
      if (photo) {
        body.photo = photo[0]?.path;
        body.fileNameImage = photo[0]?.filename;
      }
      const result = await db.PetService.findOrCreate({
        where: { name_service: body.name_service },
        defaults: { ...body },
      });
      if (photo && result[1] < 0) {
        photo.forEach((file) => cloudinary.uploader.destroy(file.filename));
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
        },
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

export const getAllService = ({ limit, order, page, ...query }) =>
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
      const result = await db.PetService.findAll({
        where: query,
        ...queries,
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
      });
    } catch (error) {
      reject(error);
    }
  });

export const getService = (serviceId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.PetService.findOne({
        where: { id: serviceId },
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
      });
    } catch (error) {
      reject(error);
    }
  });
