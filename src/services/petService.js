import db from "../models";

export const createPet = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Pet.create({ ...body, user_id: userId });
      resolve({
        err: result ? true : false,
        message: result ? "Create pet successfully" : "Create pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });
