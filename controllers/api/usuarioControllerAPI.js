var Usuario = require('../../models/usuarios');

exports.usuarios_list = function(err, res) {
    Usuario.find({}, function(err, usuarios) {
        res.status(200).json({
            usuarios
        });
    });
};

exports.usuarios_create = function(err, res) {
    var usuario = new Usuario({ nombre: req.body.nombre });

    usuario.save(function(err) {
        res.status(200).json(usuario);
    });
};

exports.usuario_reservar = function(err, res) {
    Usuario.findById(req.body.id, function(err, usuario) {
        console.log(usuario);
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function(err) {
            console.log('reserva!');
            res.status(200).send();
        })
    })
};