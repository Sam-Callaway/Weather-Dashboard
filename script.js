var cityName = $("#cityname");
var cityTemp = $("#citytemp");
var cityWind = $("#citywind");
var cityHumidity = $("#cityhumidity");
var forecastEl = $("#forecast");


function retrieveWeatherData(city){

// Obfuscate key so it's less easy for bots trawling GitHub to read straight off the repo
var bue = "";
var vvg = "";
for (let i = 5; i > -1; i--){
    let string = "a0e92b"
    bue = bue + string.charAt(i)
    vvg = "e4395c"
}
bue = bue.toString().substring(0,5)
var fsh = ((2*3)+"f"+(65*5));
var prw = "a" + (10299-842+90)
var kfl = "";
for (let i = 5; i > -1; i--){
    let string = "f25f4"
    kfl = kfl + string.charAt(i)
}
var sre = "f2b"+"c3f"
const abc = fsh+bue+prw+kfl+sre+vvg

// Call the OpenWeatherAPI for current

const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=+"+city+"+&APPID="+abc
$.ajax({
    url: queryURL,
    method: "GET"
  })
    // After the data comes back from the API pass it into the rendering function
    .then(function(response) {currentWeatherRender(response)})

// Call the OpenWeatherAPI for the forecast

const queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=+"+city+"+&APPID="+abc
$.ajax({
    url: queryURL2,
    method: "GET"
  })
    // After the data comes back from the API pass it into the rendering function
    .then(function(response) {weatherForecastRender(response)})

}


function currentWeatherRender(weather){
    cityName.text(`${weather.name} ${moment().format("(D/M/YYYY)")}`);
    cityTemp.text(`Temp: ${(weather.main.temp-273.15).toFixed(2)} °C`);
    cityWind.text(`Wind: ${(weather.wind.speed).toFixed(1)} km/h`);
    cityHumidity.text(`Humidity: ${weather.main.humidity}%`)
    $("#today").removeClass('hide')
}

function weatherForecastRender(weather){
    console.log(weather)
        weather.list.forEach(element => {
        const time = moment.unix(element.dt)
        if(time.format("HH:mm:ss")==="12:00:00"){forecastCardGenerator(element,forecastEl)}
    });

    
    forecastEl.removeClass('hide')
    $("#forecastHeader").removeClass('hide')
}

// Generates cards and appends to div on page. Requires jQuery object for parent div.
function forecastCardGenerator(details,parentdiv){

const newCard = $('<div class="card" style="width: 7rem;">')


`<div class="card-body">
      <h5 class="card-title"></h5>
      <p class="card-text"></p>
      <p class="card-text"></p>
      <p class="card-text"></p>
 </div>`
}

$('#search-button').on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    const city = $('#search-input').val();
    console.log(city)
    retrieveWeatherData(city)
})

$('.previous-button').on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    const city = $(this).text();
    console.log(city)
    //retrieveWeatherData(city)
})

