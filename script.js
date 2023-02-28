var cityName = $("#cityname");
var cityTemp = $("#citytemp");
var cityWind = $("#citywind");
var cityHumidity = $("#cityhumidity");
var cityImg = $("#cityimg")
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
    $("#today").addClass('hide')
    searchSaver(weather.name)
    cityName.text(`${weather.name} ${moment().format("(D/M/YYYY)")}`);
    cityTemp.text(`Temp: ${(weather.main.temp-273.15).toFixed(2)} °C`);
    cityWind.text(`Wind: ${(weather.wind.speed).toFixed(1)} km/h`);
    cityHumidity.text(`Humidity: ${weather.main.humidity}%`)
    cityImg.attr('src','http://openweathermap.org/img/w/'+weather.weather[0].icon+'.png')
    $("#today").removeClass('hide')
}

function weatherForecastRender(weather){
    forecastEl.addClass('hide')
    $("#forecastHeader").addClass('hide')
    forecastEl.empty();
    // Need to adjust the hour of day we're getting as the API is in GMT
    const realHour = timeZoneCalc(weather.city.timezone)
    let cardCount = 0
        weather.list.forEach(element => {
        const time = moment.unix(element.dt)
        
        // We want the midday forecasts and also want to exclude any forecasts for today
        if((time.format("HH")===realHour)&&(time.format("DD")!=moment().format("DD"))){forecastCardGenerator(element,forecastEl); cardCount++}
    });
    // Sometimes depending on when it's run I think it might only have 4 forecasts so just change the header accordingly
    if(cardCount<5)
        {$("#forecastHeader").text(`${cardCount}-Day Forecast:`);$("#sorryMsg").removeClass('hide')}
        else
        {$("#forecastHeader").text("5-Day Forecast:");$("#sorryMsg").addClass('hide')}
    forecastEl.removeClass('hide')
    $("#forecastHeader").removeClass('hide')
}


// Generates cards and appends to div on page. Requires jQuery object for parent div.
function forecastCardGenerator(details,parentdiv){

const newCard = $('<div class="card" style="width: 10rem;">')
newCard.html(
`<div class="card-body">
      <h6 class="card-title">${moment.unix(details.dt).format("D/M/YYYY")}</h6>
      <img src="http://openweathermap.org/img/w/${details.weather[0].icon}.png">
      <p class="card-text">Temp: ${(details.main.temp-273.15).toFixed(2)} °C</p>
      <p class="card-text">Wind: ${(details.wind.speed).toFixed(1)} km/h</p>
      <p class="card-text">Humidity: ${details.main.humidity}%</p>
 </div>`)

 parentdiv.append(newCard);
}

// We need to round to the nearest 3 hours from 12PM to find the time we want to pull as we only get forecast objects for every 3 hours.
// So we can't do, for example, 12PM exact in Berlin as that's 1PM GMT which we don't get in the API
function roundNearest (value, nearest){return(Math.round(value / nearest) * nearest)};
function timeZoneCalc(secondsAdded){
    let nearestHour = moment('12:00:00','HH:mm:ss').add(roundNearest(-secondsAdded/60/60,3),'h');
    return nearestHour.format('HH')
}

function searchSaver(city){
    // If the list doesn't exist, create it and save the city name
    if(localStorage.getItem("cityList")===null){
        let cityList = [city]
        localStorage.setItem("cityList",JSON.stringify(cityList))
    } 
    else
    {
        let cityList = JSON.parse(localStorage.getItem("cityList"))
        // Check if the city is in the list already
        if (cityList.indexOf(city) === -1){
            console.log(cityList.length)
            // We only want to keep the 7 most recent so if there is more than 6 this time we remove the end element which is the oldest searched.
            if (cityList.length > 6){
                for(i=0;i<(cityList.length-5);i++){cityList.pop()}
                cityList.unshift(city)
                localStorage.setItem("cityList",JSON.stringify(cityList))
            }
            else{
                // Otherwise we just add this city to the front
                cityList.unshift(city)
                localStorage.setItem("cityList",JSON.stringify(cityList))
            }
        // If the city already is in the list then move it to the front
        } else {
            cityList.splice(cityList.indexOf(city),1)
            cityList.unshift(city)
            localStorage.setItem("cityList",JSON.stringify(cityList))
        }
    }
searchHistoryRender();
        
}

function searchHistoryRender(){
    $("#history").empty()
    let cityList = JSON.parse(localStorage.getItem("cityList"))
    cityList.forEach(element => {
        const newBtn = $('<button>');
        newBtn.text(element)
        newBtn.addClass("previous-button btn btn-primary")
        $("#history").append(newBtn)
    });
    $('.previous-button').on('click',function(event){
        event.preventDefault();
        event.stopPropagation();
        const city = $(this).text();
        retrieveWeatherData(city)
    })
}


$('#search-button').on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    const city = $('#search-input').val();
    retrieveWeatherData(city)
})



searchHistoryRender();
