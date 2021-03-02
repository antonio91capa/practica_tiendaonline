const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('../models/usuario');

const authenticacionUsuario = (passport) => {
   passport.use(new LocalStrategy({
      usernameField: 'username'
   }, async (username, password, done) => {

      const usuario = await Usuario.findOne({ username: username });

      if (!usuario) {
         return done(null, false, { message: 'Usuario no encontrado' });
      }

      const match = await usuario.matchPassword(password);
      if (match) {
         return done(null, usuario);
      } else {
         return done(null, false, { message: 'Nombre de usuario o contraseña incorrectas' });
      }
   }));

   passport.serializeUser((usuario, done) => {
      done(null, usuario.id);
   });

   passport.deserializeUser((id, done) => {
      Usuario.findById(id, 'nombre email username status admin', (err, usuario) => {
         done(err, usuario);
      });
   });
};

module.exports = authenticacionUsuario;