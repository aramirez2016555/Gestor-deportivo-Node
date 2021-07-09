'use strict'
var equipo = require("../modelos/equipo.model");
var jornada = require("../modelos/jornada.model");
var liga = require("../modelos/liga.model");
var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function admin(req, res) {
    var usuarioModel = Usuario();   
    usuarioModel.username = "Administrador"
    usuarioModel.email= "admin@admin.com"
    usuarioModel.rol="ROL_ADMIN"
    Usuario.find({ 
        username: "Administrador"
    }).exec((err, adminoEncontrado )=>{
        if(err) return console.log({mensaje: "Error al crear Administrador"});
        if(adminoEncontrado.length >= 1){
        return console.log("El Administrador está preparado");
        }else{bcrypt.hash("123456", null, null, (err, passwordEncriptada)=>{
            usuarioModel.password = passwordEncriptada;
            usuarioModel.save((err, usuarioguardado)=>{
                if(err) return console.log({mensaje : "Error en la peticion"});
                if(usuarioguardado){console.log("Administrador preparado");
                }else{
                console.log({mensaje:"El administrador no esta listo"});
                }      
            })     
        })
        }
    })
}
function agregarUsuario(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;
  
    if (params.email && params.password && params.username) {
        usuarioModel.email = params.email;
        usuarioModel.username = params.username;
        usuarioModel.password = params.password;
        
            usuarioModel.rol = "ROL_USUARIO"

        
        
        Usuario.find({ username: usuarioModel.username }).exec((err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuarios' });
            if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: 'El username ya esta ocupado' });
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {

                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Guardar Usuario' });

                        if (usuarioGuardado) {
                            res.status(200).send({ usuarioGuardado })
                        } else {
                            res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario' })
                        }
                    })
                })
            }
        })

    }else{ return res.status(500).send({mensaje:"Error en los parametros"})}
}
function login(req, res) {
    var params = req.body; 
    Usuario.findOne({email: params.email}, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición"});
        if(usuarioEncontrado){
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{
                if(err) return res.status(500).send({mensaje: "Error en la petición"});
                if(passVerificada){
                     if(params.getToken == "true"){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                     }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado});
                     }
                }else{
                    return res.status(500).send({mensaje:"El Usuario no se a podido identificar"});
                }
            })


        }else{
            return res.status(500).send({mensaje:"Error al buscar el Usuario"})
        }
    })
}
function eliminarUsuario(req, res){
    var idUsuario= req.params.idUsuario


    Usuario.findByIdAndDelete(idUsuario,(err, usuarioEliminado)=>{
    if(err) return res.status(500).send({mensaje:"Error en la peticion"});
    if(!usuarioEliminado) return res.status(500).send({mensaje:"No se ha podido Eliminar el usuario"});
    return res.status(200).send({mensaje: "Se ha eliminado el Usuario"});
    })

    
}
function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario
    var params = req.body;

        Usuario.find(
            { username: params.username }
        ).exec((err, Encontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
            if (Encontrada && Encontrada.length >= 1) {
                return res.status(500).send({ mensaje: 'El username ya existe' });
            }
            Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });
            return res.status(200).send({ usuarioActualizado })
            })
        })   

    }

function obtenerUsuarios(req, res) {
    var rolUsuario = req.user.rol;
    var usuarioId = req.params.idUsuario

 

    if (rolUsuario != "ROL_ADMIN") {
        Usuario.findById(usuarioId, (error, encontrado)=>{
            if(error) return res.status(400).send({mensaje:"error"})
            if(!encontrado) return res.status(400).send({mensaje: "Inténtelo de nuevo"})
            if(encontrado) res.status(200).send({encontrado})
        })

    }else{
        Usuario.find().exec((err, usuariosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de obtener Usuarios' });
        if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'Error en la consulta de Usuarios o no tiene datos' });
        return res.status(200).send({ usuariosEncontrados });
    })
    }
}
function obtenerUsuario(req, res) {
    var usuarioId = req.params.idUsuario


        Usuario.findById(usuarioId, (err, usuariosss) => {
            if(err) return res.status(500).send({mensaje: "Error en la petición"});
                if (!usuariosss) return res.status(500).send({mensaje: "No Existe un Usuario con ese id"});
                if (usuariosss) return res.status(200).send({ usuariosss});
            
        })


}



module.exports = {
    admin,
    agregarUsuario,
    login,
    eliminarUsuario,
    editarUsuario,
    obtenerUsuarios,
    obtenerUsuario
}