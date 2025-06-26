const {DataTypes} = require('sequelize'); 

const sequelize = require('./db');

const ventaModel = sequelize.define("Venta", {
    nombre: {type: DataTypes.STRING, allowNull: false},
    total: {type: DataTypes.FLOAT, allowNull: false},
    fecha: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
}, {
    tableName: "ventas",
    timestamps: false
});

module.exports = ventaModel;
