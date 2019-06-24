// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar Variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var cursoRoutes = require('./routes/curso');
var sedeRoutes = require('./routes/sede');
var adultoReferenteRoutes = require('./routes/adultoReferente');
var coordinadorRoutes = require('./routes/coordinador');
var docenteRoutes = require('./routes/docente');
var personaRoutes = require('./routes/persona');
var cargoRoutes = require('./routes/cargo');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');





// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/CampoliDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');
});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/curso', cursoRoutes);
app.use('/adultoReferente', adultoReferenteRoutes);
app.use('/coordinador', coordinadorRoutes);
app.use('/docente', docenteRoutes);
app.use('/persona', personaRoutes);
app.use('/sede', sedeRoutes);
app.use('/cargo', cargoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);

app.use('/', appRoutes);



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
})