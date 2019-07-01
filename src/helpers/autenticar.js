const helpers = {};

helpers.isAuthenticated = ((request, response, next) => {

  if(request.isAuthenticated()){
    return next();

  }else {
    request.flash('error_msg', 'No has iniciado la sesión.');
    response.redirect('/usuario/login');
  }

});

module.exports = helpers;
