var Page = require('../models/page');
var Categoria = require('../models/categoria');

const homeServicio = {}

homeServicio.paginaIndex = async (req, res) => {

   // Mostrar las paginas en el menu
   const pages = await Page.find({}).sort({ sorting: 1 }).exec();

   req.app.locals.pages = pages;

   const categorias = await Categoria.find();

   res.render('index', {
      titulo: 'Tienda Online',
      categorias: categorias
   });
}

homeServicio.paginaAcceso = async (req, res) => {
   const slug = req.params.slug;

   const page = await Page.findOne({ slug: slug });

   if (!page) {
      res.redirect('/');
   } else {
      res.render('index', {
         titulo: page.titulo,
         contenido: page.content
      });
   }


   /* res.render('index', {
      titulo: 'Pagina',
      contenido: 'Contenido de la pagina creada'
   }); */

}

module.exports = homeServicio;