import db from "../models";

export const createSpecies = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.PetSpecies.create({ ...body });
      resolve({
        success: result ? true : false,
        message: result
          ? "Create species successfully"
          : "Create species failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateSpecies = (id, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.PetSpecies.update({ ...body }, { where: { id } });
      resolve({
        success: result[0] > 0 ? true : false,
        message:
          result[0] > 0
            ? "Update species successfully"
            : "Update species failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteSpecies = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.PetSpecies.destroy({ where: { id } });
      resolve({
        success: result ? true : false,
        message: result
          ? "Delete species successfully"
          : "Delete species failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSpecies = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.PetSpecies.findAndCountAll();
      resolve({
        success: result ? true : false,
        message: result ? "Get species successfully" : "Get species failed",
        data: result,
      });
    } catch (error) {
      reject(error);
    }
  });
