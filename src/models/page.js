var mongoose = require('mongoose');

var PageSchema = new mongoose.Schema({
   nombre: {
      type: String,
      required: true
   },
   slug: {
      type: String
   },
   contenido: {
      type: String,
      required: true,
   },
   sorting: {
      type: Number
   }
}, {
   versionKey: false
});

module.exports = mongoose.model('Page', PageSchema);