import db from "../models";

export const createPet = (body, userId, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.photo = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.Pet.create({ ...body, user_id: userId });
      if (fileData && !result) cloudinary.uploader.destroy(fileData.filename);
      resolve({
        err: result ? true : false,
        message: result ? "Create pet successfully" : "Create pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePet = (body, userId, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.photo = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.Pet.update(body, {
        where: { id: body.id, user_id: userId },
      });
      if (fileData && !result[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
      resolve({
        err: result[0] > 0 ? true : false,
        message:
          result[0] > 0 ? "Update pet successfully" : "Update pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deletePet = (petId, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Pet.destroy({
        where: { id: petId, user_id: userId },
      });
      resolve({
        err: result ? true : false,
        message: result ? "Delete pet successfully" : "Delete pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllPets = ({ order, page, limit, ...query }) =>
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
      const result = await db.Pet.findAll({
        where: query,
        ...queries,
      });
      resolve({
        err: result ? true : false,
        message: result ? "Get pet successfully" : "Get pet failed",
        data: result ? result : [],
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPetsOfUser = ({ order, page, limit, ...query }, userId) =>
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
      const result = await db.Pet.findAll({
        where: { user_id: userId, ...query },
        ...queries,
      });
      resolve({
        err: result ? true : false,
        message: result ? "Get pet successfully" : "Get pet failed",
        data: result ? result : [],
      });
    } catch (error) {
      reject(error);
    }
  });
