import db from "../models";
import cloudinary from "cloudinary";

export const getAllUsers = ({ order, page, limit, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER;
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
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getUser = (id) =>
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
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong!",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUser = (body, userId, fileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileImage = await db.User.findOne({
        where: { id: userId },
      });
      cloudinary.api.delete_resources(fileImage.dataValues.fileName);
      if (fileData) {
        body.avatar = fileData?.path;
        body.fileName = fileData?.filename;
      }
      const fieldsToExclude = [
        "password",
        "username",
        "roleId",
        "id",
        "refreshToken",
      ];
      const myFields = Object.keys(db.User.rawAttributes).filter(
        (s) => !fieldsToExclude.includes(s)
      );
      const response = await db.User.update(body, {
        where: { id: userId },
        fields: myFields,
      });
      resolve({
        success: response[0] > 0 ? true : false,
        message:
          response[0] > 0 ? "Updated successfully" : "Something went wrong!",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
};

export const changePassword = (userId, body) =>
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
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
