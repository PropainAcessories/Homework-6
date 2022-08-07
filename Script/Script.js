var APIkey = '600c61e27cf44906cdc33478a6409187';
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
//city + "&units=imperial" + "&appid=" + APIKey;
var lastSearched = [];
var today = moment().format('L');
let i = 0;

var handleErrors = function (response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

function currentWeather (city) {

   var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`;
    
    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse){
        console.log(cityWeatherResponse);

        var icon = cityWeatherResponse.weather[0].icon;
        var iconUrl = 'https://openweathermap.org/img/w/${iconCode}.png';
        // AHHHHHH I HATE THIS BEING ONE LINE I HATE THIS BEING ONE LINE I HATE THIS BEING ONE LINE!
        var rightHere = $('<h1 id="townDisplay">${cityWeatherResponse.name} ${today} <img src = "${iconUrl}" alt = "{cityWeatherResponse.weather[0].description}" /></h1> <p>Temp: ${cityWeatherResponse.main.temp} °F</p><p>Humidity: ${cityWeatherResponse.main.humidity}%</p><p>Wind speed: ${cityWeatherResponse.main.wind.speed}MPH</p>');

        $('#townDisplay').append(rightHere);

    });
}


$('#searchBtn').on('click', function(event) {
    event.preventDefault();
    var city = $('#userSearch').val().trim();
    currentWeather(city);
    if (!lastSearched.includes(city)) {
        lastSearched.push(city);
        var searched = $('<button></button>');
        searched.text(lastSearched);
        searched.attr('class', 'btn-danger', 'mb-2');
        $('#cities').append(searched);
    };

    localStorage.setItem("city", JSON.stringify(lastSearched));
    //console.log(lastSearched);
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