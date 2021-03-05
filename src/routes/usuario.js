const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const { registrarUsuarioVista, registrarUsuario, loginUsuarioVista, loginUsuario, logoutUsuario } = require('../servicios/usuario.servicio');

// GET registrar usuario
router.get('/registrar', registrarUsuarioVista);

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
], registrarUsuario);

/** 
 * GET login usuario
 */
router.get('/login', loginUsuarioVista);

/** 
 * POST login usuario
 */
router.post('/login', [
   check('username', 'El username no debe estar vacio').notEmpty(),
   check('password', 'La constraseña no debe estar vacio').notEmpty(),
], loginUsuario);

/** 
 * GET logout usuario
 */
router.get('/logout', logoutUsuario);

module.exports = router;
