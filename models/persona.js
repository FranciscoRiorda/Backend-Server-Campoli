var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var personaSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    apellido: { type: String, required: [true, 'El	apellido es	necesario'] },
    cuit: { type: String, required: [true, 'El	cuit es	necesario'] },
    telefono: { type: Number, required: false },
    domicilio: { type: String, required: false },
    cargaHoraria: { type: Number, required: false },
    honorarios: { type: Number, required: false },
    Insumos: { type: String, required: false },
    total: { type: String, required: false },
    cargo: { type: Schema.Types.ObjectId, ref: 'Cargo', required: [true, 'El	cargo es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'personas' });


module.exports = mongoose.model('Persona', personaSchema);