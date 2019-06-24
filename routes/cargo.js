var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Cargo = require('../models/cargo');

// =================================
// Obtener todos las cargos
// =================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cargo.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, cargos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando cargo',
                    errors: err
                });
            }

            Cargo.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    cargos: cargos,
                    total: conteo
                })
            });
        });

});


// =================================
// Actualizar cargo
// =================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Cargo.findById(id, (err, cargo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cargo',
                errors: err
            });
        }

        if (!cargo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cargo con el id' + id + 'no existe',
                errors: { message: 'No existe cargo con ese ID' }
            });
        }

        cargo.nombre = body.nombre;
        cargo.usuario = req.usuario._id;

        cargo.save((err, cargoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cargo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cargo: cargoGuardado
            });
        })

    })

})


// =================================
// Crear un nuevo cargo
// =================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var cargo = new Cargo({
        nombre: body.nombre,
        usuario: req.usuario._id


    });

    cargo.save((err, cargoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cargo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: cargoGuardado
        });
    });
});

// =================================
// Borrar un cargo por el ID
// =================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Cargo.findByIdAndRemove(id, (err, cargoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cargo',
                errors: err
            });
        }
        if (!cargoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe cargo con ese id',
                errors: { message: 'No existe cargo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            cargo: cargoBorrado
        });
    });
});

module.exports = app;