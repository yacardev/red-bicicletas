var Bicicleta = require('../../models/bicicletas');

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