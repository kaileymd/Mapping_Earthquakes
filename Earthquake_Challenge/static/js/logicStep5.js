// Add console.log to check to see if our code is working.
console.log("working");

//tile layer
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: api_key
});

let satelliteStreets= L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: api_key
});

// Create a base layer that holds both maps.
let baseMaps = {
  "Streets": streets,
  "Satellite Streets": satelliteStreets
};

//Layer control group set-up
let earthquakes = new L.layerGroup();

let overlays = {
  Earthquakes: earthquakes
};

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [streets]
});

//Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the airport GeoJSON URL
// Accessing the Toronto neighborhoods GeoJSON URL.
let earthquakeJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//map styling
let myStyle = {
  color: '#ffffa1',
  weight: 2,
}

//styling given a feature
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5,
  };
}

//get color based on magnitude of earthquake
function getColor(magnitude) {
  if (magnitude >5) {
    return "#ea2c2c";
  }
  if (magnitude >4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude >2) {
    return "#eecc00";
  }
  if (magnitude >1) {
    return "#d4ee00";
  }
  else return "#98ee00";
};

//get radius of earthquake
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}


// Grabbing our GeoJSON data.
d3.json(earthquakeJSON).then(function(data) {
  //add earthquake data to map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location " + feature.properties.place);
    }
  }).addTo(earthquakes);
  earthquakes.addTo(map);

  //Create a legend object
  let legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
        ];
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i +1] ? "&ndash;" + magnitudes[i +1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(map);
});