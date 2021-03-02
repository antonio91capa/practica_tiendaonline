var express = require('express');

const router = express.Router();

var Page = require('../models/page');
var Categoria = require('../models/categoria');

/**
 * GET /
 */
router.get('/', (req, res) => {

   // Mostrar las paginas en el menu
   /*Page.find({}).sort({ sorting: 1 })
      .exec((err, pages) => {
         if (err) return console.log(err);

         req.app.locals.pages = pages;
      });*/

   //Descomentar
   //Mostrar la pagina home
   /* Page.findOne({ slug: "home" }, (err, page) => {
      if (err) return console.log(err);

      res.render('index', {
         title: page.title,
         content: page.content
      });
   }); */

   //req.app.locals.categorias = categorias;

   // Mostrar las categorias del sidebar
   Categoria.find((err, categorias) => {
      if (err) return console.log('Error: ', err);

      res.render('index', {
         titulo: 'Tienda Online',
         categorias: categorias
      });
   });
});

/**
 * GET a page
 */
router.get('/:slug', (req, res) => {
   const slug = req.params.slug;

   /*Page.findOne({ slug: slug }, (err, page) => {
      if (err) return console.log(err);

      if (!page) {
         res.redirect('/');
      }

      res.render('index', {
         titulo: page.titulo,
         contenido: page.content
      });
   });*/

   /*res.render('index', {
      titulo: 'Pagina',
      contenido: 'Contenido de la pagina creada'
   });*/

   res.send('Slug page');
});

module.exports = router;