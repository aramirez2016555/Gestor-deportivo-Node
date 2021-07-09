'use strict'
var express = require("express");
var equipoControlador = require("../controladores/equipos.controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post('/agregarEquipo', md_autorizacion.ensureAuth, equipoControlador.agregarEquipo);
api.put('/editarEquipo/:id',md_autorizacion.ensureAuth, equipoControlador.editarEquipo);
api.delete('/eliminarEquipo/:id',md_autorizacion.ensureAuth, equipoControlador.eliminarEquipo);
api.get('/obtenerEquipos', equipoControlador.obtenerEquipos);
api.get('/verEquipo/:id',md_autorizacion.ensureAuth, equipoControlador.verEquipo);

module.exports = api;