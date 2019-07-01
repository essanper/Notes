const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db-notasapp', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}).then(db => console.log('Conectado a la base de datos db-notasapp'))
  .catch(err => console.error(err)); // conexión con la base de datos llamada db-notasapp
