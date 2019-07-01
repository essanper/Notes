const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');


passport.use(new localStrategy({
  usernameField: 'usuario_nombre',
  passwordField: 'password'
}, async (usuario_nombre, password, done) => {
  const usuarioLower = usuario_nombre.toLowerCase();

  const existeUsuario = await Usuario.findOne({usuario_nombre: usuarioLower});

  if(!existeUsuario){
    return done(null, false, {message: 'Usuario no existe.'});

  }else{
    const coinciden = await existeUsuario.compararPasswords(password);
    if(coinciden){
      return done(null, existeUsuario);

    }else {
      return done(null, false, {message: 'Contraseña incorrecta'});
    }
  }

}));

passport.serializeUser((usuario, done) => {
  // GUARDAR EL ID DEL USUARIO PARA NAVEGAR ENTRE DISTINTAS PAGINAS
  done(null, usuario._id);
});

passport.deserializeUser((id, done) => {
  Usuario.findById(id, (err, usuario) => {
    done(err, usuario);
  });
});
