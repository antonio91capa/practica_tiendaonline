var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var morgan = require('morgan');
var flash = require('connect-flash');

var config = require('./src/config/configuracion');
var conectarDB = require('./src/database/conexion');

var adminPageRoute = require('./src/routes/adminPages');
var adminCategoriaRoute = require('./src/routes/adminCategoria');
var adminProductoRoute = require('./src/routes/adminProducto');
var adminUsuario = require('./src/routes/adminUsuario');
var adminRoute = require('./src/routes/adminHome');
var productosRoute = require('./src/routes/productos');
var homeRoute = require('./src/routes/home');
var cartRoute = require('./src/routes/cart');
var usuarioRoute = require('./src/routes/usuario');

// Init app
const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Public static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parsing Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Logger Middleware
app.use(morgan('dev'));

// Express FileUpload Middleware
app.use(fileUpload({
   preserveExtension: true
}));

// Variable de errores globales
app.locals.errors = null;

//Sessions
app.set('trust proxy', 1);
app.use(session({
   secret: config.session_secret,
   resave: true,
   saveUninitialized: true,
   //cookie: { secure: true }
}));

// Flash Notifications
app.use(flash());
app.use(function (req, res, next) {
   res.locals.messages = require('express-messages')(req, res);
   next();
});

// Passport Configuracion
require('./src/config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Sesion de Carrito
app.get('*', (req, res, next) => {
   res.locals.cart = req.session.cart;
   res.locals.usuario = req.user || null;
   next();
});

//Conectar a la Base de datos
conectarDB();

//Inicializar Pages del menu
// Inicializar categorias del sidebar
// source code

// Routes
app.use('/admin/pages', adminPageRoute);
app.use('/admin/categoria', adminCategoriaRoute);
app.use('/admin/producto', adminProductoRoute);
app.use('/admin/usuario', adminUsuario);
app.use('/admin', adminRoute);
app.use('/productos', productosRoute);
app.use('/carrito', cartRoute);
app.use('/usuario', usuarioRoute);
app.use('/', homeRoute);
app.use((req, res) => {
   res.render("404", {
      titulo: 'Error 404'
   });
});

// Server
app.listen(config.port, () => {
   console.log(`Server is up on port ${config.port}: \x1b[32m%s\x1b[0m `, 'online');
});
