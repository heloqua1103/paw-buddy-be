"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vaccine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vaccine.init(
    {
      name_vaccine: DataTypes.STRING,
      type_disease: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      number_of_doses: DataTypes.STRING,
      vaccination_schedule: DataTypes.STRING,
      contraindication: DataTypes.STRING,
      side_effect: DataTypes.STRING,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Vaccine",
    }
  );
  return Vaccine;
};
