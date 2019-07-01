const express = require('express');
const router = express.Router();
const Nota = require('../models/Nota');
const { isAuthenticated } = require('../helpers/autenticar');

router.get('/notas/agregar', isAuthenticated, (request, response) => {
  response.render('notas/nueva-nota');
});

router.post('/notas/nueva-nota', isAuthenticated, async (request, response) => {
  const { titulo_nota, descripcion_nota, video_nota } = request.body;
  console.log(request.body);
  const errores = [];

  if(titulo_nota.length < 3 || titulo_nota.length > 13){
    errores.push({textoError: " El título de la nueva nota, debe tener entre 3 y 13 caractéres."});
  }

  if(descripcion_nota.length < 3 || descripcion_nota.length > 140){
    errores.push({textoError: " La descripcion de la nueva nota, debe tener entre 3 y 140 caractéres."});
  }

  if(errores.length > 0){
    response.render('notas/nueva-nota', {
      errores,
      descripcion_nota,
      titulo_nota,
      video_nota
    });

  }else {

    const nuevaNota = new Nota({titulo_nota, descripcion_nota});
    nuevaNota.usuario_id = request.user.id;

    if(video_nota.includes('https://youtu.be/')){
        const video_nota_id = video_nota.split('https://youtu.be/');
        nuevaNota.video_nota = video_nota_id[1];
    }

    nuevaNota.fecha_nota_vista = nuevaNota.fecha_nota.getDate()+"/"+(nuevaNota.fecha_nota.getMonth()+1)+"/"+nuevaNota.fecha_nota.getFullYear();

    console.log(nuevaNota.fecha_nota_vista);

    await nuevaNota.save();
    console.log(nuevaNota);
    request.flash('exito_msg', 'Nota agregada correctamente.');
    console.log('Nota agregada correctamente.');
    response.redirect('/notas');
  }

});

router.get('/notas', isAuthenticated, async (request, response) => {
   const notas = await Nota.find({usuario_id:request.user.id}).sort({fecha_nota: 'desc'});
   response.render('notas/todas-notas', { notas });
});

router.get('/notas/editar/:id', isAuthenticated, async (request, response) => {
  const editarNota = await Nota.findById({_id:request.params.id});

  response.render('notas/editar-nota', { editarNota });
});

router.put('/notas/editar-nota/:id', isAuthenticated, async (request, response) => {
  const {titulo_nota, descripcion_nota, video_nota} = request.body;

  if(video_nota != null && video_nota.includes('https://youtu.be/')){
      const video_nota_id = video_nota.split('https://youtu.be/');
      const editarNota = await Nota.findByIdAndUpdate(request.params.id, {titulo_nota, descripcion_nota, video_nota: video_nota_id[1]});

  }else {
    const editarNota = await Nota.findByIdAndUpdate(request.params.id, {titulo_nota, descripcion_nota});
  }

  request.flash('exito_msg', 'Nota editada correctamente.');
  console.log('Nota editada correctamente.');
  response.redirect('/notas');

});

router.delete('/notas/eliminar/:id', isAuthenticated, async (request, response) => {
  const eliminarNota = await Nota.findByIdAndDelete(request.params.id);
  request.flash('exito_msg', 'Nota eliminada correctamente.');
  console.log('Nota eliminada correctamente.');
  response.redirect('/notas');
});

router.get('/notas/tabla-notas', isAuthenticated, async (request, response) => {
  const notas = await Nota.find({usuario_id:request.user.id}).sort({fecha_nota: 'desc'});

  response.render("notas/tabla-notas", { notas });
});

module.exports = router;
