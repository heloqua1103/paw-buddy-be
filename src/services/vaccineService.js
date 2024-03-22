import db from "../models";

// export const getAllUsers = () =>
//   new Promise(async (resolve, reject) => {
//     try {
//       resolve({
//         success: result ? true : false,
//         message: result ? "Successfully" : "Something went wrong!",
//         data: result ? result : null,
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });

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
