"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalRecord.belongsTo(models.Pet, {
        foreignKey: "pet_id",
        targetKey: "id",
        as: "petData",
      });
      MedicalRecord.belongsTo(models.User, {
        foreignKey: "vet_id",
        targetKey: "id",
        as: "vetData",
      });
      MedicalRecord.belongsTo(models.Vaccine, {
        foreignKey: "vaccine_id",
        targetKey: "id",
        as: "vaccineData",
      });
      MedicalRecord.belongsTo(models.Booking, {
        foreignKey: "booking_id",
        targetKey: "id",
        as: "bookingData",
      });
    }
  }
  MedicalRecord.init(
    {
      pet_id: DataTypes.INTEGER,
      vet_id: DataTypes.INTEGER,
      booking_id: DataTypes.INTEGER,
      exam_date: DataTypes.DATE,
      diagnosis: DataTypes.STRING,
      symptoms: DataTypes.TEXT,
      treatment_plan: DataTypes.TEXT,
      next_appointment_date: DataTypes.DATE,
      vaccine_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MedicalRecord",
    }
  );
  return MedicalRecord;
};
