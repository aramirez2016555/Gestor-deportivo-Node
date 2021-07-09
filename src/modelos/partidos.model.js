'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PartidoSchema = Schema({
    jornada: { type: Schema.Types.ObjectId, ref: 'jornadas' },
    equipo1: { type: Schema.Types.ObjectId, ref: 'equipos' },
    equipo2: { type: Schema.Types.ObjectId, ref: 'equipos' },
    goles1: Number,
    goles2: Number,
});

module.exports = mongoose.model('partidos', PartidoSchema);