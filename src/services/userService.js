import db from "../models";

export const getMe = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.User.findOne({
        where: id,
        include: [
          {
            model: db.Role,
            as: "roleData",
            attributes: ["id", "name_role"],
          },
          {
            model: db.Pet,
            as: "petData",
          },
        ],
      });
      resolve({
        err: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });
