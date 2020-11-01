var Bicicleta = require('../../models/bicicletas');
var request = require('request');
var server = require('../../bin/www');

describe('Testing api bicicletas', () => {
    /*
    beforeEach(() => {
        console.log('testeando…')
    });*/

    describe('GET Bicicletas', () => {
        it('bicletas/', (done) => {
            request.get('http://localhost:3000/api/bicicletas', function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    }); //GET

    describe('POST Bicicletas /create', () => {
        it('bicicletas/create', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code": 5, "color": "verde", "modelo": "urbana","lat": -34.6064996, "lng":-58.4356329}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                Bicicleta.findOne({ code: 5 }).exec(function(err, bici) {
                    //console.log(bici);
                    expect(bici.color).toBe("verde");
                });
                Bicicleta.deleteOne({ code: 5 }).exec(function(err, bici) {});
                done();
            });
        });
    }); //POST

    describe('DELETE Bicicletas', () => {
        it('/delete', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code": 10, "color": "verde", "modelo": "urbana","lat": -34.6064996, "lng":-58.4356329}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                Bicicleta.findOne({ code: 10 }).exec(function(err, bici) {
                    expect(bici.code).toBe(10);
                    //console.log(bici.id);
                    request.delete({
                        headers: headers,
                        url: 'http://localhost:3000/api/bicicletas/delete',
                        body: `{"id": "${bici.id}"}`
                    }, function(err, resp, body) {
                        Bicicleta.findOne({ code: 10 }).populate().exec(function(err, bici) {
                            expect(bici).toBeNull();
                            done();
                        });
                    });
                });

            });
        });
    }); //delete

    describe('Update Bicicletas', () => {
        it('/update', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code": 10, "color": "verde", "modelo": "urbana","lat": -34.6064996, "lng":-58.4356329}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                Bicicleta.findOne({ code: 10 }).exec(function(err, bici) {
                    expect(bici.code).toBe(10);
                    //console.log(bici.id);
                    var aBici = `{"id": "${bici.id}","color": "rojo", "modelo": "usado"}`;
                    request.post({
                        headers: headers,
                        url: 'http://localhost:3000/api/bicicletas/update',
                        body: aBici
                    }, function(err, resp, body) {
                        Bicicleta.findOne({ code: 10 }).populate().exec(function(err, bici) {
                            //console.log(bici);
                            expect(bici.modelo).toBe("usado");
                            request.delete({
                                headers: headers,
                                url: 'http://localhost:3000/api/bicicletas/delete',
                                body: `{"id": "${bici.id}"}`
                            }, function(err, resp, body) {
                                Bicicleta.findOne({ code: 10 }).populate().exec(function(err, bici) {
                                    expect(bici).toBeNull();
                                    done();
                                });
                            });
                            done();
                        });
                    });
                });

            });
        });
    }); //update

});