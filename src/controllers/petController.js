import * as services from "../services";
import joi from "joi";

export const createPet = async (req, res) => {
  try {
    const fileData = req.file;
    if (!fileData)
      return res.status(400).json({ message: "Image is required" });
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const { id } = req.user;
    const result = await services.createPet(id, req.body, fileData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updatePet = async (req, res) => {
  try {
    const fileData = req.file;
    if (!fileData)
      return res.status(400).json({ message: "Image is required" });
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const { id } = req.user;
    const result = await services.updatePet(id, req.body, fileData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.user;
    const { petId } = req.body;
    const result = await services.deletePet(petId, id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllPets = async (req, res) => {
  try {
    const result = await services.getAllPets(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getPetsOfUser = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getPetsOfUser(req.query, id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
