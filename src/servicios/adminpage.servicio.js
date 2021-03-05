var Page = require('../models/page');
var { validationResult } = require('express-validator');

const pageServicio = {};

pageServicio.listaPages = (req, res) => {
   const pages = await Page.find({}).sort({ sorting: 1 }).exec();

   res.render('admin/pages/pages', {
      titulo: 'Pages',
      pages: pages
   });
}

pageServicio.crearPageVista = (req, res) => {
   var nombre = "";
   var slug = "";
   var contenido = "";

   res.render('admin/pages/add_page', {
      titulo: 'Pages',
      nombre,
      slug,
      contenido
   });
}

pageServicio.crearPage = (req, res) => {
   var nombre = req.body.nombre;
   var slug = nombre.replace(/\s+/g, '-').toLowerCase();
   var contenido = req.body.contenido;

   // Validacion de errores
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      res.render('admin/pages/add_page', {
         titulo: 'Pages',
         errors: errors.array(),
         nombre,
         slug,
         contenido
      });
   }

   Page.findOne({ slug: slug }, (err, page) => {
      if (err) return console.log(err);

      if (page) {
         req.flash('danger', 'El slug ya existe, elige otro nombre');
         res.render('admin/pages/add_page', {
            titulo: 'Pages',
            nombre,
            slug,
            contenido
         });
      }

      var page = new Page({
         nombre, slug, contenido, sorting: 100
      });

      page.save((error) => {
         if (error) return console.log('Error al guardar page', error);

         req.flash('success', 'Page guardada correctamente');
         res.redirect('/admin/pages');
      });
   });
}

pageServicio.reorderPages = (req, res) => {
   var ids = req.body['id[]'];

   sortPage(ids, () => {
      Page.find({}).sort({ sorting: 1 })
         .exec((err, pages) => {
            if (err) return console.log(err);

            // Guardarlo en local
            req.app.locals.pages = pages;
         });
   });
}

pageServicio.editarPageVista = (req, res) => {
   Page.findById(req.params.id, (err, page) => {
      if (err) {
         req.flash('error', err.message);
         res.redirect('/admin/pages');
      }

      res.render('admin/pages/edit_page', {
         titulo: 'Pages',
         nombre: page.nombre,
         slug: page.slug,
         contenido: page.contenido,
         id: page._id
      });
   });
}

pageServicio.editarPage = (req, res) => {
   var nombre = req.body.nombre;
   var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
   if (slug == "") slug = nombre.replace(/\s+/g, '-').toLowerCase();
   var contenido = req.body.contenido;
   var id = req.params.id;

   // Validacion de errores
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      res.render('admin/pages/edit_page', {
         titulo: 'Pages',
         errors: errors.array(),
         nombre,
         slug,
         contenido,
         id
      });
   }

   Page.findOne({ slug, _id: { '$ne': id } }, (err, page) => {
      if (err) return console.log('Error: ', err);

      if (page) {
         req.flash('danger', 'El nombre de la pagina ya existe, elige otro nombre');
         res.render('admin/pages/edit_page', {
            titulo: 'Pages',
            nombre,
            slug,
            contenido,
            id
         });
      }

      Page.findById(id, (error, pageUpdate) => {
         if (err) return console.log(error);

         pageUpdate.nombre = nombre;
         pageUpdate.slug = slug;
         pageUpdate.contenido = contenido;

         pageUpdate.save((err) => {
            if (err) return console.log(err);

            req.flash('success', 'Page actualizado correctamente');
            res.redirect('/admin/pages');
         });
      });
   });
}

pageServicio.eliminarPage = (req, res) => {
   Page.findByIdAndRemove(req.params.id, (err) => {
      if (err) return console.log('Page no existe');

      req.flash('success', 'Page eliminado correctamente');
      res.redirect('/admin/pages');
   });
}

// Funcion para drap-and-drop de pages para ordenarlos
function sortPage(ids, callback) {
   var count = 0;

   for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      count++;

      // Asincrono
      (function (count) {
         Page.findById(id, (err, page) => {
            page.sorting = count;
            page.save((err) => {
               if (err) return console.log(err);

               ++count;
               if (count >= ids.length) {
                  callback();
               }
            });
         });
      })(count);
   }
}

module.exports = pageServicio;