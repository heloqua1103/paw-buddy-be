import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var salt = bcrypt.genSaltSync(10);

const signAccessToken = (id, username, role) => {
  return jwt.sign({ id, username, role }, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

const signAccessAndRefreshToken = (id, username, role) => {
  return Promise.all([
    signAccessToken(id, username, role),
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
        user[0].dataValues.role
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
        user.role
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
