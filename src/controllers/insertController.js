import * as services from "../services";

export const insertRoles = async (req, res) => {
  try {
    const result = await services.insertRoles(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
