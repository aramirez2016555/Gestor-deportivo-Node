'use strict'
var express = require("express");
var usuarioControlador = require("../controladores/usuarios.controlador");
var md_autorizacion = require("../middlewares/authenticated");
var api = express.Router();

api.post("/agregarUsuario", usuarioControlador.agregarUsuario);
api.post("/login", usuarioControlador.login);
api.delete('/eliminarUsuario/:idUsuario', usuarioControlador.eliminarUsuario);
api.put('/editarUsuario/:idUsuario', usuarioControlador.editarUsuario);
api.get('/obtenerUsuarios', md_autorizacion.ensureAuth ,usuarioControlador.obtenerUsuarios);
api.get('/obtenerUsuario/:idUsuario', usuarioControlador.obtenerUsuario);
module.exports = api;