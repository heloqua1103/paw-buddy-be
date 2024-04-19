import * as services from "../services";

export const createSpecies = async (req, res) => {
  try {
    const result = await services.createSpecies(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.updateSpecies(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.deleteSpecies(id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllSpecies = async (req, res) => {
  try {
    const result = await services.getAllSpecies(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
