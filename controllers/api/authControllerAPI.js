const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var Usuario = require('../../models/usuarios');

module.exports = {
    authenticate: (req, res, next) => {
        console.log('post.authenticate');
        Usuario.findOne({ email: req.body.email }, (err, usuario) => {
            if (err) next(err);
            if (usuario === null) { return res.status(401).json({ status: "error", message: "No se encontro el usuario", data: null }) };
            if (usuario != null && bcrypt.compareSync(req.body.password, usuario.password)) {
                const token = jwt.sign({ id: usuario._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                res.status(200).json({ message: "usuario validado", data: { usuario: usuario, token: token } });
            } else {
                res.status(401).json({ status: "error", message: "No se pudo verificar el usuario", data: null });
            }
        });
    },
    resetPassword: (req, res, next) => {
        Usuario.findOne({ email: req.body.email }, (err, usuario) => {
            if (!usuario) return res.status(401).json({ status: "error", message: "No se encontro el usuario", data: null });
            usuario.verificado = false;
            usuario.enviar_mail_resetPassword();
            usuario.save(function(err) {
                if (err) { return next(err) }; //res.status(400).send({ type: 'not-verified', message: 'Error inesperado' });
                res.status(400).send({ message: "Se envio un mail para reestablecer el password" });
            });
        })
    },
    authFacebookToken: (req, res, next) => {
        if (req.user) {
            req.user.save().then(() => {
                const token = jwt.sign({ id: req.user.id }, req.app.get('secretKey'), { expiresIn: '7d' });
                res.status(200).json({ message: "Usuario encontrado o creado", data: { user: req.user, token } });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ message: err.message });
            });
        } else {
            res.status(400);
        }
    }
}