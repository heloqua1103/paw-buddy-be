"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      veterinarian_id: DataTypes.INTEGER,
      service_id: DataTypes.INTEGER,
      pet_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      time: DataTypes.STRING,
      status: DataTypes.INTEGER,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
