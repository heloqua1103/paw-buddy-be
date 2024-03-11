import * as services from "../services";

export const createPet = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.createPet(req.body, id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updatePet = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.updatePet(req.body, id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.user;
    const { petId } = req.body;
    const result = await services.deletePet(petId, id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
