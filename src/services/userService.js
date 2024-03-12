import db from "../models";

export const getAllUsers = ({ order, page, limit, ...query }) =>
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
      const result = await db.User.findAll({
        where: query,
        ...queries,
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

export const getMe = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.User.findAndCountAll({
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

export const changePassword = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId },
      });
      const isChecked =
        user && bcrypt.compareSync(body.password, user.password);
      const result = isChecked
        ? body.newPassword == body.password
          ? "Mật khẩu không đúng"
          : await db.User.update(
              { password: hashPassword(body.newPassword) },
              { where: { id: userId } }
            )
        : "Mật khẩu không đúng";
      resolve({
        err: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
