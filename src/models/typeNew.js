"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TypeNew extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TypeNew.init(
    {
      name_type_new: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TypeNew",
    }
  );
  return TypeNew;
};
