var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cargoSchema = new Schema({
    nombre: { type: String, required: [true, 'El cargo es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'cargos' });


module.exports = mongoose.model('Cargo', cargoSchema);