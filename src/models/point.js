"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Point.init(
    {
      user_id: DataTypes.INTEGER,
      date_receive_point: DataTypes.DATE,
      reason_receive_point: DataTypes.STRING,
      point: DataTypes.INTEGER,
      point_used: DataTypes.INTEGER,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Point",
    }
  );
  return Point;
};
