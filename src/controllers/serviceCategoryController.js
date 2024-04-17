import * as services from "../services";
import joi from "joi";

export const createServiceCategory = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const result = await services.createServiceCategory(req.body, fileData);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateServiceCategory = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const { id } = req.params;
    const result = await services.updateServiceCategory(id, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.deleteServiceCategory(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllServiceCategory = async (req, res) => {
  try {
    const result = await services.getAllServiceCategory(req.query);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
