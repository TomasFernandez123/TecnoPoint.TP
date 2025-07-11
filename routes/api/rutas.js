const express = require('express');
const {getController, postController, putController, deleteController, getControllerById, 
    estadoController, getActives, getControllerByPage, getControllerActivesByPage} = require('../../controllers/api/controladorProducto.js');

//CONFIGURACION DE MULTER
const multer = require("multer");
const mime = require("mime-types");

const storage = multer.diskStorage({
    destination: "public/fotos/",
})

const upload = multer({
    storage: storage
});

const rutas = express.Router();

// RUTA PARA TRAER PRODUCTOS PAGINADOS
rutas.get('/page', getControllerByPage);
rutas.get('/activos/page', getControllerActivesByPage);

// TRAER ACTIVOS
rutas.get('/activos', getActives);

// RUTA GET
rutas.get('/', getController);

rutas.get('/:id', getControllerById);

// RUTA POST
rutas.post('/', upload.single('foto'),  postController);
// RUTA PUT
rutas.put('/:id', upload.single('foto'),  putController);
// RUTA DELETE
rutas.delete('/:id', deleteController);
// RUTA ESTADO
rutas.put('/estado/:id', estadoController);

module.exports = rutas;