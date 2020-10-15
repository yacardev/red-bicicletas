var Bicicleta = require('../../models/bicicletas');
var request = require('request');
var server = require('../../bin/www');


beforeEach(() => {
    console.log('testeando…')
});

describe('testear la api', () => {
    describe('GET Bicicletas', () => {
        it('Status 200', () => {
            expect(Bicicleta.all.length).toBe(0);
            var aBici = new Bicicleta(1, 'verde', 'urbana', [-34.6064996, -58.4356329]);

            Bicicleta.add(aBici);

            request.get('http://localhost:3000/api/bicicletas', function(error, response, body) {
                expect(response.statusCode).toBe(200);
            });
        });
    });
});

describe('POST Bicicletas /create', () => {
    it('Status 200', (done) => {
        var headers = { 'content-type': 'application/json' };
        var aBici = '{"id": 5, "color": "verde", "modelo": "urbana","lat": -34.6064996, "lng":-58.4356329}';

        request.post({
            headers: headers,
            url: 'http://localhost:3000/api/bicicletas/create',
            body: aBici
        }, function(error, response, body) {
            expect(response.statusCode).toBe(200);
            expect(Bicicleta.findById(5).color).toBe("verde");
            done();
        });
    });
});