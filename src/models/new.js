"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Newspaper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Newspaper.init(
    {
      creator_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      author: DataTypes.STRING,
      resource: DataTypes.STRING,
      image: DataTypes.STRING,
      view: DataTypes.INTEGER,
      type_new: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Newspaper",
    }
  );
  return Newspaper;
};
