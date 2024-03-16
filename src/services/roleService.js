import db from "../models";

export const createRole = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Role.create({
        name_role: body.name,
      });
      resolve({
        success: result ? true : false,
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
      resolve({
        success: result ? true : false,
        message: result ? "Update role successfully" : "Update role failed",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteRole = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.Role.destroy({ where: { id: id } });
      resolve({
        success: result ? true : false,
        message: result ? "Delete role successfully" : "Delete role failed",
      });
    } catch (error) {
      reject(error);
    }
  });
