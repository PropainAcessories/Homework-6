var APIkey = '600c61e27cf44906cdc33478a6409187';
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
 city + "&appid=" + APIKey;
var rightHere = "";
var lastSearched = "";

function errorHandler() {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function getWeather (event) {
    var city = $('#userSearch').val();
    rightHere = $('#userSearch').val();

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    fetch(queryURL)
    .then(errorHandler)
    .then((response) => {
        return response.json();
    })
    .then((response => {
        return response.json();
    }))
}