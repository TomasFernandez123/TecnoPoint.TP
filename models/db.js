const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('tecno-point', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
