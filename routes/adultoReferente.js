var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var AdultoReferente = require('../models/adultoReferente');

// =================================
// Obtener todos las adultosReferentes
// =================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    AdultoReferente.find({})
        .skip(desde)
        .limit(5)
        .populate('persona', 'nombre apellido cuit telefono')
        .populate('cargo')
        .populate('usuario', 'nombre email')
        .exec((err, adultosReferentes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando adultoReferente',
                    errors: err
                });
            }

            AdultoReferente.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    adultosReferentes: adultosReferentes,
                    total: conteo

                })
            });
        });

});


// =================================
// Actualizar adultoReferente
// =================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    AdultoReferente.findById(id, (err, adultoReferente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar adultoReferente',
                errors: err
            });
        }

        if (!adultoReferente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El adultoReferente con el id' + id + 'no existe',
                errors: { message: 'No existe adultoReferente con ese ID' }
            });
        }

        adultoReferente.persona = body.persona;
        adultoReferente.cargo = body.cargo;
        adultoReferente.usuario = req.usuario._id;

        adultoReferente.save((err, adultoReferenteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar adultoReferente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                adultoReferente: adultoReferenteGuardado
            });
        })

    })

})


// =================================
// Crear un nuevo adultoReferente
// =================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var adultoReferente = new AdultoReferente({
        persona: body.persona,
        cargo: body.cargo,
        usuario: req.usuario._id


    });

    adultoReferente.save((err, adultoReferenteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear adultoReferente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: adultoReferenteGuardado
        });
    });
});

// =================================
// Borrar un adultoReferente por el ID
// =================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    AdultoReferente.findByIdAndRemove(id, (err, adultoReferenteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar adultoReferente',
                errors: err
            });
        }
        if (!adultoReferenteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe adultoReferente con ese id',
                errors: { message: 'No existe adultoReferente con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            adultoReferente: adultoReferenteBorrado
        });
    });
});

module.exports = app;