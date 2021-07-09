'use strict'
var Equipo = require("../modelos/equipo.model");
var Liga = require("../modelos/liga.model");
var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function agregarLiga(req,res){
    var liga = new Liga();
    var params = req.body;

if(params.nombre){
    liga.nombre = params.nombre;
    liga.username = req.user.sub;
    liga.cantidadEquipo = 0;

    Liga.find({nombre: liga.nombre}).exec((err, ligaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la solicitud de liga'});

        if(ligaEncontrada && ligaEncontrada.length >=1){
            return res.status(200).send({mensaje:'Esta Liga ya existe'});
        }else{

            liga.save((err, ligaGuardada)=>{
                if(err) return res.status(500).send({mensaje: 'Error al guardar la liga'});

                if (ligaGuardada){
                   return res.status(200).send(ligaGuardada);
                }else{
                   return res.status(500).send({ mensaje: 'No se ha podido guardar la liga'});
                }
            })
            
        }
    })
}else{
    return res.status(500).send({mensaje:"no se enviaron todos los parametros"})
}


    
}

function editarLiga(req, res){
    var username = req.user.sub;
    var ligaid = req.params.idL

    Liga.findById(ligaid).exec((err, Ligasss) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!Ligasss) return res.status(500).send({mensaje: "no se han encontrado ligas"})
        }
        var usernameLiga = Ligasss.username;

    if(username == usernameLiga){
        var params = req.body;
            Liga.find({ nombre: params.nombre }).exec((err, ligaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Liga' });
                if (ligaEncontrada && ligaEncontrada.length >= 1) {
                    return res.status(500).send({ mensaje: 'Esta liga ya existe' });
                }else{
                    Liga.findByIdAndUpdate(ligaid, params, { new: true }, (err, ligaActualizada) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!ligaActualizada) return res.status(500).send({ mensaje: 'No se a podido editar la liga' });
                
                        return res.status(200).send({ ligaActualizada })
                    })
                }
            
        })
    }else{
        return res.status(500).send({ mensaje:"no posee los derechos para editar esta liga"});
    }
   
    
})
}


function eliminarLiga(req, res){
    var username = req.user.sub;
    var ligaid = req.params.idL;

    Liga.findById(ligaid).exec((err, Ligasss) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!Ligasss) return res.status(500).send({mensaje: "no se han encontrado ligas"})
        }
        var usernameLiga = Ligasss.username;

    if(username == usernameLiga){

    Liga.findByIdAndDelete(ligaid, (err, ligaEliminada) =>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!ligaEliminada) return res.status(500).send({mensaje:"No se ha eliminado la liga"});
            
        
        Equipo.deleteMany({ liga : ligaid }, (err, equiposEliminados)=>{
        })

        return res.status(200).send({mensaje: "liga Eliminada"});
    })
    }else{
        return res.status(500).send({ mensaje:"no posse los permisos para eliminar esta liga"});
    }
  
})
}
    

function obtenerLigas(req, res){
    
    Liga.find().exec((err, ligas)=>{
        if(err) return res.status(500).send({ mensaje:"Error al realizar la solicitud de obtener ligas" });
        if(!ligas) return res.status(500).send({ mensaje:"No se encontraron ligas" });

        return res.status(200).send({ ligas });
    })
}

function verLiga(req, res) {
    let ligaid = req.params.idL;
    var username = req.user.sub;

    Liga.findById(ligaid).exec((err, Ligasss) => {
        if(err){res.status(500).send("Error en la peticion");
        }else{
            if (!Ligasss) return res.status(500).send({mensaje: "no se han encontrado ligas"})
        }
        var usernameLiga = Ligasss.username;

    if(username == usernameLiga){
        Liga.findById(ligaid).exec((err, ligas)=>{
            if(err) return res.status(500).send({ mensaje:"Error al realizar la solicitud de obtener ligas" });
            if(!ligas) return res.status(500).send({ mensaje:"No se encontraron ligas" });
    
            return res.status(200).send({ ligas });
        })
    }else{
        return res.status(500).send({ mensaje:"no posee los derechos para ver esta liga"});
    }

    
})
}

function ligasPropias(req, res) {
    var username = req.user.sub;

    Liga.find({"username": username },(err, ligasEncontradas)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de ligas'});
        if(!ligasEncontradas) return res.status(500).send({mensaje: 'Error al obtener las ligas' });

        return res.status(200).send({ ligasEncontradas });
    })

}

module.exports = {
    agregarLiga,
    editarLiga,
    eliminarLiga,
    obtenerLigas,
    verLiga,
    ligasPropias
}