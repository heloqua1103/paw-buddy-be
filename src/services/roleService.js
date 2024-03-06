import db from "../models";

export const createRole = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Role.create({
        nameRole: body.name,
      });
      console.log(result);
      resolve({
        err: result ? true : false,
        message: result ? "Create role successfully" : "Create role failed",
      });
    } catch (error) {
      reject(error);
    }
  });
