/**
 * Controladores para la gestión de ventas.
 * Incluye funciones para registrar una venta, obtener una venta específica y listar todas las ventas.
 */

const { Venta, Producto } = require('../../models');

/**
 * Registra una nueva venta.
 * Crea la venta, asocia los productos con sus cantidades y calcula el total.
 * 
 * @route POST /api/ventas
 * @param {string} nombre - Nombre del comprador
 * @param {Array} productos - Lista de productos con id y cantidad
 * @returns {Object} JSON con mensaje y ID de la venta registrada
 */
exports.registrarVenta = async (req, res) => {
  try {
    const { nombre, productos } = req.body; 

    const venta = await Venta.create({ nombre, total: 0 });

    let total = 0;

    for (const item of productos) {
      const producto = await Producto.findByPk(item.id);

      if (producto) {
        total += producto.precio * item.cantidad;

        await venta.addProducto(producto, {
          through: { cantidad: item.cantidad } // asociamos la cantidad vendida en la tabla intermedia
        });
      }
    }

    venta.total = total;
    await venta.save();

    res.status(201).json({ mensaje: "Venta registrada", ventaId: venta.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar venta", error: error.message });
  }
};

/**
 * Obtiene una venta por su ID.
 * Incluye los productos asociados con la cantidad vendida de cada uno.
 * 
 * @route GET /api/ventas/:id
 * @param {string} id - ID de la venta
 * @returns {Object} Venta con detalles de productos
 */
exports.obtenerVenta = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await Venta.findByPk(id, {
      include: {
        model: Producto,
        through: {
          attributes: ['cantidad'] // solo quiero que me traigas este campo extra de la tabla intermedia
        }
      }
    });

    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener venta', error: error.message });
  }
};

/**
 * Obtiene todas las ventas realizadas.
 * Incluye los productos asociados a cada venta, junto con la cantidad.
 * 
 * @route GET /api/ventas
 * @returns {Array} Lista de ventas con productos y cantidades
 */
exports.obtenerVentas = async (req, res) => {
  try {

    const ventas = await Venta.findAll({
      include: {
        model: Producto,
        through: {
          attributes: ['cantidad'] // solo quiero que me traigas este campo extra de la tabla intermedia
        }
      }
    });

    if (!ventas) {
      return res.status(404).json({ mensaje: 'Ventas no encontradas' });
    }

    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las venta', error: error.message });
  }
};

