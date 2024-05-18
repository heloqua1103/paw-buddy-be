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
      service_id: DataTypes.INTEGER,
      name_vaccine: DataTypes.STRING,
      type_disease: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      number_of_doses: DataTypes.STRING,
      vaccination_schedule: DataTypes.STRING,
      contraindication: DataTypes.STRING,
      side_effect: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
      expiry_date: DataTypes.DATE,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Vaccine",
    }
  );
  return Vaccine;
};
