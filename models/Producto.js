const fs = require("fs");
const path = require("path");
const PATH_ARCHIVO = "./data/productos.json";
const mime = require("mime-types");

const obtenerProductos = () => {
    if (!fs.existsSync(PATH_ARCHIVO)) return [];
    const data = fs.readFileSync(PATH_ARCHIVO);
    return JSON.parse(data);
};

const obtenerProductoPorId = (id) => {
    const productos = obtenerProductos();
    return productos.find(p => p.id == id);
}

const guardarProductos = (productos) => {
    fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos, null, 2));
};

const agregarProducto = (producto) => {
    const productos = obtenerProductos();
    productos.push(producto);
    guardarProductos(productos);
};

const actualizarProducto = (productoActualizado) => {
    const productos = obtenerProductos();
    const index = productos.findIndex(p => p.id === productoActualizado.id);
    if (index !== -1) {
        productos[index] = productoActualizado;
        guardarProductos(productos);
        return true;
    }
    return false;
};

const actualizarProductoConImagen = (producto, nuevosDatos, file) => {
    try {
        if (nuevosDatos.nombre) producto.nombre = nuevosDatos.nombre;
        if (nuevosDatos.descripcion) producto.descripcion = nuevosDatos.descripcion;
        if (nuevosDatos.precio) producto.precio = parseFloat(nuevosDatos.precio);
        if (nuevosDatos.categoria) producto.categoria = nuevosDatos.categoria;
        if (nuevosDatos.activo !== undefined)
            producto.activo = nuevosDatos.activo === "true" || nuevosDatos.activo === true;

        if (file) {
            const extension = mime.extension(file.mimetype);
            const nuevoPath = path.join("public", "fotos", producto.id + "." + extension);
            const pathViejo = path.join("public", producto.path || "");

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            fs.renameSync(file.path, nuevoPath);
            producto.path = "fotos/" + producto.id + "." + extension;
        }

        const exito = actualizarProducto(producto);

        return {
            exito,
            mensaje: exito ? "Producto actualizado correctamente" : "Error al actualizar el producto"
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: "Error interno al actualizar",
            error
        };
    }
};


const eliminarProducto = (codigo) => {
    if (!fs.existsSync(PATH_ARCHIVO)) {
        return { exito: false, mensaje: "Archivo de productos no encontrado." };
    }

    let productos = obtenerProductos();
    const indice = productos.findIndex(p => parseInt(p.id) === parseInt(codigo));

    if (indice === -1) {
        return { exito: false, mensaje: "Producto no encontrado." };
    }

    // Producto a eliminar
    const productoEliminar = productos[indice];

    // Eliminamos del array y guardamos
    productos = productos.filter(p => parseInt(p.id) !== parseInt(codigo));
    guardarProductos(productos);

    // Construimos la ruta correcta a la foto
    const rutaFoto = path.join('public', productoEliminar.path); // ej: public/fotos/1.jpg

    // Eliminamos la foto si existe
    if (fs.existsSync(rutaFoto)) {
        try {
            fs.unlinkSync(rutaFoto);
        } catch (error) {
            return { exito: false, mensaje: "Error al borrar la imagen." };
        }
    }

    return { exito: true, mensaje: `Producto ${codigo} y su foto eliminado correctamente.` };
};

module.exports = {
    obtenerProductos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId,
    guardarProductos,
    actualizarProductoConImagen
};
