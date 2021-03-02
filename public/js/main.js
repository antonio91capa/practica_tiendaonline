$(function () {
   // Check Editor library
   if ($('textarea#contenido').length) {
      CKEDITOR.replace('contenido');
   }

   $('a.confirmDelete').on('click', function () {
      if (!confirm('¿Desea eliminar este page?')) {
         return false;
      }
   });

   // Fancy Box library
   if ($("[data-fancybox]").length) {
      $("[data-fancybox]").fancybox();
   }
});