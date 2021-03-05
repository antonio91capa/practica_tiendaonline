var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var path = require('path');
var { check, validationResult } = require('express-validator');

const { listaProducto, crearProductoVista, crearProducto, editarProductoVista,
   editarProducto, eliminarProducto, agregarGalleriaImagenesProducto,
   eliminarImagenGalleriaProducto } = require('../servicios/adminproducto.servicio');
const { isAdmin } = require('../config/auth');

const router = express.Router();

/*
 * GET producto index
*/
router.get('/', isAdmin, listaProducto);

/*
 * GET producto add
*/
router.get('/add', isAdmin, crearProductoVista);

/*
 * POST producto add
*/
router.post('/add', isAdmin, [
   check('nombre', 'El nombre del producto no debe estar vacio').notEmpty()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
   check('descripcion', 'La descripcion del producto no debe estar vacio').notEmpty(),
   check('precio', 'El precio del producto no debe estar vacio').notEmpty(),
   check('imagen').custom((value, { req }) => {
      let mimetype = req.files.imagen.mimetype;

      switch (mimetype) {
         case 'image/jpg':
            return 'jpg';
         case 'image/jpeg':
            return 'png';
         case 'image/png':
            return 'png';
         default:
            return false;
      }
   }).withMessage('La imagen es incorrecta. Selecciona jpg, jpeg o png')
], crearProducto);

/**
 * GET edit producto
 */
router.get('/editar/:id', isAdmin, editarProductoVista);

/**
 * POST edit categoria
 */
router.post('/editar/:id', isAdmin, [
   check('nombre', 'El nombre del producto no debe estar vacio').notEmpty()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
   check('descripcion', 'La descripcion del producto no debe estar vacio').notEmpty(),
   check('precio', 'El precio del producto no debe estar vacio').notEmpty(),
   check('imagen', 'La imagen del producto no debe estar vacio').notEmpty()
], editarProducto);

/**
 * POST agregar galeria de imagenes de los productos
 */
router.post('/productos-gallery/:id', isAdmin, agregarGalleriaImagenesProducto);

/**
 * GET eliminar imagen de la galeria
 */
router.get('/gallery/eliminar-imagen/:imagen', isAdmin, eliminarImagenGalleriaProducto);

/**
 * GET eliminar producto
 */
router.get('/eliminar/:id', isAdmin, eliminarProducto);

module.exports = router;