import * as services from "../services";

export const test = async (req, res) => {
  try {
    const result = await services.test(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
