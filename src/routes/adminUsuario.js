const express = require('express');

//const Usuario = require('../models/usuario');
const { isAdmin } = require('../config/auth');
const router = express.Router();

router.get('/', isAdmin, (req, res) => {
   res.render('admin/usuarios/lista_usuarios',{
      titulo: 'Lista de usuarios',
      usuarios: []
   });
});

module.exports = router;