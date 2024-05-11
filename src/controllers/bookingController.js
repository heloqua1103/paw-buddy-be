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

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { id } = req.user;
    const result = await services.cancelBooking(id, bookingId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.getBookingById(id, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Vet
export const approveBooking = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.approveBooking(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Admin
export const getAllBookings = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getAllBookings(id, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
