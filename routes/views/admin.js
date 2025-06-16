const express = require("express");
const router = express.Router();
const adminViews = require("../../controllers/views/controladorAdmin.js");

// Ruta al panel principal
router.get("/dashboard", adminViews.mostrarDashboard);

router.get("/productos", adminViews.mostrarProductos);

// Ruta al formulario de alta
router.get("/productos/nuevo", adminViews.mostrarFormularioAlta);

// Ruta al formulario de edición
router.get("/productos/editar/:id", adminViews.mostrarFormularioEdicion);

module.exports = router;
