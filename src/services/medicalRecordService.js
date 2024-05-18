import { Op, where } from "sequelize";
import db from "../models";
import { finishBooking } from ".";
import User from "../modelsChat/user.model";

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

export const updateRecord = (recordId, vetId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await db.MedicalRecord.update(
        { ...body },
        {
          where: { id: recordId, vet_id: vetId },
        }
      );
      if (body.medicine_ids) {
        const medicineIds = body.medicine_ids.split(",");
        medicineIds.forEach(async (id) => {
          await db.PetMedications.create({
            medical_record_id: recordId,
            medication_id: +id,
          });
        });
      }

      const bookingId = await db.MedicalRecord.findOne({
        where: { id: recordId },
        attributes: ["booking_id"],
      });

      const bookingData = await db.Booking.findOne({
        where: { id: bookingId.booking_id },
        attributes: ["user_id"],
      });

      const vet = await db.User.findOne({
        where: { id: vetId },
        attributes: ["email"],
      });

      const sender = await User.findOne({
        email: vet.email,
      });

      const user = await db.User.findOne({
        where: { id: bookingData.user_id },
        attributes: ["email"],
      });

      const receiver = await User.findOne({
        email: user.email,
      });

      finishBooking(bookingId.booking_id, sender._id, receiver._id);
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
      const { attributes, statuses } = query;
      if (statuses) var status = statuses.split(",");
      if (attributes) var options = attributes.split(",");
      const data = await db.Pet.findAll({
        where: { user_id: userId },
      });
      const petIds = data.map((pet) => pet.id);
      const bookingData = await db.Booking.findAll({
        where: {
          pet_id: petIds,
          ...(status && { status: { [Op.in]: status } }),
        },
        attributes: ["id"],
      });
      const bookingIds = bookingData.map((booking) => booking.id);
      const result = await db.MedicalRecord.findAll({
        where: { booking_id: bookingIds },
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
          {
            model: db.PetMedications,
            as: "medicationsData",
            attributes: ["dosage", "medical_record_id", "medication_id", "id"],
            include: [
              {
                model: db.Medicine,
                as: "medicineData",
              },
            ],
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
          {
            model: db.PetMedications,
            as: "medicationsData",
            attributes: ["dosage", "medical_record_id", "medication_id", "id"],
            include: [
              {
                model: db.Medicine,
                as: "medicineData",
              },
            ],
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
            model: db.PetMedications,
            as: "medicationsData",
            attributes: ["dosage", "medical_record_id", "medication_id", "id"],
            include: [
              {
                model: db.Medicine,
                as: "medicineData",
              },
            ],
          },
          {
            model: db.Vaccine,
            as: "vaccineData",
          },
        ],
      });
      resolve({
        success: result ? true : false,
        message: result
          ? "Successfully"
          : "Cannot find any record for this pet",
        data: result ? result : null,
      });
    } catch (error) {
      reject(error);
    }
  });
