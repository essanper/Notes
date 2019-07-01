const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotaSchema = new Schema({
  titulo_nota: { type: String, required: true},
  descripcion_nota: {type: String, required: true},
  fecha_nota: {type: Date, default: Date.now },
  fecha_nota_vista: {type: String},
  usuario_id: {type: String},
  video_nota: {type:String}
});

module.exports = mongoose.model('Nota', NotaSchema);
