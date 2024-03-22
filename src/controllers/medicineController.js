import * as services from "../services";

export const createMedicine = async (req, res) => {
  try {
    const result = await services.createMedicine(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const result = await services.updateMedicine(req.body, medicineId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const result = await services.deleteMedicine(medicineId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getAllMedicines = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const result = await services.getAllMedicines(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
