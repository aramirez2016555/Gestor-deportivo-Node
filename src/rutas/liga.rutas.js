'use strict'
var express = require("express");
var jornadaControlador = require("../controladores/jornada.controlador")
var ligasControlador = require("../controladores/liga.controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post('/agregarLiga',md_autorizacion.ensureAuth, ligasControlador.agregarLiga);
api.put('/editarLiga/:idL', md_autorizacion.ensureAuth, ligasControlador.editarLiga);
api.delete('/eliminarLiga/:idL', md_autorizacion.ensureAuth, ligasControlador.eliminarLiga);
api.get('/obtenerLigas',ligasControlador.obtenerLigas);
api.get('/verLiga/:idL', md_autorizacion.ensureAuth, ligasControlador.verLiga);
api.get('/ligasPropias', md_autorizacion.ensureAuth, ligasControlador.ligasPropias);

// RUTAS DE JORNADA 
api.post('/agregarJornada', jornadaControlador.agregarJornada);

module.exports = api;