import db from "../models";

export const createMedicine = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Medicine.findOrCreate({
        where: { name_medicine: body.name_medicine },
        defaults: {
          name_medicine: body.name_medicine,
          ingredient: body.ingredient,
          intended_use: body.intended_use,
          guide: body.indication,
          contraindication: body.contraindication,
          side_effect: body.side_effect,
          price: body.price,
          quantity: body.quantity,
        },
      });
      resolve({
        success: result[1] > 0 ? true : false,
        message:
          result[1] > 0
            ? "Create medicine successfully"
            : "Create medicine failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateMedicine = (body, medicineId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Medicine.update(
        { ...body },
        {
          where: { id: medicineId },
        }
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message:
          result[0] > 0
            ? "Update medicine successfully"
            : "Update medicine failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteMedicine = (medicineId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Medicine.destroy({
        where: { id: medicineId },
      });
      resolve({
        success: result ? true : false,
        message: result
          ? "Delete medicine successfully"
          : "Delete medicine failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllMedicines = ({ order, page, limit, ...query }) =>
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
      const result = await db.Medicine.findAll({
        where: query,
        ...queries,
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
