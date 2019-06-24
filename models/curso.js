var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cursoSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    numeroCertificacion: { type: Number, required: [true, 'El número de certificación es necesario'] },
    cargaHoraria: { type: Number, required: false },
    fechaInicio: { type: String, required: false },
    fechaFin: { type: String, required: false },
    diasCursado: { type: String, required: false },
    horarioCursado: { type: String, required: false },
    sector: { type: String, required: false },
    trayectoFormativo: { type: String, required: false },
    sede: { type: Schema.Types.ObjectId, ref: 'Sede', required: [true, 'La	sede es	necesaria'] },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: [true, 'El docente es	necesario'] },
    coordinador: { type: Schema.Types.ObjectId, ref: 'Coordinador', required: [true, 'El coordinador es	necesario'] },
    adultoReferente: { type: Schema.Types.ObjectId, ref: 'AdultoReferente', required: [true, 'El adulto referente es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'cursos' });


module.exports = mongoose.model('Curso', cursoSchema);