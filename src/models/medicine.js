"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Medicine.init(
    {
      name_medicine: DataTypes.STRING,
      ingredient: DataTypes.STRING,
      intended_use: DataTypes.STRING,
      guide: DataTypes.STRING,
      indication: DataTypes.STRING,
      contraindication: DataTypes.STRING,
      side_effect: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      expiry_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Medicine",
    }
  );
  return Medicine;
};
