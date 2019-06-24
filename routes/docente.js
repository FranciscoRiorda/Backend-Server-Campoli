var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Docente = require('../models/docente');

// =================================
// Obtener todos las docentes
// =================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Docente.find({})
        .skip(desde)
        .limit(5)
        .populate('persona', 'nombre apellido cuit telefono')
        .populate('cargo')
        .populate('usuario', 'nombre email')

    .exec((err, docentes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando docente',
                errors: err
            });
        }

        Docente.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                docentes: docentes,
                total: conteo
            })
        });
    });

});


// =================================
// Actualizar docente
// =================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Docente.findById(id, (err, docente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar docente',
                errors: err
            });
        }

        if (!docente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El docente con el id' + id + 'no existe',
                errors: { message: 'No existe docente con ese ID' }
            });
        }

        docente.persona = body.persona;
        docente.cargo = body.cargo;
        docente.usuario = req.usuario._id;

        docente.save((err, docenteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar docente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                docente: docenteGuardado
            });
        })

    })

})


// =================================
// Crear un nuevo docente
// =================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var docente = new Docente({
        persona: body.persona,
        cargo: body.cargo,
        usuario: req.usuario._id


    });

    docente.save((err, docenteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear docente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: docenteGuardado
        });
    });
});

// =================================
// Borrar un docente por el ID
// =================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Docente.findByIdAndRemove(id, (err, docenteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar docente',
                errors: err
            });
        }
        if (!docenteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe docente con ese id',
                errors: { message: 'No existe docente con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            docente: docenteBorrado
        });
    });
});

module.exports = app;