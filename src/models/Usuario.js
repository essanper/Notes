const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
  usuario_nombre: {type: String, required: true},
  password: {type: String, required: true},
  usuario_fecha: {type:Date, default: Date.now}
});


UsuarioSchema.methods.encriptarPassword = async (password) => {
 const salt = await bcrypt.genSalt(10);
 const hash = bcrypt.hash(password, salt);
 return hash;
};

UsuarioSchema.methods.compararPasswords = async function(password) {
  // PARA NO PERDER EL "SCOPE" USO UNA FUNCION DE ES5 LA DE TODA LA VIDA
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('Usuario', UsuarioSchema);
