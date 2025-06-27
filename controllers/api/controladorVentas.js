const { Venta, Producto } = require('../../models');

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
          through: { cantidad: item.cantidad }
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

exports.obtenerVenta = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await Venta.findByPk(id, {
      include: {
        model: Producto,
        through: {
          attributes: ['cantidad']
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

exports.obtenerVentas = async (req, res) => {
  try {

    const ventas = await Venta.findAll({
      include: {
        model: Producto,
        through: {
          attributes: ['cantidad']
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

