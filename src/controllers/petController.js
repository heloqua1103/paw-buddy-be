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
