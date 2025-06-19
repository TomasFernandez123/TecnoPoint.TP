const sequelize = require('./db');

const {DataTypes} = require('sequelize'); 

const ProductoModel = sequelize.define("Producto", {
    id: {type: DataTypes.STRING, primaryKey: true, allowNull: false},
    nombre: {type: DataTypes.STRING, allowNull: false},
    descripcion: {type: DataTypes.STRING, allowNull: false},
    precio: {type: DataTypes.FLOAT, allowNull: false},
    categoria: {type: DataTypes.STRING, allowNull: false},
    activo: {type: DataTypes.BOOLEAN, allowNull: false},
    path: {type: DataTypes.STRING, allowNull: false}
}, {
    tableName: "productos",
    timestamps: false
});

module.exports = ProductoModel;
