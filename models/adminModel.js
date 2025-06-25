const {DataTypes} = require('sequelize'); 

const sequelize = require('./db');

const usuarioModel = sequelize.define("Admin", {
    nombre: {type: DataTypes.STRING, allowNull: false},
    correo: {type: DataTypes.STRING, allowNull: false, unique: true},
    clave: {type: DataTypes.STRING, allowNull: false},
}, {
    tableName: "admins",
    timestamps: false
});

module.exports = usuarioModel;