var express = require('express');

const router = express.Router();

const { paginaAcceso, paginaIndex } = require('../servicios/home.servicio');

//GET /
router.get('/', paginaIndex);

// GET a page
router.get('/:slug', paginaAcceso);

module.exports = router;