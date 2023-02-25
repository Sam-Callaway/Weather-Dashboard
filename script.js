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

// Call the OpenWeatherAPI

const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=+"+city+"+&APPID="+abc
$.ajax({
    url: queryURL,
    method: "GET"
  })
    // After the data comes back from the API pass it into the rendering function
    .then(function(response) {weatherRender(response)})
}


function weatherRender(weather){
    console.log(weather)
    

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