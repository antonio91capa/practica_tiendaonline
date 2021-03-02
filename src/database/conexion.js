const mongoose = require('mongoose');
const config = require('../config/configuracion');

const conectarDB = async () => {
   try {
      // Conexion MongoDB
      const con = await mongoose.connect(config.database, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: false
      });

      console.log(`MongoDB esta conectado ${con.connection.host}:  \x1b[32m%s\x1b[0m`, 'online');
   } catch (err) {
      console.log('Error en la conexion a la Base de datos', err);
      process.exit(1);
   }
}

module.exports = conectarDB;