const express = require('express');
const router = express.Router();

const ventasController = require('../../controllers/api/controladorVentas');

router.post('/registrar', ventasController.registrarVenta);
router.get('/:id', ventasController.obtenerVenta);
router.get('/', ventasController.obtenerVentas);

module.exports = router;
