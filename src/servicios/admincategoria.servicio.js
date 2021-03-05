const Categoria = require('../models/categoria');
var { validationResult } = require('express-validator');

const categoriaServicio = {};

categoriaServicio.listaCategorias = async (req, res) => {
   const categorias = await Categoria.find({});

   res.render('admin/categorias/lista_categorias', {
      titulo: 'Categorias',
      categorias: categorias
   });
}

categoriaServicio.crearCategoriaVista = (req, res) => {
   let nombre = "";

   res.render('admin/categorias/add_categoria', {
      titulo: 'Categorias',
      nombre: nombre
   });
}

categoriaServicio.crearCategoria = (req, res) => {
   var nombre = req.body.nombre.trim();
   var slug = nombre.replace(/\s+/g, '-').toLowerCase();

   // Validacion de errores: req.body
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.render('admin/categorias/add_categoria', {
         titulo: 'Categorias',
         errors: errors.array(),
         nombre: nombre
      });
   }

   Categoria.findOne({ slug: slug }, (err, categoria) => {

      if (err) {
         req.flash('danger', 'Error' + err);
         res.redirect('/admin/categoria');
      }

      if (categoria) {
         req.flash('danger', 'La Categoria ya existe, elige otro nombre');
         return res.render('admin/categorias/add_categoria', {
            titulo: 'Categorias',
            nombre: nombre
         });
      }

      var categoria = new Categoria({
         nombre, slug
      });

      categoria.save((error) => {
         if (error) console.log('Error al guardar la categoria', error);

         req.flash('success', 'Categoria guardada correctamente');
         res.redirect('/admin/categoria');
      });

   });
}

categoriaServicio.editarCategoriaVista = async (req, res) => {
   const categoria = await Categoria.findById(req.params.id);

   if (categoria) {
      res.render('admin/categorias/lista_categorias', {
         titulo: 'Categorias',
         errors: 'Categoria no existe'
      });
   }

   res.render('admin/categorias/edit_categoria', {
      titulo: 'Categorias',
      nombre: categoria.nombre,
      id: categoria._id
   });
}

categoriaServicio.editarCategoria = (req, res) => {
   var nombre = req.body.nombre.trim();
   var slug = nombre.replace(/\s+/g, '-').toLowerCase();
   var id = req.params.id;

   // Validacion de errores
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.render('admin/categorias/edit_categoria', {
         titulo: 'Categorias',
         errors: errors.array(),
         nombre: nombre,
         id: id
      });
   }

   Categoria.findOne({ slug: slug, _id: { '$ne': id } }, (err, categoria) => {
      if (err) {
         return console.log('Error: ', err);
      }

      if (categoria) {
         req.flash('danger', 'La categoria ya existe, elige otro nombre');
         return res.render('admin/categorias/edit_categoria', {
            titulo: 'Categorias',
            nombre: nombre,
            id: id
         });
      }

      Categoria.findById(id, (error, categoriaUpdate) => {
         if (err) return console.log(error);

         categoriaUpdate.nombre = nombre;
         categoriaUpdate.slug = slug;

         categoriaUpdate.save((err) => {
            if (err) return console.log(err);

            req.flash('success', 'Categoria actualizada correctamente');
            res.redirect('/admin/categoria');
         });
      });
   });
}

categoriaServicio.eliminarCategoria = async (req, res) => {
   await Categoria.findByIdAndRemove(req.params.id);

   req.flash('success', 'Categoria eliminada correctamente');
   res.redirect('/admin/categoria');
}

module.exports = categoriaServicio;
