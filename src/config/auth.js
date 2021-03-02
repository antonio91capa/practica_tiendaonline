exports.isUsuario = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   } else {
      req.flash('danger', 'Por favor logueate.')
      res.redirect('/usuario/login');
   }
}

exports.isAdmin = (req, res, next) => {
   if (req.isAuthenticated() && res.locals.usuario.admin == 1) {
      return next();
   } else {
      req.flash('danger', 'No tienes permisos para acceder a la pagina solicitada');
      return res.redirect('/usuario/login');
   }
}