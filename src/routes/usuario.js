const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const Usuario = require('../models/usuario');

/** 
 * GET registrar usuario
 */
router.get('/registrar', (req, res) => {
   res.render('usuario/registrar', {
      titulo: 'Registro'
   });
});

/** 
 * POST registrar usuario
 */
router.post('/registrar', [
   check('nombre', 'El nombre no debe estar vacio').notEmpty()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
   check('email', 'El correo electrónico no debe estar vacio').notEmpty(),
   check('username', 'El username no debe estar vacio').notEmpty(),
   check('password', 'La constraseña no debe estar vacio').notEmpty(),
   check('password2', 'El campo confirmar contraseña no debe estar vacio').notEmpty(),
], (req, res) => {

   var nombre = req.body.nombre;
   var email = req.body.email;
   var username = req.body.username;
   var password = req.body.password;
   var confirmPassword = req.body.password2;

   // Errores en la validacion de los campos
   var errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.render('usuario/registrar', {
         titulo: 'Registro',
         errors: errors.array()
      });
   }

   Usuario.findOne({ username: username }, (err, usuario) => {
      if (err) console.log('Error: ', err);

      if (usuario) {
         req.flash('danger', 'Username ya existe, elige otro nombre de usuario');
         res.redirect('/usuario/registrar');
      }

      //Password equals
      if (password != confirmPassword) {
         req.flash('danger', 'Las constraseñas no son iguales');
         return res.redirect('/usuario/registrar');
      }

      const usuarioSave = new Usuario({
         nombre, email, username, password, status: 'Activo', admin: 0
      });

      // Genera la encriptacion del password
      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(usuarioSave.password, salt, (err, hash) => {
            if (err) console.log('Error en el hashing: ', err);

            usuarioSave.password = hash;

            usuarioSave.save(err => {
               if (err) console.log('Error: ', err);

               req.flash('success', 'Usuario registrado correctamente');
               res.redirect('/usuario/login');
            });
         });
      });
   });
});

/** 
 * GET login usuario
 */
router.get('/login', (req, res) => {
   if (res.locals.usuario) {
      return res.redirect('/');
   }

   res.render('usuario/login', {
      titulo: 'Login'
   });
});

/** 
 * POST login usuario
 */
router.post('/login', [
   check('username', 'El username no debe estar vacio').notEmpty(),
   check('password', 'La constraseña no debe estar vacio').notEmpty(),
], (req, res, next) => {

   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/usuario/login',
      failureFlash: true
   })(req, res, next);
});

/** 
 * GET logout usuario
 */
router.get('/logout', (req, res) => {
   req.logout();

   req.flash('success', 'Usuario deslogueado correctamente');
   res.redirect('/usuario/login');
});

module.exports = router;
