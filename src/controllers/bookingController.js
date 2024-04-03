import * as services from "../services";

export const createBooking = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.createBooking(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.updateBooking(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.cancelBooking(id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Admin
export const approveBooking = async (req, res) => {
  try {
    const result = await services.approveBooking(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const result = await services.getAllBookings(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
