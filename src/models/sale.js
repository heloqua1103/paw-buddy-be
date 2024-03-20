"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sale.init(
    {
      name: DataTypes.STRING,
      content: DataTypes.TEXT,
      date_start: DataTypes.DATE,
      date_finish: DataTypes.DATE,
      percent_sale: DataTypes.FLOAT,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Sale",
    }
  );
  return Sale;
};
