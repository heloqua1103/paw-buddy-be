import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

export const register = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          email: email,
          password: hashPassword(password),
        },
      });
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
        success: user[1] ? true : false,
        message: user[1] ? "Registration successfull" : "User already exists",
        accessToken: user[1] ? accessToken : null,
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
      const [accessToken, refreshToken] = await signAccessAndRefreshToken(
        user.id,
        user.email,
        user.roleId
      );
      await db.User.update(
        { refreshToken: refreshToken },
        { where: { id: user.id } }
      );
      resolve({
        success: user ? true : false,
        message: user ? "Login successfull" : "email or password incorrect",
        accessToken: accessToken ? accessToken : null,
        user: isChecked ? user : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const refreshToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.User.findOne({
        where: { refresh_token },
      });
      if (response) {
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
                response.id,
                response.email,
                response.roleId
              );
              resolve({
                success: accessToken ? true : false,
                mess: accessToken ? "Ok" : "Fail to generate new access token",
                // access_token: accessToken ? `Bearer ${accessToken}`: accessToken,
                token: accessToken ? `${accessToken}` : accessToken,
                refresh_token: refresh_token,
              });
            }
          }
        );
      }
    } catch (e) {
      reject(e);
    }
  });

export const logout = async (refresh_token) => {
  console.log("refresh_token", refresh_token);
  await db.User.update(
    { refreshToken: null },
    { where: { refreshToken: refresh_token } }
  );
};
