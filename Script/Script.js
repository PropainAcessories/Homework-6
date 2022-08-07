var APIkey = '600c61e27cf44906cdc33478a6409187';
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
 city + "&appid=" + APIKey;
var rightHere = "";
var lastSearched = [];
var today = moment().format('L');