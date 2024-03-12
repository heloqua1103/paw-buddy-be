import * as services from "../services";

export const getAllUsers = async (req, res) => {
  try {
    const result = await services.getMe(req.query);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getMe(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.changePassword(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
