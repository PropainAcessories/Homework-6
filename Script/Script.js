var APIkey = "600c61e27cf44906cdc33478a6409187";
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
//city + "&units=imperial" + "&appid=" + APIKey;
var lastSearched = "";
var currentLoc = "";
var today = moment().format('L');


var errorHandler = function (response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

function currentWeather (city) {

   var queryURL =  "https://api.openweathermap.org/data/2.5/weather?q=" +
   city + "&units=imperial" + "&appid=" + APIkey;
    
    fetch(queryURL)
    .then(errorHandler)
    .then(function(response){
       return response.json();
    })
    .then(function(response){
        //rememberCity(city);

        var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        var utcTime = response.dt;
        var Timezone = response.timezone;
        var timeZoneoffset = Timezone / 60 /60;
        var rightnow = moment.unix(utcTime).utc().utcOffset(timeZoneoffset);
        
        //showCities();

        //forecast(event);



        // It took me forever to figure out to use ` these. 
        //Thanks stack overflow guy from 2014.
        var Weatherhtml = `
            <h1>${response.name} ${rightnow.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h1>
            <ul class = "list-unstyled">
                <li>Temperature: ${response.main.temp}F°</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.main.humidity}MPH</li>
                <li id ="uvIndex">UV Index:</li>
            </ul>`;
        $('#Weather').html(Weatherhtml);

        var lat = response.coord.lat;
        var long = response.coord.lon;
        var sunUrl = "api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&APPID=" + APIkey;
        
        // cross origin resource sharing error solution, thanks google.
        sunUrl = "htttps://cors-anywhere.herokuapp.com/" + sunUrl;

        fetch(sunUrl)
        .then(errorHandler)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id = "uval"> ${uvIndex}</span>`);
            if (uvIndex >= 0 || uvIndex < 3) {
                $('#uval').attr("class", "uv-good");
            } else if (uvIndex >= 3 && uvIndex < 8) {
                $('#uval').attr("class", "uv-ugly");
            } else if (uvIndex >= 8) {
                $('#uval').attr("class", "uv-bad");
            }
        });
    })
}

// function forecast ()

// function rememberCity ()

// function showCities ()


$('#searchBtn').on('click', function(event) {
    event.preventDefault();
    currentLoc = $('#userSearch').val();
    currentWeather(event);

});

$(document).on('click', '#cities', function() {
    var cityList = $(this).text();
    currentWeather(cityList);
});

$(document).ready(function() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));

    if (searchHistory !== null) {
        var searchIndex = searchHistory.length - 1;
        var lastCity = searchHistory[searchIndex];
        currentWeather(lastCity);
    }
});