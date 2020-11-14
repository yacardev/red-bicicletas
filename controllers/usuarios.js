var Usuario = require('../models/usuarios');

module.exports = {
    list: function(req, res, next) {
        Usuario.find({}, (err, usuarios) => {
            res.render('usuarios/index', { usuarios });
        });
    },
    update_get: function(req, res, next) {
        Usuario.findById(req.params.id, function(err, usuario) {
            res.render('usuarios/update', { errors: {}, usuario });
        });
    },
    update: function(req, res, next) {
        var update_values = { nombre: req.body.nombre };
        Usuario.findByIdAndUpdate(req.params.id, update_values, function(err, usuario) {
            if (err) {
                console.log(err);
                res.render('usuario/update', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) })
            } else {
                res.redirect('/usuarios');
                return;
            }
        });
    },
    create_get: function(req, res, next) {
        console.log('create user_get(1)');
        res.render('usuarios/create', { errors: {}, usuario: new Usuario() });
    },
    create: function(req, res, next) {
        if (req.body.password != req.body.confirm_password) {
            res.render('usuarios/create', { errors: { confirm_password: { message: 'No coincide la contraseña ingresada' } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
            return;
        }
        console.log('create user(2)');
        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password }, function(err, nuevoUsuario) {
            if (err) {
                res.render('usuarios/create', { message: false, errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
            } else {
                nuevoUsuario.enviar_mail_bienvenida();
                res.render('usuarios/create', { message: "Se envio un mail de validacion. Verificar. ", errors: {}, usuario: {} });
            }

        });
    },
    delete: function(req, res, next) {
        Usuario.findByIdAndDelete(req.body.id, function(err) {
            if (err)
                next(err);
            else
                res.redirect('/usuarios');
        });
    },
    resetPassword: function(req, res, next) {
        Usuario.findOne({ email: req.body.email }, function(err, usuario) {
            if (err)
                next(err)
            else
                usuario.enviar_mail_resetPassword();
        });
    },
}