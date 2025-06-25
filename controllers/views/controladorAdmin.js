const ProductoManager = require("../../models/Producto");
const usuarioModel = require("../../models/adminModel");
const bcrypt = require('bcrypt');

exports.mostrarDashboard = async (req, res) => {
    const productos = await ProductoManager.obtenerProductos();
    res.render("dashboard", { productos });
};

exports.mostrarProductos = async (req, res) => {
    const productos = await ProductoManager.obtenerProductos();
    res.render("productos", { productos });
};

exports.mostrarFormularioAlta = (req, res) => {
    res.render("productForm", { producto: null, esEdicion: false });
};

exports.mostrarFormularioEdicion = async (req, res) => {
    const id = parseInt(req.params.id);
    const producto = await ProductoManager.obtenerProductoPorId(id);

    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }

    res.render("productForm", { producto, esEdicion: true });
};

exports.mostrarLogin = (request, response) => {
    const titulo = "LOGIN";

    response.render("login", {titulo: titulo, error: null });
};

exports.mostrarRegistro = (request, response) => {
    const titulo = "REGISTRO";

    response.render("registro", {titulo: titulo, error: null });
};

exports.registrar = async (request, response) => {

    try {
        const { nombre, correo, clave } = request.body;

        const existe = await usuarioModel.findOne({ where: { correo } });

        if (existe) {
            return response.render("registro", {titulo: "REGISTRO", error: "El correo ya existe" })
        }

        const hash = await bcrypt.hash(clave, 10);

        await usuarioModel.create({ nombre, correo, clave: hash });

        response.redirect("/admin/login");

    } catch (error) {
        console.log(error)
        response.status(500).render("registro", {titulo: "LOGIN", error: "Error interno del servidor" })
    }

};

exports.login = async (request, response) => {

    try {
        const { correo, clave } = request.body;

        const usuario = await usuarioModel.findOne({ where: { correo } });

        if (!usuario || !(await bcrypt.compare(clave, usuario.clave))) {
            return response.render("login", { titulo: "LOGIN", error: "Credenciales invalidas" })
        }
        
        request.session.usuario = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo };

        response.redirect("/admin/dashboard");

    } catch (error) {
        console.log(error)
        response.status(500).render("login", {titulo: "LOGIN", error: "Error interno del servidor" })
    }

};

exports.logout = async (request, response) => {
    request.session.destroy(
        () => response.redirect("/admin/login")
    );
}
