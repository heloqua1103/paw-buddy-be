import * as services from "../services";

export const getMe = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getMe(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
