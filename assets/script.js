var appid = "9b017f6d924c3b3ef0f556a0d426f401";
var cityName = "Seattle";
// city -> coords https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid=9b017f6d924c3b3ef0f556a0d426f401
// coords -> 5-day  https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9b017f6d924c3b3ef0f556a0d426f401
// coords -> current weather https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=9b017f6d924c3b3ef0f556a0d426f401

/*
async function callAPI(city){
    console.log(city);
    console.log(typeof(city));
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
            data = weatherData;
            return(weatherData);
        });
    } else if (isNaN(parseInt(city))){
        var temp = getCoordsCity(city).then(function(x){console.log(x); console.log(typeof(x));});
        console.log(temp);
    } else {
        console.log(typeof(parseInt(city)));
        console.log(parseInt(city));
    }
    return(data);
}
*/

async function getCoordsCity(city){
    
    console.log(city);
    fetch("https://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=9b017f6d924c3b3ef0f556a0d426f401")
    .then(function(response){
        console.log('line 42: getCoordsCity fetch');
        if(!response.ok){
            console.log(response.status);
            renderWeatherError(response.status);
        }
        return response.json();
    })
    .then(setCoords)
    .then(collectWeatherData);
    console.log(coords);
}

// var forecastData = callAPI([47.6061,-122.3328]);
// api.openweathermap.org/data/2.5/forecast?lat=47.6061&lon=122.3328&appid=9b017f6d924c3b3ef0f556a0d426f401

function renderWeatherError(num){
    console.log("rendering error");
    console.log(num);
    $("#current-forecast-title").text("Error "+num);
    $("#current-forecast").text("Error retrieving weather data.");
}

function setCoords(coordData){
    var coords = [];
    coords[0] = coordData[0].lat;
    coords[1] = coordData[0].lon;
    console.log(coords);
    localStorage.setItem("cityCoordsLS",JSON.stringify(coords));
    return(coords);
}

async function collectWeatherData(coords){
    var forecast = [{weather:"",temp:"",wind:"",hmdty:"",date: ""},{weather:"",temp:"",wind:"",hmdty:"",date: ""},{weather:"",temp:"",wind:"",hmdty:"",date: ""},{weather:"",temp:"",wind:"",hmdty:"",date: ""},{weather:"",temp:"",wind:"",hmdty:"",date: ""},{weather:"",temp:"",wind:"",hmdty:"",date: ""}];
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+coords[0]+"&lon="+coords[1]+"&units=imperial&appid=9b017f6d924c3b3ef0f556a0d426f401")
    .then(function(response){
        console.log('line 77: collectWeatherData fetch');
        if(!response.ok){
            renderWeatherError(response.status);
        }
        return(response.json());
    })
    .then(function(weatherData){
        console.log("Current Weather Data:");
        console.log(weatherData);
        forecast[0].date = dayjs().format("YYYY-MM-DD");
        forecast[0].weather = weatherData.weather[0].description;
        forecast[0].temp = weatherData.main.temp + "°F";
        forecast[0].wind = weatherData.wind.speed + " MPH";
        forecast[0].hmdty = weatherData.main.humidity + "%";
        console.log("Current Weather:");
        console.log(forecast[0]);
        return;
    });
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+coords[0]+"&lon="+coords[1]+"&units=imperial&appid=9b017f6d924c3b3ef0f556a0d426f401")
    .then(function(response){
        if(!response.ok){
            renderWeatherError(response.status);
        }
        return(response.json());
    })
    .then(function(weatherData){
        console.log("5-day Weather Data:")
        console.log(weatherData);
        for(i=1; i<=5; i++){
            var x = weatherData.list[8*i-1];
            console.log(x);
            forecast[i].date = x.dt_txt.split(" ")[0];
            forecast[i].weather = x.weather[0].description;
            forecast[i].temp = x.main.temp + "°F";
            forecast[i].wind = x.wind.speed + "MPH";
            forecast[i].hmdty = x.main.humidity + "%";
        }
        console.log("Weather Forecast Object:");
        console.log(forecast);
        return forecast;
    })
    .then(renderWeatherData);
    
}

