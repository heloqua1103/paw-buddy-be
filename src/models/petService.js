"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PetService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PetService.init(
    {
      name_service: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.FLOAT,
      photo: DataTypes.STRING,
      species: DataTypes.STRING,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "PetService",
    }
  );
  return PetService;
};
