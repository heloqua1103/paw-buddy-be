"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Revenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Revenue.init(
    {
      transaction_date: DataTypes.DATE,
      transaction_type: DataTypes.ENUM("SALE", "SERVICE", "REFUND"),
      customer_id: DataTypes.INTEGER,
      service_id: DataTypes.INTEGER,
      money: DataTypes.DECIMAL,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Revenue",
    }
  );
  return Revenue;
};
