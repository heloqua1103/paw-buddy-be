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
    }
  }
  MedicalRecord.init(
    {
      pet_id: DataTypes.INTEGER,
      vet_id: DataTypes.INTEGER,
      exam_date: DataTypes.DATE,
      diagnosis: DataTypes.STRING,
      medications: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {
      sequelize,
      modelName: "MedicalRecord",
    }
  );
  return MedicalRecord;
};
