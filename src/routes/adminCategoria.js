var express = require('express');
var { check, validationResult } = require('express-validator');

const Categoria = require('../models/categoria');
const { isAdmin } = require('../config/auth');

const router = express.Router();

/*
 * GET categoria index
*/
router.get('/', isAdmin, (req, res) => {

   Categoria.find((err, categorias) => {
      if (err) return console.log(err);

      res.render('admin/categorias/lista_categorias', {
         titulo: 'Categorias',
         categorias: categorias
      });
   });
});

/**
 * GET add categoria
 */
router.get('/add', isAdmin, (req, res) => {
   let nombre = "";

   res.render('admin/categorias/add_categoria', {
      titulo: 'Categorias',
      nombre: nombre
   });
});

/**
 * POST add categoria
 */
router.post('/add', isAdmin, [
   check('nombre', 'El nombre no debe estar vacio').notEmpty()
], (req, res) => {

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

      if(err){
         req.flash('danger', 'Error'+err);
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
});

/**
 * GET edit categoria
 */
router.get('/editar/:id', isAdmin, (req, res) => {
   Categoria.findById(req.params.id, (err, categoria) => {
      if (err) return console.log(err);

      res.render('admin/categorias/edit_categoria', {
         titulo: 'Categorias',
         nombre: categoria.nombre,
         id: categoria._id
      });
   });
});

/**
 * POST edit categoria
 */
router.post('/editar/:id', isAdmin, [
   check('nombre', 'El nombre no debe estar vacio').notEmpty()
], (req, res) => {
   
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

   Categoria.findOne({ slug: slug, _id: { '$ne': id }}, (err, categoria) => {
      if (err){
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
});

/**
 * POST delete categoria
 */
router.get('/eliminar/:id', isAdmin, (req, res) => {
   Categoria.findByIdAndRemove(req.params.id, (err) => {
      if (err) return console.log('Page no existe');

      req.flash('success', 'Categoria eliminada correctamente');
      res.redirect('/admin/categoria');
   });
});

module.exports = router;