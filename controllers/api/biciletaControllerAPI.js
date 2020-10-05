var Bicicleta = require('../../models/bicicletas');

exports.bicicleta_list = function(req, res) {
    res.status(200).json({
        bicicletas: Bicicleta.all
    })
}

exports.bicicleta_create = function(req, res) {
    var body = req.body;
    var bici = new Bicicleta(body.id, body.color, body.modelo);
    bici.ubicacion = body.ubicacion;

    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    })
}

exports.bicicleta_delete = function(req, res) {
    Bicicleta.removeById(req.body.id);
    res.status(204).send();
}

exports.bicicleta_update = function(req, res) {
    var body = req.body;
    var bici = Bicicleta.findById(body.id);
    if (bici) {
        bici.id = body.id;
        bici.color = body.color;
        bici.modelo = body.modelo;
        bici.ubicacion = body.ubicacion;
        res.status(200).json({
            bicicleta: bici
        });
    } else {
        res.status(500).json({
            error: `No existe la Bicicleta.`
        })
    }
}