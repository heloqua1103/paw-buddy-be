import * as services from "../services";

export const createRole = async (req, res) => {
  try {
    const result = await services.createRole(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.updateRole(req.body, id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.deleteRole(id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
