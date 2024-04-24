import { where } from "sequelize";
import db from "../models";

export const createRecord = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.MedicalRecord.findOrCreate({
        where: { vet_id: userId, pet_id: body.pet_id },
        defaults: {
          vet_id: userId,
          pet_id: body.pet_id,
          exam_date: body.exam_date,
          diagnosis: body.diagnosis,
          symptoms: body.symptoms,
          treatment_plan: body.treatment_plan,
          next_appointment_date: body.next_appointment_date,
          vaccine_id: body.vaccine_id,
        },
      });
      resolve({
        success: result[1] ? true : false,
        message: result[1] ? "Successfully" : "Something went wrong",
        data: result[0] ? result[0] : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateRecord = (recordId, userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.MedicalRecord.update(
        { ...body },
        {
          where: { id: recordId, vet_id: userId },
        }
      );
      resolve({
        success: result[0] > 0 ? true : false,
        message: result[0] > 0 ? "Successfully" : "Something went wrong",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getRecordsOfUser = (userId, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { attributes } = query;
      if (attributes) var options = attributes.split(",");
      const data = await db.Pet.findAll({
        where: { user_id: userId },
      });
      const petIds = data.map((pet) => pet.id);
      const result = await db.MedicalRecord.findAll({
        where: { pet_id: petIds },
        attributes: options,
        include: [
          {
            model: db.Pet,
            as: "petData",
          },
          {
            model: db.User,
            as: "vetData",
            attributes: ["fullName", "email", "phone", "avatar", "address"],
          },
          {
            model: db.Vaccine,
            as: "vaccineData",
          },
          {
            model: db.Booking,
            as: "bookingData",
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getRecordsOfVet = (vetId, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { attributes } = query;
      if (attributes) var options = attributes.split(",");
      const result = await db.MedicalRecord.findAndCountAll({
        where: { vet_id: vetId },
        attributes: options,
        include: [
          {
            model: db.Booking,
            as: "bookingData",
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong",
        data: result ? result.rows : null,
        count: result ? result.count : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getRecordOfPet = (petId, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { attributes } = query;
      if (attributes) var options = attributes.split(",");
      const result = await db.MedicalRecord.findOne({
        where: { pet_id: petId },
        attributes: options,
        include: [
          {
            model: db.Pet,
            as: "petData",
          },
          {
            model: db.User,
            as: "vetData",
            attributes: ["fullName", "email", "phone", "avatar", "address"],
          },
          {
            model: db.Vaccine,
            as: "vaccineData",
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result ? "Successfully" : "Something went wrong",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });
