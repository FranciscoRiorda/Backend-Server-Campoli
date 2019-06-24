var express = require('express');

var app = express();

var Sede = require('../models/sede');
var Persona = require('../models/persona');
var Docente = require('../models/docente');
var Curso = require('../models/curso');
var Coordinador = require('../models/coordinador');
var Cargo = require('../models/cargo');
var AdultoReferente = require('../models/adultoReferente');
var Usuario = require('../models/usuario');


//=========================================
// Búsqueda por colección
//=========================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'sedes':
            promesa = buscarSedes(busqueda, regex);
            break;
        case 'personas':
            promesa = buscarPersonas(busqueda, regex);
            break;
        case 'docentes':
            promesa = buscarDocentes(busqueda, regex);
            break;
        case 'cursos':
            promesa = buscarCursos(busqueda, regex);
            break;
        case 'coordinadores':
            promesa = buscarCoordinadores(busqueda, regex);
            break;
        case 'cargos':
            promesa = buscarCargos(busqueda, regex);
            break;
        case 'adultosReferentes':
            promesa = buscarAdultosReferentes(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda son solo usuarios, sedes personas, docentes, cursos, coordinadores, cargos y adultos referentes',
                error: { message: 'Tipo de tabla/colección no váilda' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })
});



//=========================================
// Búsqueda General
//=========================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarSedes(busqueda, regex),
            buscarPersonas(busqueda, regex),
            buscarDocentes(busqueda, regex),
            buscarCursos(busqueda, regex),
            buscarCoordinadores(busqueda, regex),
            buscarCargos(busqueda, regex),
            buscarAdultosReferentes(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                sedes: respuestas[0],
                personas: respuestas[1],
                docentes: respuestas[2],
                cursos: respuestas[3],
                coordinadores: respuestas[4],
                cargos: respuestas[5],
                adultosReferentes: respuestas[6],
                usuarios: respuestas[7]
            });
        })

});

function buscarSedes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Sede.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, sedes) => {
                if (err) {
                    reject('Error al buscar sedes', err)
                } else {
                    resolve(sedes)
                }
            });
    });
}

function buscarPersonas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Persona.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('cargo')
            .exec((err, personas) => {
                if (err) {
                    reject('Error al buscar persona', err)
                } else {
                    resolve(personas)
                }
            });
    });
}

function buscarDocentes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Docente.find({ nombre: regex })

        .populate('persona', 'nombre')
            .exec((err, docentes) => {
                if (err) {
                    reject('Error al buscar docentes', err)
                } else {
                    resolve(docentes)
                }
            });
    });
}

function buscarCursos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Curso.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('sede', 'nombre')
            .populate('docente', 'persona')
            .populate('coordinador', 'persona')
            .populate('adultoReferente', 'persona')

        .exec((err, personas) => {
            if (err) {
                reject('Error al buscar personas', err)
            } else {
                resolve(personas)
            }
        });
    });
}

function buscarCoordinadores(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Coordinador.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('persona')
            .exec((err, coordinadores) => {
                if (err) {
                    reject('Error al buscar coordinadores', err)
                } else {
                    resolve(coordinadores)
                }
            });
    });
}

function buscarCargos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cargo.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, cargos) => {
                if (err) {
                    reject('Error al buscar cargos', err)
                } else {
                    resolve(cargos)
                }
            });
    });
}

function buscarAdultosReferentes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        AdultoReferente.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('persona')
            .exec((err, adultosReferentes) => {
                if (err) {
                    reject('Error al buscar adultos referentes', err)
                } else {
                    resolve(adultosReferentes)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuario', err);
                } else {
                    resolve(usuarios)
                }
            })
    });
}


module.exports = app;