import * as services from "../services";
import joi from "joi";
import cloudinary from "cloudinary";

export const getAllUsers = async (req, res) => {
  try {
    const result = await services.getMe(req.query);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getUser(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.changePassword(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi.object().validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const { id } = req.user;
    const result = await services.updateUser(req.body, id, fileData);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
