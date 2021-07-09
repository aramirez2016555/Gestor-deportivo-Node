'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EquipoSchema = Schema({
    nombre: String,
    imagen: String,
    nombreLiga: { type: Schema.Types.String, ref: 'ligas' },
    creador: { type: Schema.Types.String, ref: 'usuarios' },
    puntos: Number,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number,
    partidosJugados: Number,
});

module.exports = mongoose.model('equipos', EquipoSchema);