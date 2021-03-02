var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
const path = require('path');
var { check, validationResult } = require('express-validator');

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { isAdmin } = require('../config/auth');

const router = express.Router();

/*
 * GET producto index
*/
router.get('/', isAdmin, (req, res) => {
   let count = 0;
   Producto.countDocuments((err, numero) => {
      if (err) return console.log('Error: ', err);

      count = numero;
   });

   Producto.find((err, productos) => {
      if (err) return console.log(err);

      res.render('admin/productos/lista_productos', {
         titulo: 'Productos',
         productos: productos,
         count: count
      });
   });

});

/*
 * GET producto add
*/
router.get('/add', isAdmin, (req, res) => {
   var nombre = "";
   var descripcion = "";
   var precio = "";

   Categoria.find((err, categorias) => {
      if (err) return console.log('Error: ', err);

      res.render('admin/productos/add_producto', {
         titulo: 'Productos',
         nombre: nombre,
         descripcion: descripcion,
         precio: precio,
         categorias: categorias
      });
   });
});

/*
 * POST producto add
*/
router.post('/add', isAdmin,[
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
], (req, res) => {

   var imagenFile = typeof req.files.imagen !== "undefined" ? req.files.imagen.name : "";

   var nombre = req.body.nombre.trim();
   var slug = nombre.replace(/\s+/g, '-').toLowerCase().trim();
   var descripcion = req.body.descripcion;
   var precio = req.body.precio.trim();
   var categoria = req.body.categoria;

   // Validacion de errores: req.body
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      Categoria.find((err, categorias) => {
         if (err) return console.log('Error: ', err);

         res.render('admin/productos/add_producto', {
            titulo: 'Productos',
            errors: errors.array(),
            nombre: nombre,
            descripcion: descripcion,
            precio: parseFloat(precio).toFixed(2),
            categorias: categorias
         });
      });
   }

   Producto.findOne({ slug: slug }, (err, producto) => {
      if (producto) {
         req.flash('danger', 'El nombre del producto ya existe, elige otro nombre');

         Categoria.find((err, categorias) => {
            res.render('admin/productos/add_producto', {
               titulo: 'Productos',
               nombre: nombre,
               descripcion: descripcion,
               precio: parseFloat(precio).toFixed(2),
               categorias: categorias
            });
         });
      }

      var producto = new Producto({
         nombre,
         slug,
         descripcion,
         categoria,
         precio: parseFloat(precio).toFixed(2),
         imagen: imagenFile
      });

      // Crear directorios para las imagenes del producto
      try {
         mkdirp('public/producto_imagenes/' + producto._id);
         mkdirp('public/producto_imagenes/' + producto._id + '/gallery');
         mkdirp('public/producto_imagenes/' + producto._id + '/gallery/thumbs');
         console.log('directorios creados correctamente');
      } catch (err) {
         console.error('Error al crear los directorios: ', err);
      }

      // Guarda el producto en la Base de datos
      producto.save((error) => {
         if (error) console.log('Error al guardar el producto', error);

         if (imagenFile != "") {
            // Mover la imagen del producto a una carpeta de imagenes
            let productoImagen = req.files.imagen;
            const pathJoin = path.join(__dirname + '/../../public/producto_imagenes/' + producto._id + '/' + productoImagen.name);

            productoImagen.mv(pathJoin, (err)=>{
               return console.log('Error al mover la imagen del producto', err);
            });
         }

         req.flash('success', 'Producto guardado correctamente');
         res.redirect('/admin/producto/');
      });
   });
});

/**
 * GET edit producto
 */
router.get('/editar/:id', isAdmin, (req, res) => {

   // Verificar si existen errores
   let errors = null;
   if (req.session.errors) {
      errors = req.session.errors;
   }
   req.session.errors = null;

   Categoria.find((error, categorias) => {
      if (error) return console.log('Error', error);

      Producto.findById(req.params.id, (err, producto) => {
         if (err) {
            console.log(err);
            res.redirect('/admin/producto');
         }

         var galleryDir = 'public/producto_imagenes/' + producto._id + '/gallery';
         var galleryImagenes = null;

         fs.readdir(galleryDir, (err, files) => {
            if (err) {
               return console.log(err);
            }

            galleryImagenes = files;

            res.render('admin/producto/edit_producto', {
               titulo: 'Productos',
               nombre: producto.nombre,
               slug: producto.slug,
               descripcion: producto.descripcion,
               categorias: categorias,
               categoria: producto.categoria.replace(/\s+/g, '-').toLowerCase(),
               precio: parseFloat(producto.precio).toFixed(2),
               imagen: producto.imagen,
               galeriaImagenes: galleryImagenes,
               id: producto._id
            });
         });
      });
   });
});

/**
 * POST edit categoria
 */
