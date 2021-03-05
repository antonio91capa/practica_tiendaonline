var express = require('express');
var { check } = require('express-validator');

const router = express.Router();

const { listaCategorias, crearCategoria, crearCategoriaVista,
   editarCategoria, editarCategoriaVista, eliminarCategoria
} = require('../servicios/admincategoria.servicio');
const { isAdmin } = require('../config/auth');


// GET lista categorias
router.get('/', isAdmin, listaCategorias);

/**
 * GET add categoria
 */
router.get('/add', isAdmin, crearCategoriaVista);

/**
 * POST add categoria
 */
router.post('/add', isAdmin, [
   check('nombre', 'El nombre no debe estar vacio').notEmpty()
], crearCategoria);

/**
 * GET edit categoria
 */
router.get('/editar/:id', isAdmin, editarCategoriaVista);

/**
 * POST edit categoria
 */
router.post('/editar/:id', isAdmin, [
   check('nombre', 'El nombre no debe estar vacio').notEmpty()
], editarCategoria);

/**
 * POST delete categoria
 */
router.get('/eliminar/:id', isAdmin, eliminarCategoria);

module.exports = router;