const fs = require("fs");
const mime = require("mime-types");
const { obtenerProductos, agregarProducto, eliminarProducto, obtenerProductoPorId, actualizarProductoConImagen } = require("../../models/Producto");

const getController = (req, res) => {
    const productos = obtenerProductos();
    res.json(productos);
};

const getControllerById = (req, res) => {
    const id = req.params.id;
    const producto = obtenerProductoPorId(id);

    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
}

const postController = (req, res) => {

    const file = req.file;
    if (!file) {
        return res.status(400).json({ mensaje: "No se recibió ninguna foto." });
    }

    const extension = mime.extension(file.mimetype);

    const obj = req.body.obj_producto;
    if (!obj) {
        return res.status(400).json({ mensaje: "No se recibió el objeto del producto." });
    }

    const objJSON = JSON.parse(obj);
    objJSON.id = Date.now().toString();
    objJSON.activo = true;
    const path = file.destination + objJSON.id + '.' + extension;

    fs.renameSync(file.path, path);
    objJSON.path = path.split("public/")[1];

    agregarProducto(objJSON);

    res.status(201).json({
        exito: true,
        mensaje: "Producto agregado correctamente"
    });
};

const putController = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = obtenerProductoPorId(id);

    if (!producto) {
        return res.status(404).json({
            exito: false,
            mensaje: "Producto no encontrado"
        });
    }

    const obj = JSON.parse(req.body.obj_producto || "{}");
    const file = req.file;
    
    const resultado = actualizarProductoConImagen(producto, obj, file);

    return res.status(resultado.exito ? 200 : 400).json(resultado);
};

const deleteController = (req, res) => {
    const id = req.params.id;

    const resultado = eliminarProducto(id);

    const estado = resultado.exito ? 200 : 404;
    res.status(estado).json(resultado);
};


module.exports = { getController, postController, putController, deleteController, getControllerById };
