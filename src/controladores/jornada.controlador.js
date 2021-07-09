'use strict'
var Equipo = require("../modelos/equipo.model");
var Liga = require("../modelos/liga.model");
var Jornada = require("../modelos/jornada.model");
var Partido = require("../modelos/partidos.model");
var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function agregarJornada(req, res){
    var jornada = new Jornada();
    var params = req.body;
    var idliga = params.liga;
    if(params.nombre && params.liga){
        jornada.liga = params.liga;
        jornada.nombre = params.nombre;
        jornada.stock = 0;

        Jornada.find({ liga: params.liga }).exec((err, CantidadJornadas) => {
            Liga.findById(idliga).exec((err, cantidadEquipoLiga) => {
                var cantidadJornada = Number(CantidadJornadas.length);
                var cantidadEquiposLiga = Number(cantidadEquipoLiga.cantidadEquipo);
                if (cantidadJornada < Number(cantidadEquiposLiga-1)){
                    Jornada.find(
                        {nombre: jornada.nombre,
                            liga: jornada.liga}
                        ).exec((err, jornadaencontradaaa )=>{
                        if(err) return console.log({mensaje: "Error al crear Administrador"});
                        if(jornadaencontradaaa.length >= 1){
                        return res.status(500).send({mensaje: 'El nombre de la jornada ya existe'});
                        }else{
                            jornada.save((err, jornadaGuardada)=>{
                                if(err) return res.status(500).send({mensaje: 'Error al guardar la jornada'});
                                if (jornadaGuardada){
                                    return res.status(200).send(jornadaGuardada);
                            }else{
                                return res.status(500).send({ mensaje: 'No se ha podido guardar la jornada'});
                            }
                        })
                        }
                    }) 
                }else{
                    return res.status(500).send({mensaje: 'Ya no se admiten mas jornadas en esta liga'});
                }
            })
            
        })       
    }else{
        return res.status(500).send({mensaje:"no se enviaron todos los parametros"})
    }
}

module.exports = {
    agregarJornada
}