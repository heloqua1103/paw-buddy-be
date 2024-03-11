import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const salt = bcrypt.genSaltSync(10);

const signAccessToken = (id, username, roleId) => {
  return jwt.sign(
    { id, username, roleId },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

const signAccessAndRefreshToken = (id, username, roleId) => {
  return Promise.all([
    signAccessToken(id, username, roleId),
    signRefreshToken(id),
  ]);
};

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const register = ({ username, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOrCreate({
        where: {
          username: username,
        },
        defaults: {
          username: username,
          password: hashPassword(password),
        },
      });
      const [accessToken, refreshToken] = await signAccessAndRefreshToken(
        user[0].dataValues.id,
        user[0].dataValues.username,
        user[0].dataValues.roleId
      );
      await db.User.update(
        { refreshToken: refreshToken },
        { where: { id: user[0].dataValues.id } }
      );
      resolve({
        err: user[1] ? true : false,
        message: user[1] ? "Registration successfull" : "User already exists",
        accessToken: user[1] ? accessToken : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const login = ({ username, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          username: username,
        },
      });
      const isChecked = user && bcrypt.compareSync(password, user.password);
      const [accessToken, refreshToken] = await signAccessAndRefreshToken(
        user.id,
        user.username,
        user.roleId
      );
      await db.User.update(
        { refreshToken: refreshToken },
        { where: { id: user.id } }
      );
      resolve({
        err: user ? true : false,
        message: user ? "Login successfull" : "username or password incorrect",
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
                response.username,
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
