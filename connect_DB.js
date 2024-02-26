const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("paw-buddy", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
  timezone: "+07:00",
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connect();
