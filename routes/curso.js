var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Curso = require('../models/curso');

// =================================
// Obtener todos los cursos
// =================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Curso.find({})
        .skip(desde)
        .limit(5)
        .populate('sede', 'nombre domicilio')
        .populate('docente', 'persona')
        .populate('coordinador', 'persona')
        .populate('adultoReferente', 'persona')
        .populate('usuario', 'nombre email')

    .exec((err, cursos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando curso',
                errors: err
            });
        }

        Curso.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                cursos: cursos,
                total: conteo
            })
        });
    });

});


// =================================
// Actualizar curso
// =================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Curso.findById(id, (err, curso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar curso',
                errors: err
            });
        }

        if (!curso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El curso con el id' + id + 'no existe',
                errors: { message: 'No existe curso con ese ID' }
            });
        }

        curso.nombre = body.nombre;
        curso.numeroCertificacion = body.numeroCertificacion;
        curso.cargaHoraria = body.cargaHoraria;
        curso.fechaInicio = body.fechaInicio;
        curso.fechaFin = body.fechaFin;
        curso.diasCursado = body.diasCursado;
        curso.horarioCursado = body.horarioCursado;
        curso.sector = body.sector;
        curso.trayectoFormativo = body.trayectoFormativo;
        curso.sede = body.sede;
        curso.docente = body.docente;
        curso.coordinador = body.coordinador;
        curso.adultoReferente = body.adultoReferente;
        curso.usuario = req.usuario._id;

        curso.save((err, cursoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar curso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                curso: cursoGuardado
            });
        })

    })

})


// =================================
// Crear un nuevo curso
// =================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var curso = new Curso({
        nombre: body.nombre,
        numeroCertificacion: body.numeroCertificacion,
        cargaHoraria: body.cargaHoraria,
        fechaInicio: body.fechaInicio,
        fechaFin: body.fechaFin,
        diasCursado: body.diasCursado,
        horarioCursado: body.horarioCursado,
        sector: body.sector,
        trayectoFormativo: body.trayectoFormativo,
        sede: body.sede,
        docente: body.docente,
        coordinador: body.coordinador,
        adultoReferente: body.adultoReferente,
        usuario: req.usuario._id


    });

    curso.save((err, cursoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear curso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: cursoGuardado
        });
    });
});

// =================================
// Borrar un curso por el ID
// =================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Curso.findByIdAndRemove(id, (err, cursoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar curso',
                errors: err
            });
        }
        if (!cursoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe curso con ese id',
                errors: { message: 'No existe curso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            curso: cursoBorrado
        });
    });
});

module.exports = app;