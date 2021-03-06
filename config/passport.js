const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookTokenStrategy = require('passport-facebook-token');

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

//Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback' //process.env.HOST ||
}, function(accessToken, refreshToken, profile, cb) {
    console.log('profile', profile);
    Usuario.findOneOrCreateByGoogle(profile, (err, user) => {
        return cb(err, user);
    })
}));

//Facebook
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}, function(accessToken, refreshToken, profile, done) {
    console.log('profile', profile);
    try {
        Usuario.findOneOrCreateByFacebook(profile, (err, user) => {
            if (err) console.log('error find/create facebook', err);
            return done(err, user);
        });
    } catch (err2) {
        console.log(err2);
        return done(err2, null);
    }
}));


passport.serializeUser(function(usuario, cb) {
    cb(null, usuario.id);
});

passport.deserializeUser(function(id, cb) {
    Usuario.findById(id, (err, usuario) => {
        cb(err, usuario);
    })
});

module.exports = passport;