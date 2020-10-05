var Bicicleta = function(id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function() {
    return 'id: ' + this.id + "| color: " + this.color;
}

Bicicleta.all = [];
Bicicleta.add = function(aBici) {
    Bicicleta.all.push(aBici);
}

Bicicleta.findById = function(aBiciId) {
    var aBici = Bicicleta.all.find(x => x.id == aBiciId);
    if (aBici)
        return aBici;
    //else
    //  throw new Error(`No existe una bicicleta con el id ${aBiciId}`)
}

Bicicleta.removeById = function(aBiciId) {
    //var aBici = Bicicleta.findById(aBiciId);
    for (var i = 0; i < Bicicleta.all.length; i++) {
        if (Bicicleta.all[i].id == aBiciId) {
            Bicicleta.all.splice(i, 1);
            break;
        }
    }
}

var a = new Bicicleta(1, 'verde', 'urbana', [-34.6064996, -58.4356329]);
var b = new Bicicleta(2, 'negro', 'urbana', [-34.6205082, -58.4413379]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta