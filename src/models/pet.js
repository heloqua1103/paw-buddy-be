"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pet.belongsTo(models.PetSpecies, {
        foreignKey: "species",
        targetKey: "id",
        as: "speciesData",
      });
      Pet.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "userData",
      });
    }
  }
  Pet.init(
    {
      user_id: DataTypes.INTEGER,
      name_pet: DataTypes.STRING,
      species: DataTypes.INTEGER,
      breed: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      date_of_birth: DataTypes.DATE,
      weight: DataTypes.FLOAT,
      photo: DataTypes.STRING,
      is_neutered: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Pet",
    }
  );
  return Pet;
};
