import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendmail from "../utils/email";
dotenv.config();

const salt = bcrypt.genSaltSync(10);

const signAccessToken = (id, email, roleId) => {
  return jwt.sign({ id, email, roleId }, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

const signAccessAndRefreshToken = (id, email, roleId) => {
  return Promise.all([
    signAccessToken(id, email, roleId),
    signRefreshToken(id),
  ]);
};

const checkEmail = async (email) => {
  const user = await db.User.findOne({ where: { email: email } });
  return Boolean(user);
};

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const register = ({ email, password, fullName }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          email: email,
          password: hashPassword(password),
          fullName: fullName,
        },
      });
      if (user[1]) {
        const [accessToken, refreshToken] = await signAccessAndRefreshToken(
          user[0].dataValues.id,
          user[0].dataValues.email,
          user[0].dataValues.roleId
        );
        await db.User.update(
          { refreshToken: refreshToken },
          { where: { id: user[0].dataValues.id } }
        );
        resolve({
          success: user[1] > 0 ? true : false,
          message:
            user[1] > 0 ? "Registration successfull" : "User already exists",
          accessToken: user[1] > 0 ? accessToken : null,
        });
      }
      resolve({
        success: false,
        message: "User already exists",
      });
    } catch (error) {
      reject(error);
    }
  });

export const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          email: email,
        },
      });
      const isChecked = user && bcrypt.compareSync(password, user.password);
      if (user && isChecked) {
        const [accessToken, refreshToken] = await signAccessAndRefreshToken(
          user.id,
          user.email,
          user.roleId
        );
        await db.User.update(
          { refreshToken: refreshToken },
          { where: { id: user.id } }
        );
        console.log("refreshToken", refreshToken);
        resolve({
          success: user ? true : false,
          message: user ? "Login successfull" : "email or password incorrect",
          accessToken: accessToken ? accessToken : null,
          refreshToken: refreshToken ? refreshToken : null,
          user: isChecked ? user : null,
        });
      }
      resolve({
        success: false,
        message: "email or password incorrect",
      });
    } catch (error) {
      reject(error);
    }
  });

export const refreshToken = ({ refresh_token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.User.findOne({
        where: { refreshToken: refresh_token },
      });
      if (result) {
        jwt.verify(
          refresh_token,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          (err) => {
            if (err)
              resolve({
                success: false,
                mess: "Refresh token expired. Require login again!!",
              });
            else {
              const accessToken = signAccessToken(
                result.id,
                result.email,
                result.roleId
              );
              resolve({
                success: accessToken ? true : false,
                message: accessToken
                  ? "Ok"
                  : "Fail to generate new access token",
                // access_token: accessToken ? `Bearer ${accessToken}`: accessToken,
                token: accessToken ? `${accessToken}` : accessToken,
                refresh_token: refresh_token,
              });
            }
          }
        );
      } else {
        resolve({
          success: false,
          mess: "Refresh token not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });

export const logout = async (refresh_token) => {
  await db.User.update(
    { refreshToken: null },
    { where: { refreshToken: refresh_token } }
  );
};

export const resetPassword = ({ email }) =>
  new Promise(async (resolve, reject) => {
    try {
      const isCheck = await db.User.findOne({ where: { email: email } });
      let newPassword = (Math.random() + 1).toString(36).substring(4);
      console.log("newPassword", newPassword);
      if (isCheck) {
        await db.User.update(
          { password: hashPassword(newPassword) },
          { where: { email: email } }
        );
        resolve({
          success: true,
          message: "New password has been sent to your email",
        });
      } else {
        resolve({
          success: false,
          message: "Email not found",
        });
      }
      const html = `<table style="width: 100%; border-collapse: collapse; border-radius: 5px; background-color: #ffffff;">
      <tr>
          <td style="padding: 10px 20px">
              <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Mật Khẩu Mới</h2>
              <p style="font-size: 16px; line-height: 1.5;">Xin chào,</p>
              <p style="font-size: 16px; line-height: 1.5;">Dưới đây là thông tin về mật khẩu mới của bạn:</p>
              <p style="font-size: 16px; line-height: 1.5;">Mật khẩu mới: <strong style="font-weight: bold; font-size: 24px">${newPassword}</strong></p>
              <p style="font-size: 16px; line-height: 1.5;">Vui lòng đảm bảo bạn lưu giữ mật khẩu này một cách an toàn.</p>
              <p style="font-size: 16px; line-height: 1.5;">Trân trọng,</p>
              <p style="font-size: 16px; line-height: 1.5;">Đội ngũ của chúng tôi</p>
          </td>
      </tr>
  </table>`;
      const content = `New password`;
      await sendmail({ email, html, content });
    } catch (e) {
      reject(e);
    }
  });
