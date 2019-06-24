var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Coordinador = require('../models/coordinador');

// =================================
// Obtener todos las coordinadores
// =================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Coordinador.find({})
        .skip(desde)
        .limit(5)
        .populate('persona', 'nombre apellido cuit telefono')
        .populate('cargo')
        .populate('usuario', 'nombre email')
        .exec((err, coordinadores) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando coordinador',
                    errors: err
                });
            }

            Coordinador.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    coordinadores: coordinadores,
                    total: conteo
                })
            });
        });

});


// =================================
// Actualizar coordinador
// =================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Coordinador.findById(id, (err, coordinador) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar coordinador',
                errors: err
            });
        }

        if (!coordinador) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El coordinador con el id' + id + 'no existe',
                errors: { message: 'No existe coordinador con ese ID' }
            });
        }

        coordinador.persona = body.persona;
        coordinador.cargo = body.cargo;
        coordinador.usuario = req.usuario._id;

        coordinador.save((err, coordinadorGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar coordinador',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                coordinador: coordinadorGuardado
            });
        })

    })

})


// =================================
// Crear un nuevo coordinador
// =================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var coordinador = new Coordinador({
        persona: body.persona,
        cargo: body.cargo,
        usuario: req.usuario._id


    });

    coordinador.save((err, coordinadorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear coordinador',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: coordinadorGuardado
        });
    });
});

// =================================
// Borrar un coordinador por el ID
// =================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Coordinador.findByIdAndRemove(id, (err, coordinadorBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar coordinador',
                errors: err
            });
        }
        if (!coordinadorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe coordinador con ese id',
                errors: { message: 'No existe coordinador con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            coordinador: coordinadorBorrado
        });
    });
});

module.exports = app;