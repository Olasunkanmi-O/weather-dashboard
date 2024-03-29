

// https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric
// https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric


// declaring global variables for ease of access
var apiKey = '6df1a64a30a7da7bf9c5be5027c23bd8';
var city = $('#search-input')
var baseUrl = 'https://api.openweathermap.org/data/2.5/';
var currentWeather = baseUrl + `weather?&appid=${apiKey}&units=metric&`;
var forecastWeather = baseUrl + `forecast?&appid=${apiKey}&units=metric&`



// getting the city from the user to populate the API
function getInput(cityName) {
    // current data request from weather API
    $.get(currentWeather + `q=${cityName}`)
        .then(function (currentData) {
            // inputs from the current date to populate forecast data
            var lon = currentData.coord.lon;
            var lat = currentData.coord.lat;
            var date = moment().format('L');
            var icon = currentData.weather[0].icon

            // 5-day forecast weather request from weather API
            $.get(forecastWeather + `lat=${lat}&lon=${lon}`)
                .then(function (forecastData) {

                    var today = $('#today')
                    var forecast = $('#forecast')

                    today.append(`
                    <div>
                        <h2>${currentData.name}<small class="todayDate">(${date})</small>
                            <img src="https://openweathermap.org/img/w/${icon}.png" alt="weather_icon">
                        </h2>
                        <p>Temperature: ${Math.round(currentData.main.temp)}&degC</p>
                        <p>Humidity: ${currentData.main.humidity}%</p>
                        <p>Wind Speed: ${currentData.wind.speed}m/s</p>
                        <p class="mb">UV index: ${currentData.wind.speed}</p>                        
                    </div>           
                    `)

                    // looping over forecast data for every 3hours to get the noon data for the 5 days
                    for (var obj of forecastData.list) {
                        var imageIcon = obj.weather[0].icon
                        //creating the elements that contain the 5-days forecast data for only noon time
                        if (`${obj.dt_txt}`.includes('12:00:00')) {
                            forecast.append(`                            
                            <div>
                                <h5>${moment(obj.dt_txt).format('L')}</h5>
                                <img src="https://openweathermap.org/img/w/${imageIcon}.png" alt="weather_icon">                    
                                <p>Temp: ${obj.main.temp}&degC</p>
                                <p>Humidity: ${obj.main.humidity}%</p>
                            </div>
                            `)
                        }
                    }

                })

        }
        )

}

// function to display locations stored in local storage 
function displayCity(cities) {
    var storedCity = JSON.parse(localStorage.getItem('cities'))
    uniqueStorage = [... new Set(storedCity)]
    // looping over the unique values to avoid repetition of location
    uniqueStorage.forEach((city)=>{
        console.log(city)
        $('#history').prepend(`
        <ul>
            <li class="cities">${city}</li>
        </ul>
        `)
    })
    $('#clearBtn').removeClass('hide')
    
}

function clearHistory() {

    $('#history').remove()
    $('section').remove()
    localStorage.clear()

}

// function to store the user's input to local storage 
function saveCity() {
    var cityName = city.val().trim()
    var storedCity = getCity()
    if(cityName === null){
        alert('Please enter a city')
    }
    // adding the new user input to existing array
    storedCity.push(cityName)
    // store the new array to local storage
    localStorage.setItem('cities', JSON.stringify(storedCity))
   
}
// getting all the cities stored in local storage 
function getCity (){
    // return existing array if it exits or return empty array
    return JSON.parse(localStorage.getItem('cities')) || []    
}


function init() {
// function to initialize the app
    $('#search-button').on('click', function (event) {
        // save user's input to variable 
        var cityName = city.val().trim()
        //code to prevent form default of refresh   
        event.preventDefault()
        // code to prevent actions if there's no input from user
        if (!cityName) {
            return
        }
        
        getInput(cityName);
        saveCity()
        displayCity()                   
        
    })

    $('#clearBtn').on('click', clearHistory)
}


init()
