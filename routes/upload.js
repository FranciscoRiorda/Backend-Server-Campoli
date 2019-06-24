var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Persona = require('../models/persona');
var Curso = require('../models/curso');
var Sede = require('../models/sede');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['cursos', 'personas', 'sedes', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no váilda',
            errors: { message: 'Las extensiones váldas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    //123132132-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo del termporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    })


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                })
            }

            var pathViejo = '../uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';



                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen  de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }

    if (tipo === 'personas') {

        Persona.findById(id, (err, persona) => {

            if (!persona) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Persona no existe',
                    errors: { message: 'Persona no existe' }
                })
            }

            var pathViejo = '../uploads/personas/' + persona.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            persona.img = nombreArchivo;

            persona.save((err, personaActualizado) => {

                personaActualizado.password = ':)';



                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen  de persona actualizada',
                    usuario: personaActualizado
                });
            });

        });

    }

    if (tipo === 'cursos') {

        Curso.findById(id, (err, curso) => {

            if (!curso) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Curso no existe',
                    errors: { message: 'Curso no existe' }
                })
            }

            var pathViejo = '../uploads/cursos/' + curso.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            curso.img = nombreArchivo;

            curso.save((err, cursoActualizado) => {

                cursoActualizado.password = ':)';



                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen  de curso actualizada',
                    usuario: cursoActualizado
                });
            });

        });


    }

    if (tipo === 'sedes') {

        Sede.findById(id, (err, sede) => {

            if (!sede) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Sede no existe',
                    errors: { message: 'Sede no existe' }
                })
            }

            var pathViejo = '../uploads/sedes/' + sede.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            sede.img = nombreArchivo;

            sede.save((err, sedeActualizado) => {

                sedeActualizado.password = ':)';



                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen  de sede actualizada',
                    usuario: sedeActualizado
                });
            });

        });


    }

}

module.exports = app;