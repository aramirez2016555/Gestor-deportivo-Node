'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombre: String,
    username: { type: Schema.Types.String, ref: 'usuarios' },
    cantidadEquipo: Number
});

module.exports = mongoose.model('ligas', LigaSchema);