import * as services from "../services";

export const createFeedback = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.createFeedback(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const result = await services.getAllFeedbacks(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllFeedbackOfUser = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getAllFeedbackOfUser(id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
