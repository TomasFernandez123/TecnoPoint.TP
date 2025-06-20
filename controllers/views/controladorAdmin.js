const ProductoManager = require("../../models/Producto");

const mostrarDashboard = async (req, res) => {
    const productos = await ProductoManager.obtenerProductos();
    res.render("dashboard", { productos });
};

const mostrarProductos = async (req, res) => {
    const productos = await ProductoManager.obtenerProductos();
    res.render("productos", {productos});
};

const mostrarFormularioAlta = (req, res) => {
    res.render("productForm", { producto: null, esEdicion: false });
};

const mostrarFormularioEdicion = async (req, res) => {
    const id = parseInt(req.params.id);
    const producto = await ProductoManager.obtenerProductoPorId(id);

    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }

    res.render("productForm", { producto, esEdicion: true });
};

module.exports = {
    mostrarDashboard,
    mostrarProductos,
    mostrarFormularioAlta,
    mostrarFormularioEdicion
};
