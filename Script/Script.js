var APIkey = '600c61e27cf44906cdc33478a6409187';
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
//city + "&units=imperial" + "&appid=" + APIKey;
var lastSearched = [];
var today = moment().format('L');

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
    });

}


$('#searchBtn').on('click', function(event) {
    event.preventDefault();
    var city = $('#userSearch').val().trim();
    currentWeather(city);
    if (!lastSearched.includes(city)) {
        lastSearched.push(city);
        var searched = $('<button></button>');
        searched.attr('class', 'btn-danger', 'btn-lg', 'float-left', 'mb-2')
        $('#cities').append(searched);
    };

    localStorage.setItem("city", JSON.stringify(lastSearched));
    console.log(lastSearched);
});