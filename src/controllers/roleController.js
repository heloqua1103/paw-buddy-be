import * as services from "../services";

export const createRole = async (req, res) => {
  try {
    const result = await services.createRole(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
