'use strict'
var Equipo = require("../modelos/equipo.model");
var Liga = require("../modelos/liga.model");
var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function agregarEquipo(req,res){
    var equipo = new Equipo();
    var params = req.body;
    var ligaModel = new Liga()
    var liga = params.id

   
    Liga.find({liga: Liga._id}).exec((err, ligaEncontrada) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!ligaEncontrada) return res.status(500).send({mensaje: "No se han encontrado ligas"})
        }
    if(Number(ligaEncontrada.cantidadEquipo)>=10){ 
        return res.status(500).send({mensaje: "se ha alcanzado el limite de equipos para esta liga"})
    }
    else{
        if(params.nombre){
            equipo.nombre = params.nombre;
            equipo.imagen = null;
            equipo.liga = liga;
            equipo.creador = req.user.sub;
            equipo.puntos = 0;
            equipo.golesFavor = 0;
            equipo.golesContra = 0;
            equipo.diferenciaGoles= 0;
            equipo.partidosJugados=0;
           

            Equipo.find({ nombre: params.nombre , liga: liga}).exec((err, equipoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Equipo' });
                if (equipoEncontrado && equipoEncontrado.length >= 1) {
                    return res.status(500).send({ mensaje: 'Este equipo ya existe' });
                }
            
                equipo.save((err, equipoGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar el equipo'});
            
                    if (equipoGuardado){
        
                       Liga.findByIdAndUpdate(liga, { $inc: { cantidadEquipo: 1 }}, {new: true}, (err, ligaActualizada)=>{
                        
                       })
        
                       return res.status(200).send(equipoGuardado);
                       
                    }else{
                       return res.status(500).send({ mensaje: 'No se ha podido guardar el equipo'});
                    }
                })
            })
        }else{
            return res.status(500).send({ mensaje: 'no ha llenado los parametros correspondientes'});
        }

            
       
        }

    })
}


function editarEquipo(req, res){
    var id = req.params.id;
    var params = req.body;
    var username = req.user.sub;

    Equipo.findById(id).exec((err, Equipos) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!Equipos) return res.status(500).send({mensaje: "no se han encontrado equipos"})
        }

        var creador = Equipos.creador;

        if(username == creador){
            
            Equipo.find({ nombre: params.nombre }).exec((err, equipoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Equipo' });
                if (equipoEncontrado && equipoEncontrado.length >= 1) {
                    return res.status(500).send({ mensaje: 'Este equipo ya existe' });
                }
            
            Equipo.findByIdAndUpdate(id, params, { new: true }, (err, equipoActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!equipoActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el equipo' });

                return res.status(200).send({ equipoActualizado })
            })
        })
        }else{
            return res.status(500).send({ mensaje:"no posee los derechos para editar este equipo"})
        }

})
}

function eliminarEquipo(req, res){
    var id = req.params.id;
    var username = req.user.sub;

    Equipo.findById(id).exec((err, Equipos) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!Equipos) return res.status(500).send({mensaje: "no se han encontrado equipos"})
        }

        var liga = Equipos.liga;
        var usuario = Equipos.creador;

        if(username == usuario){
            Equipo.findByIdAndDelete(id, (err, equipoEliminado) =>{
                if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                if(!equipoEliminado) return res.status(500).send({mensaje:"No se ha eliminado la liga"});
                
                Liga.findByIdAndUpdate(liga, { $inc: { cantidadEquipo: -1 }}, {new: true}, (err, ligaActualizada)=>{
                })
                return res.status(200).send({mensaje: "equipo Eliminado", equipoEliminado});
            })
        }     
       else{
           return res.status(200).send({mensaje: "no tiene los derechos para eliminar este equipo"});
       }
 
})

  
  
}

function obtenerEquipos(req, res){
    Equipo.find().exec((err, equipos)=>{
        if(err) return res.status(500).send({ mensaje:"Error al realizar la solicitud de obtener equipos" });
        if(!equipos) return res.status(500).send({ mensaje:"No se encontraron equipos" });

        return res.status(200).send({ equipos });
    })
}

function verEquipo(req, res){
    var idEquipo = req.params.id;
    var username = req.user.sub;
    Equipo.findById(idEquipo).exec((err, Equipos) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!Equipos) return res.status(500).send({mensaje: "no se han encontrado equipos"})
        }
        var creador = Equipos.creador;
        if(username == creador){
        
        Equipo.findById(idEquipo).exec((err, Equiposs) => {
            if(err){res.status(500).send("Error en la peticion");
            }else{
                if (!Equiposs) return res.status(500).send({mensaje: "No Existe un Equipo con ese nombre"})
            }
            return res.status(200).send({Equiposs})
    }) 
 

}else{
    return res.status(500).send("no posee lso derechos para ver este equipo");
}

})
}

module.exports = {
    agregarEquipo,
    editarEquipo,
    eliminarEquipo,
    obtenerEquipos,
    verEquipo
}