router.post('/editar/:id', isAdmin, [
   check('nombre', 'El nombre del producto no debe estar vacio').notEmpty()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
   check('descripcion', 'La descripcion del producto no debe estar vacio').notEmpty(),
   check('precio', 'El precio del producto no debe estar vacio').notEmpty(),
   check('imagen', 'La imagen del producto no debe estar vacio').notEmpty()
], (req, res) => {

   var imagenFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

   var nombre = req.body.nombre;
   var slug = nombre.replace(/\s+/g, '-').toLowerCase();
   var descripcion = req.body.descripcion;
   var precio = req.body.precio;
   var categoria = req.body.categoria;
   var pimagen = req.body.pimagen;
   var id = req.params.id;

   // Validacion de errores
   var results = validationResult(req);
   if (!results.isEmpty()) {
      req.session.errors = results;
      return res.redirect('/admin/producto/editar/' + id);

      /*Categoria.find((err, categorias) => {
         res.render('admin/productos/edit_producto', {
            titulo: 'Productos',
            errors: errors.array(),
            nombre: nombre,
            descripcion: descripcion,
            precio: parseFloat(precio).toFixed(2),
            categorias: categorias,
            imagen: pimagen,
            //galeriaImagenes: galleryImagenes,
            id: id
         });
      });*/
   }

   Producto.findOne({ slug: slug, _id: { '$ne': id } }, (err, producto) => {
      if (err) return console.log('Producto no encontrado', err);

      if (producto) {
         req.flash('danger', 'El producto ya existe, elige otro nombre');
         return res.redirect('/admin/producto/editar/' + id);

         /*res.render('admin/categorias/edit_categoria', {
            nombre: nombre,
            descripcion: descripcion,
            precio: parseFloat(precio).toFixed(2),
            categorias: categorias,
            imagen: pimagen,
            //galeriaImagenes: galleryImagenes,
            id: id
         });*/
      }

      Producto.findById(id, (error, productoUpdate) => {
         if (err) return console.log(error);

         productoUpdate.nombre = nombre;
         productoUpdate.slug = slug;
         productoUpdate.descripcion = descripcion;
         productoUpdate.precio = parseFloat(precio).toFixed(2);
         productoUpdate.categoria = categoria;
         if (imagenFile != "") {
            productoUpdate.imagen = imagenFile;
         }

         productoUpdate.save((err) => {
            if (err) return console.log(err);

            // Eliminar la imagen anterior y guardar la nueva imagen
            if (imagenFile != "") {
               if (pimagen != "") {
                  fs.remove('public/producto_imagenes/' + id + '/' + pimagen, (err) => {
                     if (err) return console.log(err);
                  });
               }

               // Guardar la nueva imagen
               var productoImagen = req.files.image;
               var path = 'public/producto_imagenes/' + id + '/' + imagenFile;

               productoImagen.mv(path, (err) => {
                  return console.log(err);
               });
            }

            req.flash('success', 'Producto actualizado correctamente');
            res.redirect('/admin/producto');
         });
      });
   });
});

/**
 * POST agregar galeria de imagenes de los productos
 */
router.post('/productos-gallery/:id', isAdmin, (req, res) => {
   var productoImagen = req.files.file;
   var id = req.params.id;
   var path = 'public/producto_imagenes/' + id + '/gallery/' + req.files.file.name;
   var thumbsPath = 'public/producto_imagenes/' + id + '/gallery/thumbs/' + req.files.file.name;

   // Mover todas las imagenes a la carpeta de la galeria de manera sincrona (una tras otra).
   productoImagen.mv(path, (err) => {
      if (err) console.log(err);

      // Reducir las dimensiones de las imagenes de los productos
      resizeImg(fs.readFileSync(path), { width: 100, height: 100 })
         .then((buf) => {
            fs.writeFileSync(thumbsPath, buf);
         });
   });

   res.sendStatus(200);
});

/**
 * GET eliminar imagen de la galeria
 */
router.get('/gallery/eliminar-imagen/:imagen', isAdmin, (req, res) => {
   var originalImage = 'public/producto_imagenes/' + req.query.id + '/gallery/' + req.params.image;
   var thumbImage = 'public/producto_imagenes/' + req.query.id + '/gallery/thumbs' + req.params.image;

   // Eliminar imagen de la carpeta gallery
   fs.remove(originalImage, (err) => {
      if (err) return console.log('Error al eliminar la imagen de la galeria del producto: ', err);
   });

   // Eliminar imagen de la carpeta gallery -> thumbs
   fs.remove(thumbImage, (err) => {
      if (err) return console.log('Error al eliminar la imagen: ', err);
   });

   req.flash('success', 'Imagen del Producto eliminado correctamente');
   res.redirect('/admin/producto/editar/' + req.query.id);
});

/**
 * GET eliminar producto
 */
router.get('/eliminar/:id', isAdmin, (req, res) => {

   var id = req.params.id;
   var path = 'public/producto_imagenes/' + id;

   //Eliminar la imagen principal del producto
   fs.remove(path, (err) => {
      if (err) return console.log(err);

      Producto.findByIdAndRemove(id, (err) => {
         if (err) return console.log('El producto no existe. ' + err);

         req.flash('success', 'Producto eliminado correctamente');
         res.redirect('/admin/producto');
      });
   });
});

module.exports = router;