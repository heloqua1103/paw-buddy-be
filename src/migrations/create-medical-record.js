"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MedicalRecords", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pet_id: {
        type: Sequelize.INTEGER,
      },
      vet_id: {
        type: Sequelize.INTEGER,
      },
      exam_date: {
        type: Sequelize.DATE,
      },
      diagnosis: {
        type: Sequelize.STRING,
      },
      medications: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      vaccines: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    await queryInterface.dropTable("MedicalRecords");
  },
};
