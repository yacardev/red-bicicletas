var mongoose = require('mongoose');
var Reserva = require('./reservas');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var Token = require('./token');
var mailer = require('../mailer/mailer');
const uniqueValidator = require('mongoose-unique-validator');
const { callbackPromise } = require('nodemailer/lib/shared');
var Schema = mongoose.Schema;

const saltRounds = 10;


const validateEmail = function(email) {
    const re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;
};

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El mail es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Email invalido'],
        match: /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/
    },
    password: {
        type: String,
        required: [true, 'Password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario.' });


usuarioSchema.pre('save', function(next) {
    console.log('pre.save');
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    var reserva = new Reserva({ usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta });
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.methods.enviar_mail_bienvenida = function(cb) {
    console.log('usuario.enviar_mail_bienvenida');
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: `Hola, \n\n Por favor, para verificar su cuenta haga click en este link: \n ${process.env.HOST}\/token/confirmation\/${token.token}\n`
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return console.log(err.message); }

            console.log(`El mail de verificacion fue enviado a ${email_destination}`);
        });
    });
}

usuarioSchema.methods.enviar_mail_resetPassword = function(cb) {
    console.log('usuario.enviar_mail_resetPassword');
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email_destination,
            subject: 'Verificacion de Password', //process.env.HOST
            text: `Hola, \n\n Por favor, para regenerar su password haga click en este link: \n ${process.env.HOST}\/token/resetpassword\/${token.token}\n`
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return console.log(err.message); }

            console.log(`El mail de verificacion fue enviado a ${email_destination}`);
        });
    });
}

usuarioSchema.methods.resetPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log('condition', condition);
    self.findOne({
        $or: [{ 'googleId': condition.id }, { 'email': condition.emails[0].value }]
    }, (err, result) => {
        if (result) {
            callback(err, result)
        } else {
            console.log('--------- Condition ----------');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'sin nombre';
            values.verificado = true;
            values.password = crypto.randomBytes(16).toString('hex');
            console.log('--------- Values ----------');
            console.log(values);
            self.create(values, (err, result) => {
                if (err) { console.log(err) }
                return callback(err, result)
            })
        }
    })
};

module.exports = mongoose.model('Usuario', usuarioSchema);