const Venta = require('./ventaModel');
const Producto = require('./productoModel');
const Usuario = require('./adminModel')
const VentaProducto = require('./ventaProducto');

// Asociación muchos a muchos
Venta.belongsToMany(Producto, {
  through: VentaProducto,
  foreignKey: 'ventaId'
});

Producto.belongsToMany(Venta, {
  through: VentaProducto,
  foreignKey: 'productoId'
});

// Exportás todos los modelos
module.exports = {Venta, Producto, Usuario, VentaProducto};
