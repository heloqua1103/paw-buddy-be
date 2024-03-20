"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vacxin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vacxin.init(
    {
      name_vacxin: DataTypes.STRING,
      type_disease: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      number_of_doses: DataTypes.INTEGER,
      vaccination_schedule: DataTypes.STRING,
      contraindication: DataTypes.STRING,
      side_effect: DataTypes.STRING,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Vacxin",
    }
  );
  return Vacxin;
};
