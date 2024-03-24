"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Medicines", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name_medicine: {
        type: Sequelize.STRING,
      },
      ingredient: {
        type: Sequelize.STRING,
      },
      intended_use: {
        type: Sequelize.STRING,
      },
      guide: {
        type: Sequelize.STRING,
      },
      indication: {
        type: Sequelize.STRING,
      },
      contraindication: {
        type: Sequelize.STRING,
      },
      side_effect: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DECIMAL,
      },
      stock: {
        type: Sequelize.INTEGER,
      },
      unit: {
        type: Sequelize.STRING,
      },
      expiry_date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Medicines");
  },
};
