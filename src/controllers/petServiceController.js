import * as services from "../services";
import joi from "joi";

export const createService = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const result = await services.createService(req.body, fileData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const fileData = req.file;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const result = await services.updateService(serviceId, req.body, fileData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const result = await services.deleteService(serviceId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllService = async (req, res) => {
  try {
    const result = await services.getAllService(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.getService(id, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
