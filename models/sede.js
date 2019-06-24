var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sedeSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    domicilio: { type: String, required: [true, 'El	domicilio es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'sedes' });


module.exports = mongoose.model('Sede', sedeSchema);