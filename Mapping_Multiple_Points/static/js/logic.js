// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([35, -100], 5);

//tile layer
let streets= L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: api_key
});
streets.addTo(map);

// Loop through the cities array and create one marker for each city.
//Get data from cities.js
let cityData = cities; 

cityData.forEach(function(city) {
    console.log(city)
    L.circleMarker(city.location, {
      radius: city.population/100000,
      fillColor: 'orange',
      color: 'orange',
      weight: 4
    })
    .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
    .addTo(map);
});