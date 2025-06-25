const express = require("express");
const router = express.Router();
const adminViews = require("../../controllers/views/controladorAdmin.js");
const protegerRuta = require("../../middlewares/verificar.js");

// Ruta al panel principal
router.get("/dashboard", protegerRuta,adminViews.mostrarDashboard);

router.get("/productos", protegerRuta,adminViews.mostrarProductos);

// Ruta al formulario de alta
router.get("/productos/nuevo", protegerRuta,adminViews.mostrarFormularioAlta);

// Ruta al formulario de edición
router.get("/productos/editar/:id", protegerRuta,adminViews.mostrarFormularioEdicion);

//LOGIN
router.get("/login",adminViews.mostrarLogin);
router.post("/login",adminViews.login);

//REGISTRO
router.get("/registro",adminViews.mostrarRegistro);
router.post("/registro",adminViews.registrar);

//LOGOUT
router.get("/logout", adminViews.logout);

module.exports = router;
