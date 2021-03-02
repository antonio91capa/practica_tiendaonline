const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
   nombre: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   username: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   status: String,
   admin: Number
}, {
   versionKey: false
});

UsuarioSchema.methods.encryptPassword = async password => {
   const salt = await bcrypt.genSalt(10);
   return await bcrypt.hash(password, salt);
};

UsuarioSchema.methods.matchPassword = async function(password) {
   return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);