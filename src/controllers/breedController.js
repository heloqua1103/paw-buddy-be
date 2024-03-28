import * as services from "../services";
import joi from "joi";

export const createBreed = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const result = await services.createBreed(req.body, fileData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateBreed = async (req, res) => {
  try {
    const { id } = req.params;
    const fileData = req.file;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const result = await services.updateBreed(id, req.body, fileData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteBreed = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.deleteBreed(id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllBreeds = async (req, res) => {
  try {
    const result = await services.getAllBreeds(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
