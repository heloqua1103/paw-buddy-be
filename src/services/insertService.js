import db from "../models";

const data = [
  {
    name_role: "admin",
  },
  {
    name_role: "veterinarian",
  },
  {
    name_role: "user",
  },
];

export const insertRoles = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      // data.forEach(async (item) => {
      //   await db.Role.create(item);
      // });
      // const result = await db.Feedback.create({ ...body });
      // await db.MedicalRecord.create({
      //   pet_id: 1,
      //   vet_id: 1,
      //   exam_date: "2021-09-01",
      //   diagnosis: "sick",
      //   symptoms: "fever",
      //   treatment_plan: "drink medicine",
      //   medications: [1, 2],
      //   vaccines: [1, 2],
      // });
      // const result = await db.MedicalRecord.findAll({
      //   include: [
      //     {
      //       model: db.Vaccine,
      //       as: "dataVaccine",
      //     },
      //   ],
      // });
      resolve({
        message: "Data inserted successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
