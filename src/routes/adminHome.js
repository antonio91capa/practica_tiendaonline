const router = require('express').Router();

const { isAdmin } = require('../config/auth');

/*
 * GET admin index
*/
router.get('/', isAdmin, (req, res) => {
   res.render('admin/admin_home', {
      titulo: 'Sistema Administrador de la Tienda Online'
   });
});

module.exports = router;