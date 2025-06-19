const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('tecno-point', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // opcional: oculta logs
});

module.exports = sequelize;
