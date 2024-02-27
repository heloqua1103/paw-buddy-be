import * as services from "../services";

export const register = async (req, res) => {
  try {
    const response = await services.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};
