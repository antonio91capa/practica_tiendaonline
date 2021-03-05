const express = require('express');
const fs = require('fs-extra');

const router = express.Router();

const { allProductos, productoPorCategoria, detalleProducto } = require('../servicios/producto.servicio');

// GET todos los productos
router.get('/', allProductos);

// GET productos por categoria
router.get('/:categoria', productoPorCategoria);

// GET detalle del producto
router.get('/:categoria/:producto', detalleProducto);

module.exports = router;