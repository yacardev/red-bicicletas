require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
var Usuario = require('./models/usuarios');
var Token = require('./models/token');
var jwt = require('jsonwebtoken');

const session = require('express-session')

const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var bicicletasRouter = require('./routes/bicicletas');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');

//API
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var authAPIRouter = require('./routes/api/auth');

const { appendFileSync } = require('fs');
const { token } = require('morgan');

const store = new session.MemoryStore;

var app = express();
app.use(session({
    cookie: { maxAge: 240 * 60 * 60 * 1000 },
    store: store,
    saveUninitialized: true,
    resave: 'true',
    secret: 'red_bicis_123!!!AAABBBCCC!!&&&'
}))

app.set('secretKey', 'jwt____secret!#!"$#!$FDSFA'); // jwt secret token

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/usuarios', usuariosRouter);

app.use('/token', tokenRouter);



//APIs:
app.use('/api/bicicletas', validateUser, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/api/auth', authAPIRouter);


app.get('/login', (req, res) => {
    res.render('session/login', { errors: {} });
});

app.get('/privacy_policy', (req, res) => {
    res.sendFile('/public/privacy_policy.html');
});

app.get('/googled0bb4996d38c28f1', (req, res) => {
    res.sendFile('/public/googled0bb4996d38c28f1.html');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, usuario, info) => {
        //console.log('info: ', info)
        if (err) { console.log(err); return next(err) };
        if (!usuario) { console.log('no encontro usuario'); return res.render('session/login', { errors: info }) };
        req.login(usuario, (err) => {
            //console.log(err)
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/forgotPassword', (req, res) => {
    res.render('usuarios/forgotPassword', { message: { desc: '*Se enviara un link de validacion a la direccion de correo' } });
});

app.post('/forgotPassword', (req, res, next) => {
    Usuario.findOne({ email: req.body.email }, function(err, usuario) {
        if (!usuario) return res.render('usuarios/forgotPassword', { message: { error: '*El email ingresado no está asociado a una cuenta' } });
        usuario.verificado = false;
        usuario.enviar_mail_resetPassword();
        usuario.save(function(err) {
            if (err) return res.status(400).send({ type: 'not-verified', msg: 'Error inesperado' });
        });

        res.render('usuarios/forgotPassword', { message: { mail_ok: true, desc: '*Se envio el email. Verificar su casilla de correo' } });

    });


});

app.get('/token/resetPassword/:token', (req, res, next) => {
    Token.findOne({ token: req.params.token }, function(err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'Link de verificacion invalido. Reintentar' });
        Usuario.findById(token._userId, function(err, usuario) {
            if (!usuario) return res.status(400).send({ type: 'not-verified', msg: 'No se encontro el usuario asociado' });

            res.render('usuarios/resetPassword', { message: { errors: {}, usuario } });
        })

    });
});

app.post('/resetPassword', (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        res.render('usuarios/resetPassword', { message: { error: 'No coinciden los valores ingresados', usuario: { email: req.body.email } } })
        return;
    }

    Usuario.findOne({ email: req.body.email }, function(err, usuario) {
        usuario.password = req.body.password;
        usuario.verificado = true;
        usuario.save(function(err) {
            if (err) return res.status(400).send({ type: 'not-verified', msg: 'Error inesperado' });
            res.render('session/login', { errors: {} });
        });
    })
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//DB

var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // estamos conectados!
    console.log('DB ONLINE');
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        console.log('user sin loguarse');
        res.render('session/login', { errors: {} });
    }
};



function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decode) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            //console.log('jwt verified', decode)
            req.body.userId = decode.id;
            next();
        }
    });
};


module.exports = app;