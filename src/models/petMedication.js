"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PetMedications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // PetMedications.belongsTo(models.MedicalRecord, {
      //   foreignKey: "medical_record_id",
      //   as: "medicalRecord",
      // });
      PetMedications.belongsTo(models.Medicine, {
        foreignKey: "medication_id",
        as: "medicineData",
      });
    }
  }
  PetMedications.init(
    {
      medical_record_id: DataTypes.INTEGER,
      medication_id: DataTypes.INTEGER,
      dosage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PetMedications",
    }
  );
  return PetMedications;
};
