var Bicicleta = require('../../models/bicicletas');
var mongoose = require('mongoose');


describe('Testing Bicicleta', () => {
    beforeAll((done) => {
        console.log('beforeEach');
        var mongoDB = 'mongodb://localhost:27017/red_bicicletas';
        mongoose.connect(mongoDB, {
            useFindAndModify: false,
            useNewUrlParser: true,
            auto_reconnect: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;
        console.log('(1)');
        db.on('error', console.error.bind(console, 'connection error:'));
        console.log('(2)');
        db.once('open', () => {
            // estamos conectados!
            console.log('DB ONLINE - testing');
            done();
        });
    });

    afterEach((done) => {
        Bicicleta.deleteMany({}, (err, success) => {
            if (err) console.log(err);
            console.log('deleteMany()');
            done();
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {

            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);
            //expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
            //console.log('bici.code: ', bici.code);
        });
    });

    describe('Bicicleta.all', () => {
        it('comienza vacia', (done) => {
            Bicicleta.allBicis((err, bicis) => {
                expect(bicis.length).toBe(0);
                console.log('Bicicleta.all() ');
                done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({ code: 2, color: "verde", modelo: "vintage" });
            Bicicleta.add(aBici, (err, newBici) => {
                if (err) console.log(err);
                Bicicleta.allBicis((err, bicis) => {
                    expect(bicis.length).toBe(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    console.log('Bicicleta.add() ');
                    done();
                });
            });
        });
    });

    describe('Bicicleta.find', () => {
        it('busco una bici', (done) => {
            Bicicleta.allBicis((err, bicis) => {
                expect(bicis.length).toBe(0);
                var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "vintage" });
                Bicicleta.add(aBici, (err, newBici) => {
                    if (err) console.log(err);
                    var aBici2 = new Bicicleta({ code: 1, color: "rojo", modelo: "urbana" });
                    Bicicleta.add(aBici2, (err, newBici) => {
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, (err, targetBici) => {
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
                            console.log('Bicicleta.findByOne() ');
                            done();
                        });
                    });
                });
            });
        });
    });



});







/*
beforeEach(() => { Bicicleta.all = []; });

describe('Bicicleta.all', () => {
    it('comienza vacio', () => {
        expect(Bicicleta.all.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agregar bici', () => {
        expect(Bicicleta.all.length).toBe(0);

        var aBici = new Bicicleta(1, 'verde', 'urbana', [-34.6064996, -58.4356329]);
        Bicicleta.add(aBici)

        expect(Bicicleta.all.length).toBe(1);
        expect(Bicicleta.all[0]).toBe(aBici);
    });
});

describe('Bicicleta.findById', () => {
    it('buscamos una bici', () => {
        expect(Bicicleta.all.length).toBe(0);

        var aBici1 = new Bicicleta(1, 'azul', 'urbana');
        var aBici2 = new Bicicleta(2, 'roja', 'rural');

        Bicicleta.add(aBici1);
        Bicicleta.add(aBici2);

        var targetBici = Bicicleta.findById(1);


        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici1.color);
        expect(targetBici.modelo).toBe(aBici1.modelo);

    });
});
*/