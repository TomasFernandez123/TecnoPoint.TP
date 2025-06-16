const { obtenerProductos, obtenerProductoPorId } = require("../../models/Producto");

const mostrarDashboard = (req, res) => {
    const productos = obtenerProductos();
    res.render("dashboard", { productos });
};

const mostrarProductos = (req, res) => {
    const productos = obtenerProductos();
    res.render("productos", {productos});
};

const mostrarFormularioAlta = (req, res) => {
    res.render("productForm", { producto: null, esEdicion: false });
};

const mostrarFormularioEdicion = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = obtenerProductoPorId(id);

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
