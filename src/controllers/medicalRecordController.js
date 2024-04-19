import * as services from "../services";

export const createRecord = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.createRecord(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const updateRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { id } = req.user;
    const result = await services.updateRecord(recordId, id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getRecordsOfUser = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getRecordsOfUser(id, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getRecordsOfVet = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await services.getRecordsOfVet(id, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getRecordOfPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const result = await services.getRecordOfPet(petId, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
