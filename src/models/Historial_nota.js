const mongoose = require('mongoose');
const { Schema } = mongoose;

const HistorialNotaSchema = new Schema({
  titulo_nota: { type: String, required: true},
  descripcion_nota: {type: String, required: true},
  fecha_nota_creada: {type: Date, default: Date.now },
  fecha_nota_eliminada: {type: String},
  usuario_id: {type: String},
  video_nota: {type:String}
});

module.exports = mongoose.model('HistorialNota', HistorialNotaSchema);
