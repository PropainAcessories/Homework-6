var APIkey = "600c61e27cf44906cdc33478a6409187";
var lastSearched = [];
var currentLoc = "";
var today = moment().format('L');
var foundcity = "";

function currentWeather () {
    // What the user inputs
    city = $('#userSearch').val().trim();
    // The url im pulling information from
   var queryURL =  "https://api.openweathermap.org/data/2.5/weather?q=" +
   city + "&units=imperial" + "&appid=" + APIkey;

   // Fetches a response and returns it as a javascript object.
    fetch(queryURL)
    .then(function(response){
       return response.json();
    })
    .then(function(response){

        // Icons.
        var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        // Response from the API about data receiving time GMT.
        var utcTime = response.dt;
        // API response relating to timezone
        var Timezone = response.timezone;
        // Helps offset from Unix time
        var timeZoneoffset = Timezone / 60 /60;
        // Uses moment and API response to hash out current time.
        var rightnow = moment.unix(utcTime).utc().utcOffset(timeZoneoffset);

        // It took me forever to figure out to use ` these. 
        // Thanks stack overflow guy from 2014; also this writes html.
        var Weatherhtml = `
            <h1>${response.name} ${rightnow.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h1>
            <ul class = "list-unstyled">
                <li>Temperature: ${response.main.temp}F°</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.main.humidity}MPH</li>
                <li id ="uvIndex">UV Index:</li>
            </ul>`;
            // Well this guy does the writing
        $('#Weather').html(Weatherhtml);
        // Conducts the forecast for the relevant city
        forecast(city);

        // The responses from the server for coordinates and latitude.
        var lat = response.coord.lat;
        var long = response.coord.lon;
        var sunUrl = "api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&APPID=" + APIkey;
        
        // cross origin resource sharing error solution, thanks google.
        sunUrl = "https://cors-anywhere.herokuapp.com/" + sunUrl;
        //fetches from the UVI url and returns it as a javascript object
        fetch(sunUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            //takes the response from openweathermap and appends it into html
            var uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span class = "text-white" id = "#uvIndex"> ${uvIndex}</span>`);
            

            //Sets the background color of the uv index
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
    // User search input
    var city = $('#userSearch').val().trim();

    // API url for forecast
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
    + city + "&units=imperial" + "&APPID=" + APIkey;

    // Fetches and returns as a javascript object
    fetch(queryUrl)
    .then(function(Response) {
        return Response.json();
    })
    .then(function(Response) {
        // Empties the forecasts so they don't pile up.
        $('#forecast').empty()
    // This is the start of the forecast variable    
    var forecasthtml = `
    <h5 class ="display-5 text-white">Forecast:</h5>
    <div id ="fiveDayForecstUl" class = "d-flex flex-wrap p-3">`;
    // The loop that writes my forecasts
    for (let i=0; i < Response.list.length; i++) {
        var daytime = Response.list[i];
        var daytimeUtc = daytime.dt;
        var timezone = Response.city.timezone;
        var daytimeOffset = timezone /60 /60;
        var rightnow = moment.unix(daytimeUtc).utc().utcOffset(daytimeOffset);
        var iconsrc = "https://openweathermap.org/img/w/" + daytime.weather[0].icon + ".png";

        // Gets current forecasts
        if (rightnow.format("HH:mm:ss") === "11:00:00" ||
            rightnow.format("HH:mm:ss") === "12:00:00" ||
            rightnow.format("HH:mm:ss") === "13:00:00") {
            forecasthtml +=`
                <div class = "card bg-dark p-3">
                    <ul class ="list-unstyled bg-dark text-white">
                        <li>${rightnow.format("MM/DD/YY")}</li>
                        <li class = "weatherIcon"><img src="${iconsrc}"</li>
                        <li>Temp: ${daytime.main.temp}F°</li>
                        <li>Humidity: ${daytime.main.humidity}%</li>
                    </ul>
                </div>`;
        }
    }
    //Writes the forecast into the HTML
      forecasthtml += `</div>`;
      $('#forecast').html(forecasthtml);
    })
};
// Search button
$('#searchBtn').on('click', function() {

    var city = $('#userSearch').val().trim();
    currentWeather(city);
    // puts new inputs to the list
    if (!currentLoc.includes(city)) {
        lastSearched.push(city)
        var foundcity = $(`
        <li class= "list-group-item list-group-item bg-danger
         text-white mb-2">${city}</li>
        `);
        // well this guy does it
        $('#cities').append(foundcity);
    }

    localStorage.setItem("city", JSON.stringify(lastSearched));
    //console.log(lastSearched);
    //currentLoc = $('#userSearch').val().trim();
    currentWeather(lastSearched);
});

// clears the city list.
$('#resetBtn').on("click", function(event) {
    event.preventDefault();
    localStorage.clear();
    currentWeather();
    $('.list-group-item').remove();
})

//makes the list group items do the weather when you click on them.
$(document).on('click', '.list-group-item',  function() {
    var cityList = $(this).text();
    currentWeather(cityList)
});


// Function calling.
currentWeather();
forecast();
