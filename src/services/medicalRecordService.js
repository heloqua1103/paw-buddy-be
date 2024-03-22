import db from "../models";

export const createRecord = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.MedicalRecord.findOrCreate({
        where: { vet_id: userId, pet_id: body.pet_id },
        defaults: {
          vet_id: userId,
          pet_id: body.pet_id,
          exam_date: body.exam_date,
          diagnosis: body.diagnosis,
          medications: body.medications,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
