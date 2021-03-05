const homeServicio = {};

homeServicio.indexAdmin = (req, res) => {
   res.render('admin/admin_home', {
      titulo: 'Sistema Administrador de la Tienda Online'
   });
}

module.exports = homeServicio;