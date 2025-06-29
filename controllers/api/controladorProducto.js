/**
 * Controladores para la gestión de productos.
 * Manejan operaciones CRUD, paginación, filtrado por estado/categoría, y carga de archivos.
 */
const ProductoManager = require("../../models/Producto");


/**
 * Obtiene todos los productos.
 * @route GET /api/productos
 */
const getController = async (req, res) => {
    try {
        const productos = await ProductoManager.obtenerProductos();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener productos", error: err.message });
    }
};

/**
 * Obtiene todos los productos activos.
 * @route GET /api/productos/activos
 */
const getActives = async (req, res) => {
    try {
        const productos = await ProductoManager.obtenerProductosActivos();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener productos activos", error: err.message });
    }
};

/**
 * Obtiene productos paginados.
 * @route GET /api/productos/page?pagina=1&limite=5
 */
const getControllerByPage = async (req, res) => {
    try {
        // obtenés los parámetros de paginación
        // si no se envían, se usa 1 para página y 5 para límite
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 5;
        const productos = await ProductoManager.obtenerProductosPaginados(pagina, limite);

        if (productos) {
            res.json(productos);
        } else {
            res.status(404).json({ mensaje: "No se encontraron productos" });
        }
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener productos", error: err.message });
    }
};

/** * 
 * Obtiene productos activos paginados, con opción de filtrar por categoría.
 * @route GET /api/productos/activos/page?pagina=1&limite=5&categoria=tecnologia
 */
const getControllerActivesByPage = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 5;
        const categoria = req.query.categoria;

        // armas el filtro dinámico
        const where = { activo: true };
        if (categoria) {
            where.categoria = categoria;
        }

        const productos = await ProductoManager.obtenerProductosPaginados(pagina, limite, where);

        if (productos) {
            res.json(productos);
        } else {
            res.status(404).json({ mensaje: "No se encontraron productos activos" });
        }
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener productos activos", error: err.message });
    }
}

/**
 * Obtiene un producto por ID.
 * @route GET /api/productos/:id
 */
const getControllerById = async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await ProductoManager.obtenerProductoPorId(id);

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ mensaje: "Producto no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ mensaje: "Error al buscar producto", error: err.message });
    }
};

/**
 * Agrega un nuevo producto.
 * Espera un archivo y un objeto JSON serializado en el campo `obj_producto`.
 * @route POST /api/productos
 * @param {File} file - Imagen del producto
 * @param {string} obj_producto - Objeto JSON del producto (como string)
 */
const postController = async (req, res) => {
    const file = req.file;
    const obj = req.body.obj_producto;

    if (!file || !obj) {
        return res.status(400).json({ mensaje: "Falta archivo o datos del producto." });
    }

    try {
        const objJSON = JSON.parse(obj);
        const nuevoProducto = await ProductoManager.agregarProducto(objJSON, file);

        if (nuevoProducto) {
            res.status(201).json({ exito: true, mensaje: "Producto agregado correctamente" });
        } else {
            res.status(500).json({ exito: false, mensaje: "Error al guardar el producto" });
        }
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: "Error en el servidor", error: err.message });
    }
};

/**
 * Actualiza un producto existente.
 * Espera un archivo y un objeto JSON serializado en el campo `obj_producto`.
 * @route PUT /api/productos/:id
 * @param {string} id - ID del producto a actualizar
 */
const putController = async (req, res) => {
    const id = req.params.id;
    const file = req.file;
    const obj = req.body.obj_producto;

    try {
        const nuevosDatos = obj ? JSON.parse(obj) : {};
        const resultado = await ProductoManager.actualizarProducto(id, nuevosDatos, file);

        res.status(resultado.exito ? 200 : 400).json(resultado);
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: "Error al actualizar producto", error: err.message });
    }
};

/**
 * Elimina un producto por ID.
 * @route DELETE /api/productos/:id
 */
const deleteController = async (req, res) => {
    const id = req.params.id;
    const resultado = await ProductoManager.eliminarProducto(id);

    res.status(resultado.exito ? 200 : 404).json(resultado);
};


/**
 * Cambia el estado (activo/inactivo) de un producto.
 * @route PUT /api/productos/estado/:id
 */
const estadoController = async (req, res) => {
    const id = req.params.id;
    const resultado = await ProductoManager.cambiarEstado(id);

    res.status(resultado.exito ? 200 : 404).json(resultado);
};

module.exports = {
    getController,
    getControllerById,
    postController,
    putController,
    deleteController,
    estadoController,
    getActives,
    getControllerByPage,
    getControllerActivesByPage
};
