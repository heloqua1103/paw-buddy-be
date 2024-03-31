import * as services from "../services";

export const getBreed = async (req, res) => {
  try {
    const result = await services.getBreed(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
