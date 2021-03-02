module.exports = {
   database: process.env.MONGODBURI || 'mongodb://localhost:27017/onlineshop',
   port: process.env.PORT || 3000,
   session_secret: process.env.SESSION_SECRET || 's3cret_key'
}