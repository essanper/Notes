const express = require('express');
const path = require('path');
const exp_handlebars = require('express-handlebars');
const override = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Inicializaciones
const app = express();
require('./database');
require('./config/passport');


// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); // decirle a nodeJS donde esta la vista
app.engine('.hbs', exp_handlebars({
  defaultLayout: 'main', // fichero principal
  layoutsDir: path.join(__dirname, 'views/layouts'), // especificar lugar del fichero principal
  partialDir: path.join(__dirname, 'views/partials'), // ficheros reutilizables
  extname: '.hbs' // extensión de los ficheros

})); // configuración de las vistas con extension .hbs

app.set('view engine', '.hbs');

// Funciones intermediarias
app.use(express.urlencoded({extended: false})); // para identificar que tipo de dato me envía el formulario
app.use(override('_method')); // para que los forms acepten el envio de PUT/DELETE aparte de POST/GET
app.use(session({
  secret: 'palabraSecreta',
  resave: true,
  saveUninitialized: true
})); // para autenticar al usuario

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Variables globales
app.use((request, response, next) => {
  response.locals.exito_msg = request.flash('exito_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error'); // variable de reservada de passport donde se guardan los errores
  response.locals.user = request.user || null;  // variable de reservada de passport donde se guardan los usuarios

  next();
});

// Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notas'));
app.use(require('./routes/usuarios'));


// Ficheros estáticos
app.use(express.static(path.join(__dirname,'public'))); // lugar donde se encuentran los archivos

// Servidor
app.listen(app.get('port'), () => {
  console.log('Servidor escuchando por el puerto: '+app.get('port'));
});
