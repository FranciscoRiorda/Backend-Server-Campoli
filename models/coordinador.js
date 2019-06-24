var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var coordinadorSchema = new Schema({
    persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'La persona es necesario'] },
    cargo: { type: Schema.Types.ObjectId, ref: 'Cargo', required: [true, 'El cargo es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'coordinadores' });


module.exports = mongoose.model('Coordinador', coordinadorSchema);