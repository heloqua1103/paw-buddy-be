import * as services from "../services";

export const createSeriveCategory = async (req, res) => {
  try {
    const result = await services.createSeriveCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateSeriveCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.updateSeriveCategory(id, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteSeriveCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.deleteSeriveCategory(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllServiceCategory = async (req, res) => {
  try {
    const result = await services.getAllSeriveCategory(req.query);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
