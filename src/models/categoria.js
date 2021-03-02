var mongoose = require('mongoose');

var CategoriaSchema = new mongoose.Schema({
   nombre: {
      type: String,
      required: true
   },
   slug: {
      type: String
   }
}, {
   versionKey: false
});

module.exports = mongoose.model('Categoria', CategoriaSchema);