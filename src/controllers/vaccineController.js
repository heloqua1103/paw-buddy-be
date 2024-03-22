import * as services from "../services";

export const createVaccine = async (req, res) => {
  try {
    const result = await services.createVaccine(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateVaccine = async (req, res) => {
  try {
    const { vaccineId } = req.params;
    const result = await services.updateVaccine(vaccineId, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVaccine = async (req, res) => {
  try {
    const { vaccineId } = req.params;
    const result = await services.deleteVaccine(vaccineId);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};
