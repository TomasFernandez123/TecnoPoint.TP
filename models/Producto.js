const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const Producto = require("./productoModel");

class ProductoManager {
  static async obtenerProductos() {
    return await Producto.findAll();
  }

  static async obtenerProductoPorId(id) {
    return await Producto.findByPk(id);
  }

  static async obtenerProductosActivos() {
    return await Producto.findAll({where: {activo: true}});
  }

  static async agregarProducto(datos, file) {
    try {
      datos.id = Date.now().toString();
      datos.activo = true;

      const extension = mime.extension(file.mimetype);
      const nuevoPath = path.join(file.destination, `${datos.id}.${extension}`);

      fs.renameSync(file.path, nuevoPath);
      datos.path = `fotos/${datos.id}.${extension}`;

      return await Producto.create(datos);
    } catch (err) {
      console.error("Error al agregar producto:", err.message);
      return null;
    }
  }

  static async actualizarProducto(id, nuevosDatos, file) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return { exito: false, mensaje: "Producto no encontrado" };

      Object.assign(producto, nuevosDatos);

      if (file) {
        const extension = mime.extension(file.mimetype);
        const nuevoPath = path.join("public", "fotos", `${producto.id}.${extension}`);

        const pathViejo = path.join("public", producto.path || "");
        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);

        fs.renameSync(file.path, nuevoPath);
        producto.path = `fotos/${producto.id}.${extension}`;
      }

      await producto.save();

      return { exito: true, mensaje: "Producto actualizado correctamente" };
    } catch (err) {
      console.error("Error al actualizar:", err.message);
      return { exito: false, mensaje: "Error interno", error: err.message };
    }
  }

  static async eliminarProducto(id) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return { exito: false, mensaje: "Producto no encontrado" };

      const rutaFoto = path.join("public", producto.path);
      if (fs.existsSync(rutaFoto)) {
        try {
          fs.unlinkSync(rutaFoto);
        } catch (e) {
          return { exito: false, mensaje: "Error al borrar la imagen." };
        }
      }

      await producto.destroy();
      return { exito: true, mensaje: `Producto ${id} eliminado correctamente.` };
    } catch (err) {
      return { exito: false, mensaje: "Error interno", error: err.message };
    }
  }

  static async cambiarEstado(id) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return { exito: false, mensaje: "Producto no encontrado" };
      
      producto.activo = !producto.activo;

      await producto.save();

      if(producto.activo) {
        return { exito: true, mensaje: `Producto ${id} desactivado correctamente.` };
      }

      return { exito: true, mensaje: `Producto ${id} activado correctamente.` };

    } catch (err) {
      return { exito: false, mensaje: "Error interno", error: err.message };
    }
  }

}

module.exports = ProductoManager;
