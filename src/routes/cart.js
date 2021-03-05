const express = require('express');
const path = require('path');

const router = express.Router();

const { actualizarProductoCarrito, agregarProductoCarrito, limpiarCarrito, mostrarCarritoCompra, realizarCompra } = require('../servicios/carrito.servicio');

/** 
 * GET agregar productos al carrito
 */
router.get('/add/:producto', agregarProductoCarrito);

/** 
 * GET mostrar el carrito de compras 
 */
router.get('/detalle-compra', mostrarCarritoCompra);

/** 
 * GET actualizar productos del carrito
 */
router.get('/update/:producto', actualizarProductoCarrito);

/** 
 * GET limpiar carrito
 */
router.get('/clear', limpiarCarrito);

/** 
 * GET realizar compra
 */
router.get('/realizar-pago', realizarCompra);

module.exports = router;