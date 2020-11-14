var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuarios');

router.get('/', loggedIn, usuarioController.list);
router.get('/create', usuarioController.create_get);
router.post('/create', usuarioController.create);
router.get('/:id/update', loggedIn, usuarioController.update_get);
router.post('/:id/update', loggedIn, usuarioController.update);
router.post('/:id/delete', loggedIn, usuarioController.delete);

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        console.log('user sin loguarse');
        res.render('session/login', { errors: {} });
    }
};

module.exports = router;