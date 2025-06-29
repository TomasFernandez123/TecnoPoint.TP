/**
 * Módulo de lógica de negocio para productos.
 * Provee métodos CRUD, manejo de archivos de imagen y estado activo/inactivo.
 */

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const { Producto } = require("../models");

class ProductoManager {
  static async obtenerProductos() {
    return await Producto.findAll();
  }

  /**
   * Obtiene productos paginados, opcionalmente filtrados.
   * @param {number} pagina - Número de página
   * @param {number} limite - Cantidad por página
   * @param {object|null} where - Filtro opcional
   * @returns {Promise<Object>} Productos, total, página actual y páginas totales
   */
  static async obtenerProductosPaginados(pagina = 1, limite = 5, where = null) {
    const offset = (pagina - 1) * limite;

    const { count, rows } = await Producto.findAndCountAll({
      where: where || {},
      offset,
      limit: limite,
      order: [['nombre', 'ASC']]
    });

    return {
      productos: rows,
      total: count,
      pagina: parseInt(pagina),
      paginasTotales: Math.ceil(count / limite)
    };
  }

  static async obtenerProductoPorId(id) {
    return await Producto.findByPk(id);
  }

  static async obtenerProductosActivos() {
    return await Producto.findAll({ where: { activo: true } });
  }

  /**
   * Agrega un nuevo producto y guarda su imagen.
   * @param {Object} datos - Datos del producto
   * @param {Object} file - Archivo de imagen subido
   * @returns {Promise<Producto|null>} Producto creado o null en caso de error
   */
  static async agregarProducto(datos, file) {
    try {
      datos.id = Date.now().toString();
      datos.activo = true;

      const extension = mime.extension(file.mimetype);
      const nuevoPath = path.join(file.destination, `${datos.id}.${extension}`);

      // Determina extensión del archivo (ej. .jpg, .png) según el mimetype
      fs.renameSync(file.path, nuevoPath);
      datos.path = `fotos/${datos.id}.${extension}`;

      return await Producto.create(datos);
    } catch (err) {
      console.error("Error al agregar producto:", err.message);
      return null;
    }
  }

  /**
   * Actualiza los datos de un producto existente. También reemplaza la imagen si se proporciona una nueva.
   * @param {string|number} id - ID del producto a actualizar
   * @param {Object} nuevosDatos - Nuevos datos del producto
   * @param {Object|null} file - Nuevo archivo de imagen (opcional)
   * @returns {Promise<Object>} Resultado con éxito o mensaje de error
   */
  static async actualizarProducto(id, nuevosDatos, file) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return { exito: false, mensaje: "Producto no encontrado" };

      Object.assign(producto, nuevosDatos); // Actualiza los campos del producto con los nuevos datos

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

  /**
   * Elimina un producto y su imagen asociada si existe.
   * @param {string|number} id - ID del producto a eliminar
   * @returns {Promise<Object>} Resultado con éxito o mensaje de error
   */
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

   /**
   * Cambia el estado de un producto entre activo/inactivo.
   * @param {string|number} id - ID del producto
   * @returns {Promise<Object>} Resultado con éxito o mensaje de error
   */
  static async cambiarEstado(id) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return { exito: false, mensaje: "Producto no encontrado" };

      producto.activo = !producto.activo;

      await producto.save();

      if (!producto.activo) {
        return { exito: true, mensaje: `Producto ${id} desactivado correctamente.` };
      }

      return { exito: true, mensaje: `Producto ${id} activado correctamente.` };

    } catch (err) {
      return { exito: false, mensaje: "Error interno", error: err.message };
    }
  }

}

module.exports = ProductoManager;
