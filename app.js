'use strict'

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
var usuario_rutas = require("./src/rutas/usuario.rutas");
var ligas_rutas = require("./src/rutas/liga.rutas")
var equipos_rutas = require("./src/rutas/equipos.rutas")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/api', usuario_rutas, ligas_rutas, equipos_rutas);

module.exports = app;