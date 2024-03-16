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

export const insertRoles = () =>
  new Promise(async (resolve, reject) => {
    try {
      data.forEach(async (item) => {
        await db.Role.create(item);
      });
      resolve("Roles created");
    } catch (error) {
      reject(error);
    }
  });
