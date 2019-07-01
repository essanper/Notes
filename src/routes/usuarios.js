const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const passport = require('passport');

router.get('/usuario/login', (request, response) => {
  response.render('usuarios/login');
});

router.post('/usuario/login', passport.authenticate('local', {
  successRedirect: '/notas',
  failureRedirect: '/usuario/login',
  failureFlash: true
}));

router.get('/usuario/registro', (request, response) => {
  response.render('usuarios/registro');
});

router.post('/usuario/registro', async (request, response) => {
  const {usuario_nombre, password, password_2 } = request.body;
  const errores = [];

  if(password != password_2){
    errores.push({textoError: ' Ambas contraseñas deben ser idénticas.'});
  }

  if(password.length < 4 ){
    errores.push({textoError:' La contraseña debe tener más de 4 caractéres.'});
  }

  if(usuario_nombre.length < 4 ){
    errores.push({textoError:' El nombre del usuario debe tener más de 4 caractéres.'});
  }

  if(errores.length > 0){
    response.render('usuarios/registro', {
      errores,
      usuario_nombre,
      password,
      password_2
    });

  }else{
    const existeUsuario = await Usuario.findOne({usuario_nombre: usuario_nombre});
    const usuarioLower = usuario_nombre.toLowerCase();

    if(!existeUsuario){
      const nuevoUsuario = new Usuario({usuario_nombre, password});
      nuevoUsuario.password = await nuevoUsuario.encriptarPassword(password);
      nuevoUsuario.usuario_nombre = usuarioLower;
      await nuevoUsuario.save();
      request.flash('exito_msg', 'Te has registrado con éxito. Ahora inicia tu sesión.');
      console.log('Te has registrado con éxito. Ahora inicia tu sesión.');
      response.redirect('/usuario/login');

    }else{
      request.flash('error_msg', 'El usuario ya existe, prueba con otro.');
      response.redirect('/usuario/registro');
    }

  }

});

router.get('/usuario/logout', (request, response) => {
  request.logout();
  response.redirect('/');
});

module.exports = router;
