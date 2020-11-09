var Bicicleta = require('../models/bicicletas');

exports.bicicleta_list = function(req, res) {
    console.log('controller.bici.allBicis()');
    //res.render('bicicletas/index', { bicis: Bicicleta.allBicis() });
    Bicicleta.find({}, (err, bicis) => {
        res.render('bicicletas/index', { bicis });
    });
}

exports.bicicleta_create_get = function(req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function(req, res) {
    Bicicleta.create({ color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] }, function(err, nuevaBici) {
        if (err) {
            res.render('bicicletas/create', { errors: err.errors, bicis: new Bicicleta({ color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] }) });
        } else {
            res.redirect('/bicicletas');
        }

    });
}

exports.bicicleta_update_get = function(req, res) {
    Bicicleta.findById(req.params.id, function(err, bici) {
        res.render('bicicletas/update', { errors: {}, bici });
    });
}

exports.bicicleta_update_post = function(req, res) {
    var update_values = { color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] };
    Bicicleta.findByIdAndUpdate(req.params.id, update_values, function(err, bici) {
        if (err) {
            console.log(err);
            res.render('bici/update', { errors: err.errors, bici: new Bicicleta({ color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] }) })
        } else {
            res.redirect('/bicicletas');
            return;
        }
    });


}

exports.bicicleta_delete_post = function(req, res) {
    Bicicleta.findByIdAndDelete(req.body.id, function(err) {
        if (err)
            next(err);
        else
            res.redirect('/bicicletas');
    });
}