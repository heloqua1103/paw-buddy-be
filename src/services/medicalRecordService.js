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
          symptoms: body.symptoms,
          treatment_plan: body.treatment_plan,
          next_appointment_date: body.next_appointment_date,
          vaccine_id: body.vaccine_id,
        },
      });
      resolve({
        success: result[1] ? true : false,
        message: result[1] ? "Successfully" : "Something went wrong",
        data: result[0] ? result[0] : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateRecord = (recordId, userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.MedicalRecord.update(
        { ...body, vet_id: userId },
        {
          where: { id: recordId },
        }
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong",
      });
    } catch (error) {
      reject(error);
    }
  });
