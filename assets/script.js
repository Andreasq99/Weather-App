var appid = "9b017f6d924c3b3ef0f556a0d426f401";
var forecast = [{weather:"",temp:"",wind:"",hmdty:"",},{weather:"",temp:"",wind:"",hmdty:"",},{weather:"",temp:"",wind:"",hmdty:"",},{weather:"",temp:"",wind:"",hmdty:"",},{weather:"",temp:"",wind:"",hmdty:"",},{weather:"",temp:"",wind:"",hmdty:"",},];
// city -> coords https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid=9b017f6d924c3b3ef0f556a0d426f401
// coords -> 5-day  https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9b017f6d924c3b3ef0f556a0d426f401
// coords -> current weather https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=9b017f6d924c3b3ef0f556a0d426f401

async function callAPI(city){
    var data;
    if (typeof(city)==="object"){
        data = fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+city[0]+"&lon="+city[1]+"&appid=9b017f6d924c3b3ef0f556a0d426f401&units=imperial")
        .then(function(response){
            if(response.ok){
                return(response.json());
            } else {
                console.log(response.status);
                return(response.status);
            }
        })
        .then(function(weatherData){
            console.log(weatherData);
            return(weatherData);
        });
    }
    return(data);
}

var forecastData = callAPI([47.6061,-122.3328]);
console.log(forecastData.result);

// api.openweathermap.org/data/2.5/forecast?lat=47.6061&lon=122.3328&appid=9b017f6d924c3b3ef0f556a0d426f401