var APIkey = "600c61e27cf44906cdc33478a6409187";
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
//city + "&units=imperial" + "&appid=" + APIKey;
var lastSearched = [];
var currentLoc = "";
var today = moment().format('L');

function currentWeather (city) {

   var queryURL =  "https://api.openweathermap.org/data/2.5/weather?q=" +
   city + "&units=imperial" + "&appid=" + APIkey;
    
    fetch(queryURL)
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
        var sunUrl = "api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&APPID=" + APIkey;
        
        // cross origin resource sharing error solution, thanks google.
        sunUrl = "https://cors-anywhere.herokuapp.com/" + sunUrl;

        fetch(sunUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id = "#uvIndex"> ${uvIndex}</span>`);
            if (uvIndex >= 0 || uvIndex < 3) {
                $('#uvIndex').attr("class", "uv-good");
            } else if (uvIndex >= 3 && uvIndex < 8) {
                $('#uIndex').attr("class", "uv-ugly");
            } else if (uvIndex >= 8) {
                $('#uvIndex').attr("class", "uv-bad");
            }
        });
    })
}


function forecast (city) {
    var city = $('#userSearch').val();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" +
    + city + "&units=imperial" + "&APPID=" + APIkey;

    fetch(queryUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
    var forecasthtml = `
    <h5 class ="display-5">Forecast:</h5>
    <div id ="fiveDayForecstUl" class = "d-flex flex-wrap p-3">`;
    for (let i=0; i < response.list.length; i++) {
        var daytime = response.list[i];
        var daytimeUtc = daytime.dt;
        var timezone = response.city.timezone;
        var daytimeOffset = timezone /60 /60;
        var rightnow = moment.unix(daytimeUtc).utc().utcOffset(daytimeOffset);
        var iconsrc = "https://openweathermap.org/img/w/" + daytime.weather[0].icon + ".png";

        if (rightnow.format("HH:mm:ss") === "11:00:00" ||
            rightnow.format("HH:mm:ss") === "12:00:00" ||
            rightnow.format("HH:mm:ss") === "13:00:00") {;
            forecasthtml +=`
                <div class = "card p-3 bg-secondary">
                    <ul class ="list-unstyled bg-secondary text-white">
                        <li>${rightnow.format("MM/DD/YY")}</li>
                        <li class = "weatherIcon"><img src="${iconsrc}"</li>
                        <li>Temp: ${daytime.main.temp}F°</li>
                        <li>Humidity: ${daytime.main.humidity}%</li>
                    </ul>
                </div>`;
        }
    }
      forecasthtml += `</div>`;
      $('#forecast').append(forecasthtml);
    })
}

$('#searchBtn').on('click', function(event) {
    event.preventDefault();
    var city = $('#userSearch').val().trim();
    currentWeather(city);
    if (!lastSearched.includes(city)) {
        var foundcity = $(`
        <li class= "list-group-item mb-2">${city}</li>
        `);
        $('#cities').append(foundcity);
    };
    localStorage.setItem("city", JSON.stringify(lastSearched));
});

$(document).on('click', '.list-group-item', function() {
    var listcity = $(this).text();
    currentWeather(listcity);
});

$(document).ready(function() {
     var searchHistory = JSON.parse(localStorage.getItem("city"));

     if (searchHistory !== null) {
         var searchIndex = searchHistory.length - 1;
         var lastCity = searchHistory[searchIndex];
         currentWeather(lastCity);
     }
});


forecast (event);
currentWeather();