import db from "../models";

export const createPet = (userId, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.photo = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.Pet.create({ ...body, user_id: userId });
      if (fileData && !result) cloudinary.uploader.destroy(fileData.filename);
      resolve({
        success: result ? true : false,
        message: result ? "Create pet successfully" : "Create pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePet = (userId, body, fileData) =>
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
        success: result[0] > 0 ? true : false,
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
        success: result ? true : false,
        message: result ? "Delete pet successfully" : "Delete pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllPets = ({
  order,
  page,
  limit,
  neutered,
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
      const result = await db.Pet.findAndCountAll({
        where: query,
        ...queries,
        attributes: options,
        include: [
          {
            model: db.PetSpecies,
            as: "speciesData",
            attributes: ["name"],
          },
          {
            model: db.User,
            as: "userData",
            attributes: ["id", "fullName", "email", "phone"],
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Get pet successfully" : "Get pet failed",
        data: result ? result.rows : [],
        count: result ? result.count : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPetsOfUser = (
  { order, page, limit, attributes, ...query },
  userId
) =>
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
      const result = await db.Pet.findAll({
        where: { user_id: userId, ...query },
        ...queries,
        attributes: options,
        include: [
          {
            model: db.PetSpecies,
            as: "speciesData",
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Get pet successfully" : "Get pet failed",
        data: result ? result : [],
      });
    } catch (error) {
      reject(error);
    }
  });
