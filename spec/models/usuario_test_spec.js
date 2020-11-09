var mongoose = require('mongoose');
var Reserva = require('../../models/reservas');
var Usuario = require('../../models/usuarios');
var Bicicleta = require('../../models/bicicletas');

describe('Testing Usuario', function() {
    beforeAll((done) => {
        console.log('beforeEach');
        var mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, {
            useFindAndModify: false,
            useNewUrlParser: true,
            auto_reconnect: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            // estamos conectados!
            console.log('DB ONLINE - testing usuarios');
            done();
        });

    }); //beforeAll

    afterEach((done) => {
        Reserva.deleteMany({}, (err, success) => {
            if (err) console.log(err);
            Usuario.deleteMany({}, (err, success) => {
                if (err) console.log(err);
                Bicicleta.deleteMany({}, (err, success) => {
                    if (err) console.log(err);
                    done();
                });
            });
        });
    }); //afterEach
    /*
        afterAll((done) => {
            mongoose.connection.close(function() {
                console.log('Mongoose disconnected on app termination');
                //process.exit(0);
                done();
            });
        });*/

    describe('Cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({ nombre: 'Nombre de test', email: 'prueba@hola.com', password: '1234' });
            usuario.save();
            const bicicleta = new Bicicleta({ code: 1, color: 'rojo', model: 'urbana' });
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate() + 1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas) {
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        }); //it
    }); //






}); //parent