function renderWeatherData(updatedForecast){
    console.log(updatedForecast[0]);
    $("#current-forecast-title").text(cityName + " " +updatedForecast[0].date);
    var weatherLi = document.createElement("li");
    var tempLi = document.createElement("li");
    var windLi = document.createElement("li");
    var hmdtyLi = document.createElement("li");
    var todaysWeatherImg =  setWeatherImg(updatedForecast[0]);
    weatherLi.appendChild(todaysWeatherImg);
    tempLi.innerHTML = "Temperature: "+updatedForecast[0].temp;
    windLi.innerHTML = "Wind Speed: "+updatedForecast[0].wind;
    hmdtyLi.innerHTML = "Humidity: "+updatedForecast[0].hmdty;
    $("#current-forecast-stats").append(weatherLi);
    $("#current-forecast-stats").append(tempLi);
    $("#current-forecast-stats").append(windLi);
    $("#current-forecast-stats").append(hmdtyLi);

    for(i=1;i<=5;i++){
        var dateEl = document.createElement("div");
        dateEl.innerHTML = updatedForecast[i].date;
        dateEl.setAttribute("class", "card-header bg-info");
        $("#day-"+i).parent().prepend(dateEl);
        var dailyWeatherImg = setWeatherImg(updatedForecast[i]);
        var tempweatherLi = document.createElement("li");
        var temptempLi = document.createElement("li");
        var tempwindLi = document.createElement("li");
        var temphmdtyLi = document.createElement("li");
        tempweatherLi.appendChild(dailyWeatherImg);
        temptempLi.innerHTML = "Temperature: "+updatedForecast[i].temp;
        tempwindLi.innerHTML = "Wind Speed: "+updatedForecast[i].wind;
        temphmdtyLi.innerHTML = "Humidity: "+updatedForecast[i].hmdty;
        $("#day-"+i).append(tempweatherLi);
        $("#day-"+i).append(temptempLi);
        $("#day-"+i).append(tempwindLi);
        $("#day-"+i).append(temphmdtyLi);
    }
}

function setWeatherImg(weatherData){
    var weatherImg = document.createElement("img");
    var hour = dayjs().format("H");
    var tod = "";
    if(hour<6 || hour>21){
        tod = "night";
    } else {
        tod = "day";
    }
    if(weatherData.weather === "clear sky"){
        weatherImg.setAttribute("src","./assets/images/"+tod+"-clear.png");
    } else if(weatherData.weather === "few clouds"){
        weatherImg.setAttribute("src","./assets/images/"+tod+"-few-clouds.png");
    } else if(weatherData.weather === "scattered clouds"){
        weatherImg.setAttribute("src","./assets/images/scattered-clouds.png");
    } else if(weatherData.weather === "broken clouds"||weatherData.weather === "overcast clouds"){
        weatherImg.setAttribute("src","./assets/images/broken-clouds.png");
    } else if(weatherData.weather === "shower rain"){
        weatherImg.setAttribute("src","./assets/images/shower-rain.png");
    } else if(weatherData.weather === "rain"){
        weatherImg.setAttribute("src","./assets/images/"+tod+"-rain.png");
    } else if(weatherData.weather === "thunderstorm"){
        weatherImg.setAttribute("src","./assets/images/thunderstorm.png");
    } else if(weatherData.weather === "snow"){
        weatherImg.setAttribute("src","./assets/images/snow.png");
    } else if(weatherData.weather === "mist"){
        weatherImg.setAttribute("src","./assets/images/mist.png");
    } else {
        weatherImg.setAttribute("src","./assets/images/placeholder.png");
    }
    return weatherImg;
}

function collectSearch(){
    var search = $("#city-search").val();
    var searchHistory = JSON.parse(localStorage.getItem("searchHistoryLS"));
    if(!(searchHistory.includes(search))){
        searchHistory.push(search);
        localStorage.setItem("searchHistoryLS",JSON.stringify(searchHistory));
    }
    localStorage.setItem("currentCityLS",search);
    getCoordsCity(search);
}

function initializeData(){
    if(!localStorage.getItem("cityCoordsLS")){
        localStorage.setItem("cityCoordsLS",JSON.stringify([47.6061,-122.3328]));
    }
    if(localStorage.getItem("searchHistoryLS")){
        var searchHistory = JSON.parse(localStorage.getItem("searchHistoryLS"));
        for (i=0;i<searchHistory.length; i++){
            var searchTab = document.createElement("button");
            searchTab.innerHTML = searchHistory[i];
            searchTab.setAttribute("class","rounded-2 p-1 m-1 bg-info suggestion");
            searchTab.setAttribute("name",searchHistory[i]);
            searchTab.addEventListener("click",suggestionHandler);
            $("#suggestions").append(searchTab);
        }
    } else {
        localStorage.setItem("searchHistoryLS", JSON.stringify([]));
    }
    if(localStorage.getItem("currentCityLS")){
        cityName = localStorage.getItem("currentCityLS");
    }
}

function suggestionHandler(event){
    event.preventDefault();
    localStorage.setItem("currentCityLS", event.target.name);
    document.location.replace('index.html');
}

$(".suggestion").on("click",suggestionHandler);

initializeData();
collectWeatherData(JSON.parse(localStorage.getItem('cityCoordsLS')));

$("#search-submit").on("click",collectSearch);

// <button class="rounded-2 p-1 m-1 bg-info suggestion" id="pld" name="Portland">Portland</button>