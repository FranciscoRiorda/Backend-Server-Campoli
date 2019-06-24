var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Persona = require('../models/persona');

// =================================
// Obtener todos los personas
// =================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Persona.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('cargo')
        .exec((err, personas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando persona',
                    errors: err
                });
            }

            Persona.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    personas: personas,
                    total: conteo
                })
            });
        });

});


// =================================
// Actualizar persona
// =================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Persona.findById(id, (err, persona) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar persona',
                errors: err
            });
        }

        if (!persona) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + 'no existe',
                errors: { message: 'No existe persona con ese ID' }
            });
        }

        persona.nombre = body.nombre;
        persona.apellido = body.apellido;
        persona.cuit = body.cuit;
        persona.telefono = body.telefono;
        persona.domicilio = body.domicilio;
        persona.cargaHoraria = body.cargaHoraria;
        persona.insumos = body.insumos;
        persona.total = body.total;
        persona.cargo = body.cargo;
        persona.usuario = req.usuario._id;

        persona.save((err, personaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar persona',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                persona: personaGuardada
            });
        })

    })

})


// =================================
// Crear una nueva persona
// =================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var persona = new Persona({
        nombre: body.nombre,
        apellido: body.apellido,
        cuit: body.cuit,
        telefono: body.telefono,
        domicilio: body.domicilio,
        cargaHoraria: body.cargaHoraria,
        honorarios: body.honorarios,
        insumos: body.insumos,
        total: body.total,
        cargo: body.cargo,
        usuario: req.usuario._id


    });

    persona.save((err, personaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear persona',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: personaGuardado
        });
    });
});

// =================================
// Borrar una persona por el ID
// =================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Persona.findByIdAndRemove(id, (err, personaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar persona',
                errors: err
            });
        }
        if (!personaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe persona con ese id',
                errors: { message: 'No existe persona con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            persona: personaBorrada
        });
    });
});

module.exports = app;