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
      price: DataTypes.DECIMAL,
      photo: DataTypes.STRING,
      species: DataTypes.INTEGER,
      note: DataTypes.TEXT,
      estimated_duration: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PetService",
    }
  );
  return PetService;
};
