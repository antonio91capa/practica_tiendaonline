const express = require('express');
const path = require('path');

const Producto = require('../models/producto');

const router = express.Router();

/** 
 * GET agregar productos al carrito
 */
router.get('/add/:producto', (req, res) => {
   var slug = req.params.producto;
   //let pathJoin = "";

   Producto.findOne({ slug: slug }, (err, producto) => {
      if (err) return console.log('Error: ', err);

      let pathJoin = path.join(__dirname + '/../../public/producto_imagenes/' + producto._id + '/' + producto.imagen);

      if (typeof req.session.cart == "undefined") {
         req.session.cart = [];
         req.session.cart.push({
            nombre: producto.nombre,
            cantidad: 1,
            precio: parseFloat(producto.precio).toFixed(2),
            imagen: pathJoin
         });
      } else {
         let cart = req.session.cart;
         let newItem = true;

         for (let i = 0; i < cart.length; i++) {
            //if (cart[i].nombre == slug) {
            if (cart[i].nombre == producto.nombre) {
               cart[i].cantidad++;
               newItem = false;
               break;
            }
         }

         if (newItem) {
            cart.push({
               nombre: producto.nombre,
               cantidad: 1,
               precio: parseFloat(producto.precio).toFixed(2),
               imagen: pathJoin
            });
         }
      }

      req.flash('success', 'Producto agregado al carrito');
      res.redirect('/carrito/detalle-compra');
   });
});

/** 
 * GET mostrar el carrito de compras 
 */
router.get('/detalle-compra', (req, res) => {
   //console.log('Cart session: ', req.session.cart);

   if (req.session.cart && req.session.cart.length == 0) {
      delete req.session.cart;
      return res.render('usuario/carrito/carrito_compra', {
         titulo: 'Carrito de compra',
         cart: undefined
      });
   }

   res.render('usuario/carrito/carrito_compra', {
      titulo: 'Carrito de compra',
      cart: req.session.cart
   });
});

/** 
 * GET actualizar productos del carrito
 */
router.get('/update/:producto', (req, res) => {
   var slug = req.params.producto;
   var cart = req.session.cart;
   var action = req.query.action;

   for (let i = 0; i < cart.length; i++) {
      if (cart[i].nombre == slug) {
         switch (action) {
            case "add":
               cart[i].cantidad++;
               break;
            case "remove":
               cart[i].cantidad--;
               if (cart[i].cantidad < 1)
                  cart.splice(i, 1);
               break;
            case "clear":
               cart[i].splice(i, 1);
               if (cart.length == 0)
                  delete req.session.cart;
               break;
            default:
               break;
         }
      }
   }

   req.flash('success', 'Carrito actualizado correctamente');
   res.redirect('/carrito/detalle-compra');
});

/** 
 * GET limpiar carrito
 */
router.get('/clear', (req, res) => {
   delete req.session.cart;

   req.flash('success', 'Carrito limpiado correctamente');
   res.redirect('/carrito/detalle-compra');
});

/** 
 * GET realizar compra
 */
router.get('/realizar-pago', (req, res) => {
   delete req.session.cart;

   res.sendStatus(200);
});

module.exports = router;