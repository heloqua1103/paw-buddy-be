import db from "../models";

export const createBreed = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(fileData);
      if (fileData) {
        body.image = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.Breed.findOrCreate({
        where: { breed: body.breed },
        defaults: { ...body },
      });
      if (fileData && result[1] < 0)
        cloudinary.uploader.destroy(fileData.filename);
      resolve({
        success: result[1] > 0 ? true : false,
        message: result[1] > 0 ? "Successfully!" : "Something went wrong!",
        data: result[1] > 0 ? result[0] : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateBreed = (breedId, body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.image = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const result = await db.Breed.update(
        {
          ...body,
        },
        {
          where: { id: breedId },
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

export const deleteBreed = (breedId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Breed.destroy({
        where: { id: breedId },
      });

      resolve({
        success: result ? true : false,
        message: result ? "Successfully!" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllBreeds = ({ limit, page, order, ...query }) =>
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
      const result = await db.Breed.findAll({
        where: query,
        ...queries,
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
