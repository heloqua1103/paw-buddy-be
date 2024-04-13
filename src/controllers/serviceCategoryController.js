import * as services from "../services";

export const createServiceCategory = async (req, res) => {
  try {
    const result = await services.createServiceCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateServiceCategory = async (req, res) => {
  try {
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
