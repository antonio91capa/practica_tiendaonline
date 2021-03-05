var express = require('express');
var { body } = require('express-validator');

const router = express.Router();

const { listaPages, crearPageVista, crearPage, 
   editarPageVista, editarPage, eliminarPage, reorderPages 
   } = require('../servicios/adminpage.servicio');
const { isAdmin } = require('../config/auth');

/*
 * GET page index
*/
router.get('/', isAdmin, listaPages);

/**
 * GET add page
 */
router.get('/add', isAdmin, crearPageVista);

/**
 * POST add page
 */
router.post('/add', isAdmin, [
   body('nombre', 'El titulo no debe estar vacio').notEmpty(),
   body('contenido', 'El contenido no debe estar vacio').notEmpty()
], crearPage);

/**
 * GET edit page
 */
router.get('/editar/:id', isAdmin, editarPageVista);

/**
 * POST edit page
 */
router.post('/editar/:id', isAdmin, [
   body('nombre', 'El titulo no debe estar vacio').notEmpty(),
   body('contenido', 'El contenido no debe estar vacio').notEmpty()
], editarPage);

/**
 * POST delete page
 */
router.get('/eliminar/:id', isAdmin, eliminarPage);

/**
 * POST reorder-pages
 */
router.post('/reorder-pages', isAdmin, reorderPages);

module.exports = router;