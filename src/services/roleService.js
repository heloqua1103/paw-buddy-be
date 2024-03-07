import db from "../models";

export const createRole = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Role.create({
        name_role: body.name,
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

export const updateRole = (body, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Role.update(
        { name_role: body.name },
        { where: { id: id } }
      );
      console.log(result);
      resolve({
        err: result ? true : false,
        message: result ? "Update role successfully" : "Update role failed",
      });
    } catch (error) {
      reject(error);
    }
  });
