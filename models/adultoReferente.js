var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var adultoReferenteSchema = new Schema({
    persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'La persona es necesario'] },
    cargo: { type: Schema.Types.ObjectId, ref: 'Cargo', required: [true, 'El cargo es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'adultosReferentes' });


module.exports = mongoose.model('AdultoReferente', adultoReferenteSchema);