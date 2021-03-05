const Usuario = require('../models/usuario');

const usuarioServicio = {};

usuarioServicio.registrarUsuarioVista = (req, res) => {
   res.render('usuario/registrar', {
      titulo: 'Registro'
   });
}

usuarioServicio.registrarUsuario = (req, res) => {

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
}

usuarioServicio.loginUsuarioVista = (req, res) => {
   if (res.locals.usuario) {
      return res.redirect('/');
   }

   res.render('usuario/login', {
      titulo: 'Login'
   });
}

usuarioServicio.loginUsuario = (req, res, next) => {
   console.log(req.locals.usuario);

   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/usuario/login',
      failureFlash: true
   })(req, res, next);
}

usuarioServicio.logoutUsuario = (req, res) => {
   req.logout();

   req.flash('success', 'Usuario deslogueado correctamente');
   res.redirect('/usuario/login');
}

module.exports = usuarioServicio;