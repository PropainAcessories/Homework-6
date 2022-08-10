var APIkey = "600c61e27cf44906cdc33478a6409187";
var lastSearched = [];
var currentLoc = "";
var today = moment().format('L');

function currentWeather () {

    city = $('#userSearch').val().trim();
   var queryURL =  "https://api.openweathermap.org/data/2.5/weather?q=" +
   city + "&units=imperial" + "&appid=" + APIkey;
    
    fetch(queryURL)
    .then(function(response){
       return response.json();
    })
    .then(function(response){

        var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        var utcTime = response.dt;
        var Timezone = response.timezone;
        var timeZoneoffset = Timezone / 60 /60;
        var rightnow = moment.unix(utcTime).utc().utcOffset(timeZoneoffset);
        //forecast();
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
        
        forecast(city);

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
            $('#uvIndex').html(`UV Index: <span class = "text-white" id = "#uvIndex"> ${uvIndex}</span>`);
            
            //forecast()

            if (uvIndex >= 0 || uvIndex < 3) {
                $('#uvIndex').attr("class","uv-good");
            }if (uvIndex >= 3 && uvIndex < 8) {
                $('#uIndex').attr("class", "uv-ugly");
            }if (uvIndex >= 8) {
                $('#uvIndex').attr("class", "uv-bad");
            }
        });
    })
}

function forecast () {
    var city = $('#userSearch').val().trim();



    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
    + city + "&units=imperial" + "&APPID=" + APIkey;

    fetch(queryUrl)
    .then(function(Response) {
        return Response.json();
    })
    .then(function(Response) {
        $('#forecast').empty()
    var forecasthtml = `
    <h5 class ="display-5">Forecast:</h5>
    <div id ="fiveDayForecstUl" class = "d-flex flex-wrap p-3">`;
    for (let i=0; i < Response.list.length; i++) {
        var daytime = Response.list[i];
        var daytimeUtc = daytime.dt;
        var timezone = Response.city.timezone;
        var daytimeOffset = timezone /60 /60;
        var rightnow = moment.unix(daytimeUtc).utc().utcOffset(daytimeOffset);
        var iconsrc = "https://openweathermap.org/img/w/" + daytime.weather[0].icon + ".png";

        if (rightnow.format("HH:mm:ss") === "11:00:00" ||
            rightnow.format("HH:mm:ss") === "12:00:00" ||
            rightnow.format("HH:mm:ss") === "13:00:00") {;
            forecasthtml +=`
                <div class = "card p-3 bg-info">
                    <ul class ="list-unstyled bg-info text-white">
                        <li>${rightnow.format("MM/DD/YY")}</li>
                        <li class = "weatherIcon"><img src="${iconsrc}"</li>
                        <li>Temp: ${daytime.main.temp}F°</li>
                        <li>Humidity: ${daytime.main.humidity}%</li>
                    </ul>
                </div>`;
        }
    }
      forecasthtml += `</div>`;
      $('#forecast').html(forecasthtml);
    })
}


$('#searchBtn').on('click', function() {
    var city = $('#userSearch').val().trim();
    currentWeather(city);

    if (!lastSearched.includes(city)) {
        lastSearched.push(city)
        var foundcity = $(`
        <li class= "list-group-item mb-2">${city}</li>
        `);
        $('#cities').append(foundcity);
    };
    localStorage.setItem("city", JSON.stringify(lastSearched));
    console.log(lastSearched);
    currentLoc = $('#userSearch').val().trim();
    currentWeather(city);
});

$('#resetBtn').on("click", function(event) {
    event.preventDefault();
    localStorage.clear();
    currentWeather();
    $('.list-group-item').remove();
})

$(document).on('click', '.list-group-item',  function() {
    $('#userSearch').val(event.target.textContent);
    currentLoc = $('#userSearch').val();
    currentWeather();
});

$(document).ready(function() {
     var searchHistory = JSON.parse(localStorage.getItem("city"));
     if (searchHistory !== null) {
         var searchIndex = searchHistory.length - 1;
         var lastCity = searchHistory[searchIndex];
         currentWeather(lastCity);
     }
});
currentWeather();
forecast();
