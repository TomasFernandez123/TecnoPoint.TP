/**
 * Controlador de vistas y lógica para el panel de administración.
 * Maneja autenticación de usuarios, renderizado de formularios, dashboard y visualización de ventas.
 */
const ProductoManager = require("../../models/Producto");
const {Venta, Usuario, Producto} = require('../../models');

const bcrypt = require('bcrypt');

/**
 * Renderiza el dashboard de administración con el listado de productos.
 * @route GET /admin/dashboard
 */
exports.mostrarDashboard = async (req, res) => {
    const productos = await ProductoManager.obtenerProductos();
    res.render("dashboard", { productos });
};

/**
 * Renderiza el formulario para dar de alta un nuevo producto.
 * @route GET /admin/productos/nuevo
 */
exports.mostrarFormularioAlta = (req, res) => {
    res.render("productForm", { producto: null, esEdicion: false });
};

/**
 * Renderiza el formulario de edición para un producto existente.
 * @route GET /admin/productos/editar/:id
 * @param {number} req.params.id - ID del producto a editar
 */
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

/**
 * Registra un nuevo usuario administrador.
 * Verifica si el correo ya existe, hashea la clave y crea el usuario.
 * @route POST /admin/registro
 */
exports.registrar = async (request, response) => {

    try {
        const { nombre, correo, clave } = request.body;

        const existe = await Usuario.findOne({ where: { correo } });

        if (existe) {
            return response.render("registro", {titulo: "REGISTRO", error: "El correo ya existe" })
        }

        const hash = await bcrypt.hash(clave, 10);

        await Usuario.create({ nombre, correo, clave: hash });

        response.redirect("/admin/login");

    } catch (error) {
        console.log(error)
        response.status(500).render("registro", {titulo: "LOGIN", error: "Error interno del servidor" })
    }

};

/**
 * Inicia sesión de un usuario administrador.
 * Verifica credenciales y guarda sesión.
 * @route POST /admin/login
 */
exports.login = async (request, response) => {
    try {
        const { correo, clave } = request.body;

        const usuario = await Usuario.findOne({ where: { correo } });

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

/**
 * Muestra la lista de ventas realizadas, incluyendo productos y cantidades.
 * @route GET /admin/ventas
 */
exports.mostrarVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: Producto,
        through: {
          attributes: ['cantidad'] // solo quiero que me traigas este campo extra de la tabla intermedia
        }
      }
    });

    res.render("ventas", { ventas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las ventas', error: error.message });
  }
}