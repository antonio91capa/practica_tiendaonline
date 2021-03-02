const express = require('express');
const fs = require('fs-extra');

const router = express.Router();

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
//const { isUsuario } = require('../config/auth');

/** 
 * GET all products 
 */
router.get('/', (req, res) => {

   let categorias = 0;
   Categoria.find((err, c) => {
      if (err) return console.log('Error: ', err);

      categorias = c;
   })

   Producto.find((err, productos) => {
      if (err) return console.log(err);

      res.render('usuario/productos/all_productos', {
         titulo: 'Lista de productos',
         productos: productos,
         categorias: categorias
      });
   });
});

/** 
 * GET productos por categoria
 */
router.get('/:categoria', (req, res) => {
   var cateogoriaSlug = req.params.categoria;
   let categorias = 0;

   Categoria.find((err, c) => {
      if (err) return console.log('Error: ', err);

      categorias = c;
   });

   Categoria.findOne({ slug: cateogoriaSlug }, (err, categoria) => {
      Producto.find({ categoria: cateogoriaSlug }, (err, productos) => {
         if (err) console.log(err);

         res.render('usuario/productos/producto_por_categoria', {
            titulo: categoria.nombre,
            productos: productos,
            categorias: categorias
         });
      });
   });
});

/** 
 * GET detalles del producto seleccionado
 */
router.get('/:categoria/:producto', (req, res) => {
   var galleriaImagenes = null;
   var isAutenticado = (req.isAuthenticated()) ? true : false;

   let categorias = 0;

   Categoria.find((err, c) => {
      if (err) return console.log('Error: ', err);

      categorias = c;
   });
   
   Producto.findOne({ slug: req.params.producto }, (err, producto) => {
      if (err) console.log(err);

      // Obtener el path de la galeria de imagenes del producto seleccionado
      var galleriaDir = 'public/producto_imagenes/' + producto._id + '/gallery';

      // Obtener la galeria de imagenes
      fs.readdir(galleriaDir, (err, files) => {
         if (err) return console.log('Error al obtener las imagenes: ' + err);

         console.log('Galeria: ', files);

         galleriaImagenes = files;
         res.render('usuario/productos/detalleProducto', {
            titulo: producto.nombre,
            producto: producto,
            galeriaImagenes: galleriaImagenes,
            categorias: categorias,
            isAutenticado: isAutenticado
         });
      });
   });
});

module.exports = router;