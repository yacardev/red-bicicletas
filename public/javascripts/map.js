var mymap = L.map('main_map').setView([-34.6012424, -58.3861497], 13);
var accessToken = 'pk.eyJ1IjoieWFjYXJkZXYiLCJhIjoiY2tmbHViZnR1MHljaDJ4bXFvZnJ1bDk4MSJ9.my8S27Mt19H0xfrun6v06g';

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken //'yacardev.mapbox.access.token'
}).addTo(mymap);

//L.marker([-34.6070604, -58.4456831]).addTo(mymap);

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result) {
        console.log(result);
        result.bicicletas.forEach(function(bici) {
            L.marker(bici.ubicacion, { title: bici.id }).addTo(mymap);
        })
    }
})