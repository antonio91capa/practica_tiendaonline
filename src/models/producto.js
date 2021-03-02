var mongoose = require('mongoose');

var ProductoSchema = new mongoose.Schema({
   nombre: {
      type: String,
      required: true
   },
   slug: {
      type: String
   },
   descripcion: {
      type: String
   },
   categoria: {
      type: String,
      required: true
   },
   precio: {
      type: Number,
      required: true
   },
   imagen: {
      type: String
   }
}, {
   versionKey: false
});

module.exports = mongoose.model('Producto', ProductoSchema);