var Bicicleta = require('../../models/bicicletas');

exports.bicicleta_list = function(req, res) {
    res.status(200).json({
        bicicletas: Bicicleta.all
    })
}

exports.bicicleta_create = function(req, res) {
    var body = req.body;
    //console.log('body: ', body);
    try {
        var bici = new Bicicleta({ code: body.code, color: body.color, modelo: body.modelo, ubicacion: body.ubicacion }); //, , 
    } catch {
        //console.log('error');
        return res.status(500).json({
            error: 'Error creando bicicleta'
        });
    }
    if (bici) {
        //console.log('bici', bici);
        Bicicleta.add(bici);

        res.status(200).json({
            bicicleta: bici
        })
    } else {
        console.log('error');
    }
    //bici.ubicacion = body.ubicacion;
}

exports.bicicleta_delete = function(req, res) {
    //console.log('req.body.id: ', req.body.id);
    //Bicicleta.removeById(req.body.id);

    Bicicleta.findByIdAndDelete(req.body.id, function(err) {
        if (err)
            return res.status(500).json({
                error: 'Error borrando bicicleta'
            });
        else
            res.status(200).send();
    });
}

exports.bicicleta_update = function(req, res) {
        //console.log('req.body ', req.body);
        var update_values = { color: req.body.color, modelo: req.body.modelo };
        Bicicleta.findByIdAndUpdate(req.body.id, update_values, (err, bici) => {
            if (err)
                return res.status(500).json({
                    error: 'Error actualizando bicicleta'
                });
            else
                res.status(200).send();
        })
    }
    /*
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
    */