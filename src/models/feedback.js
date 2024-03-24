"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Feedback.init(
    {
      user_id: DataTypes.INTEGER,
      point: DataTypes.FLOAT,
      comment: DataTypes.TEXT,
      service_id: DataTypes.INTEGER,
      booking_id: DataTypes.INTEGER,
      rating_type: DataTypes.ENUM("SERVICE", "CLINIC"),
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );
  return Feedback;
};
