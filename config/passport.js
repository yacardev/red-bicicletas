const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');

const msgError = 'Error. Verificar Credenciales';
passport.use(new LocalStrategy({
        usernameField: 'email', // define the parameter in req.body that passport can use as username and password
        passwordField: 'password'
    },
    function(email, password, done) {
        Usuario.findOne({ email: email }, (err, usuario) => {
            //console.log('findOne');
            if (err) { console.log('error:', err); return done(err) };
            if (!usuario) {
                //console.log('error usuario');
                return done(null, false, { mensaje: msgError })
            };
            if (!usuario.validPassword(password)) {
                //console.log('error password');
                return done(null, false, { mensaje: msgError })
            };
            if (!usuario.verificado) return done(null, false, { mensaje: 'Usuario no verificado' });
            //console.log('done(null, usuario)');
            return done(null, usuario);

        });
    }
));

passport.serializeUser(function(usuario, cb) {
    cb(null, usuario.id);
});

passport.deserializeUser(function(id, cb) {
    Usuario.findById(id, (err, usuario) => {
        cb(err, usuario);
    })
});

module.exports = passport;