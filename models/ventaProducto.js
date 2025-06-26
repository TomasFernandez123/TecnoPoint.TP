const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const VentaProducto = sequelize.define('VentaProducto', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'ventas_productos',
  timestamps: false
});

module.exports = VentaProducto;
