import * as services from "../services";

export const register = async (req, res) => {
  try {
    const response = await services.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const response = await services.login(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const response = await services.refreshToken();
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const response = await services.logout(refresh_token);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};
