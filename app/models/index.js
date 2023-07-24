const {
  mysqlDb,
  mysqlUser,
  mysqlPassword,
  mysqlHost,
  mysqlPort,
} = require("../configs/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(mysqlDb, mysqlUser, mysqlPassword, {
  host: mysqlHost,
  port: mysqlPort,
  dialect: "mysql",
  logging: process.env.ENVIRONMENT == "dev" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 15000,
    idle: 15000,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.queue = require("./queue.model")(sequelize, Sequelize);

module.exports = db;
