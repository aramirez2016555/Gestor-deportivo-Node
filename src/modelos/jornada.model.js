'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var JornadaSchema = Schema({
    nombre: String,
    equipo1: { type: Schema.Types.String, ref: 'equipos' },
    equipo2: { type: Schema.Types.String, ref: 'equipos' },
    goles1: Number,
    goles2: Number,
    stock: Number
});

module.exports = mongoose.model('jornadas', JornadaSchema);