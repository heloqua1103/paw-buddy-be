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
      Booking.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "userData",
      });
      Booking.belongsTo(models.PetService, {
        foreignKey: "service_id",
        targetKey: "id",
        as: "serviceData",
      });
      Booking.belongsTo(models.Pet, {
        foreignKey: "pet_id",
        targetKey: "id",
        as: "petData",
      });
    }
  }
  Booking.init(
    {
      user_id: DataTypes.INTEGER,
      service_id: DataTypes.INTEGER,
      pet_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      status: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
