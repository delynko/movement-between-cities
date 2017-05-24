var cartoDark = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    opacity: .8
});

var map = L.map("map", {
    maxZoom: 18,
    layers: [cartoDark]
}).setView([39.50, -96.21], 4);

$("#submitButton").on("click", function(e){
    var n = getInputCount();
    var number = n.length;
    var markers = getMarkers(number);
//    markers.addTo(map);

    for (var t = 0; t < (number - 1); t++){
        getAnimationData(t);
    };
});

var x = 0;

$("#addCityButton"). on("click", function(){
    var newForm = '<input type="text" class="newInput" id="inputLived' + (x + 1) + '" placeholder="City, ST ' + (x + 1) +'"><br>'
    $(newForm).appendTo("#form");
    x++;
});

function getInputCount(){
    var count = document.querySelectorAll(".newInput");
    return count;
}

function getMarkers(number){
    var markers = L.featureGroup();
    for (var t = 0; t < (number); t++){
        var city = document.querySelector("#inputLived" + (t)).value;
        var formatted = city.split(" ").join("+");
        var googleSearch = "http://maps.googleapis.com/maps/api/geocode/json?address=" + formatted + ",&sensor=false"
        $.getJSON(googleSearch, function(data) {
            var coords = [];
            coords.push(data.results[0].geometry.location.lat);
            coords.push(data.results[0].geometry.location.lng);
            markers.addLayer(L.marker(coords).bindPopup(data.results[0].formatted_address));
        });
    };
    
    return markers;
}

function getAnimationData(t){
    var city1 = document.querySelector("#inputLived" + (t)).value;
    var formatted1 = city1.split(" ").join("+");
    var googleSearch1 = "http://maps.googleapis.com/maps/api/geocode/json?address=" + formatted1 + ",&sensor=false";
    var fromData;
    
    $.getJSON(googleSearch1, function(data) {
        var fromCoords = [];
        fromCoords.push(data.results[0].geometry.location.lng);
        fromCoords.push(data.results[0].geometry.location.lat);
        fromData = data;
    });
    
    var city2 = document.querySelector("#inputLived" + (t + 1)).value;
    var formatted2 = city2.split(" ").join("+");
    var googleSearch2 = "http://maps.googleapis.com/maps/api/geocode/json?address=" + formatted2 + ",&sensor=false";
    var toData;
    
    $.getJSON(googleSearch2, function(data) {
        var toCoords = [];
        toCoords.push(data.results[0].geometry.location.lng);
        toCoords.push(data.results[0].geometry.location.lat);
        toData = data;
    });
    
    setTimeout(function(){
        var fromCoordinates = [];
        var toCoordinates = [];
        fromCoordinates.push(fromData.results[0].geometry.location.lng);
        fromCoordinates.push(fromData.results[0].geometry.location.lat);
        toCoordinates.push(toData.results[0].geometry.location.lng);
        toCoordinates.push(toData.results[0].geometry.location.lat);
        
        animate(toCoordinates, fromCoordinates);
    }, 3000);
}
    
function animate(toCoords, fromCoords){
    var relocLayer = new L.migrationLayer({
        map: map,
        data: [{color: "#00ff00", to: toCoords, from: fromCoords}],
        pulseRadius:0,
        pulseBorderWidth:3,
        arcWidth:1,
        arcLabel:true,
        arcLabelFont:'10px sans-serif',
    });
    
    relocLayer.addTo(map);
    relocLayer.show();
}