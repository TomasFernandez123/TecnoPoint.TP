const ProductoManager = require("../../models/Producto");

const getController = async (req, res) => {
    try {
        const productos = await ProductoManager.obtenerProductos();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener productos", error: err.message });
    }
};

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

const deleteController = async (req, res) => {
    const id = req.params.id;
    const resultado = await ProductoManager.eliminarProducto(id);

    res.status(resultado.exito ? 200 : 404).json(resultado);
};

module.exports = {
    getController,
    getControllerById,
    postController,
    putController,
    deleteController
};
