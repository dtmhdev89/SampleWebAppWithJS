/*============UI element module
*
*
*
this module will be responsible for controlling UI Element like 'menu'
*
*
*
*
===========*/

const UI = (function() {

    let menu = document.querySelector("#menu-container");

    const showApp = () => {
        document.querySelector("#app-loader").classList.add('display-none');
        document.querySelector("main").removeAttribute('hidden');
    };

    //hide the app and show the loading screen
    const loadApp = () => {
        document.querySelector("#app-loader").classList.remove('display-none');
        document.querySelector("main").setAttribute('hidden', 'true');
    };

    //
    const _showMenu = () => {

        menu.style.right = 0;
    }; //we can use without {}

    //
    const _hideMenu = () => {

        menu.style.right = '-65%';
    };

    //toggle hourly weather panel
    const _toggleHourlyWeather = () => {

        let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
            arrow = document.querySelector("#toggle-hourly-weather").children[0],
            visible = hourlyWeather.getAttribute('visible'),
            dailyWeather = document.querySelector("#daily-weather-wrapper");

        if (visible == 'false') {
            hourlyWeather.setAttribute('visible', 'true');
            hourlyWeather.style.bottom = 0;
            arrow.style.transform = "rotate(180deg)";
            dailyWeather.style.opacity = 0;
        } else if (visible == 'true') {
            hourlyWeather.setAttribute('visible', 'false');
            hourlyWeather.style.bottom = '-100%';
            arrow.style.transform = "rotate(0deg)";
            dailyWeather.style.opacity = 1;
        } else {
            console.log('unknown state of the hourly weather panel and visible attribute');
        }
    };

    //draw Weather Data

    const drawWeatherData = (data, location) => {

        console.log(data);
        console.log(location);

        let currentlyData = data.currently,
            dailyData = data.daily.data,
            hourlyData = data.hourly.data,
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dailyWeatherWrapper = document.querySelector("#daily-weather-wrapper"),
            dailyWeatherModel,
            day,
            maxMinTemp,
            dailyIcon,
            //hourly weather
            hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
            hourlyWeatherModel,
            hourlyIcon;

        //set current weather


        //set current location

        document.querySelectorAll(".location-label").forEach((e) => {
            e.innerHTML = location;
        });

        //set the background
        document.querySelector('main').style.backgroundImage = "url('./assets/images/bg-images/" + currentlyData.icon + ".jpg')";
        //set the currently icon
        document.querySelector('#currently-icon').setAttribute('src', "assets/images/summary-icons/" + currentlyData.icon + "-white.png");
        //set summary
        document.querySelector('#summary-label').innerHTML = currentlyData.summary;
        //set temperature from Fahrenheit to Celcius
        document.querySelector("#degrees-label").innerHTML = Math.round((currentlyData.temperature - 32) * 5 / 9) + '&#176;';
        //set humidity
        document.querySelector("#humidity-label").innerHTML = Math.round(currentlyData.humidity * 100) + '%';
        //set wind speed
        document.querySelector("#wind-speed-label").innerHTML = (currentlyData.windSpeed * 1.6093).toFixed(1) + 'kph';

        //set daily Weather
        while (dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
        };

        for (let i = 0; i <= 6; i++) {

            //clone the node and remove  display none close 
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('display-none');

            //set the day
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
            dailyWeatherModel.children[0].children[0].innerHTML = day;

            //set min/max temperature for the next days in Celcius
            maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) + '&#176;/'
            				+ Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;' ;
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

            //set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].children[0]
            					.setAttribute('src', "./assets/images/summary-icons/" + dailyIcon + "-white.png");

            //append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);

        };

        dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

        //set hourly weather
        while(hourlyWeatherWrapper.children[1]){
        	hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
        };

        for (let i=0; i<=24;i++){
        	
        	//clone node and remove display-none class of hourly weather model
        	hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
        	hourlyWeatherModel.classList.remove('display-none');

        	//set hour
        	let hourlyTime= hourlyData[i].time * 1000;
        	hourlyWeatherModel.children[0].children[0].innerHTML = new Date(hourlyTime).getHours() + ":" + new Date(hourlyTime).getMinutes();

        	//set hourly temperature from F to C
        	hourlyWeatherModel.children[1].children[0].children[0].innerHTML= Math.round((hourlyData[i].temperature - 32) * 5 / 9) + "&#176;";

        	//set hourly icon
        	hourlyIcon = hourlyData[i].icon;
        	hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', "./assets/images/summary-icons/"+ hourlyIcon +"-grey.png");

        	//append hourly model
        	hourlyWeatherWrapper.appendChild(hourlyWeatherModel);  
        }

        hourlyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

        UI.showApp();
    };

    //======events==========

    //menu events
    document.querySelector("#open-menu-btn").addEventListener('click', _showMenu);

    document.querySelector("#close-menu-btn").addEventListener('click', _hideMenu);

    //hourly weather wrapper events
    document.querySelector("#toggle-hourly-weather").addEventListener('click', _toggleHourlyWeather);

    //export function use outside
    return {
        showApp,
        loadApp,
        drawWeatherData
    }

})();


/*============Local Storage API
*
*
*
this module will be responsible for  saving, retrieving and deleting the citites added by user
*
*
*
*
===========*/

const LOCALSTORAGE = (function(){

	let savedCities = [];

	const save = (city)=>{
		savedCities.push(city);
		localStorage.setItem('savedCities', JSON.stringify(savedCities));
	};

	const get = ()=>{
		if(localStorage.getItem('savedCities') !=null)
			savedCities = JSON.parse(localStorage.getItem('savedCities'));
	};

	const remove = (index)=>{

		if(index < savedCities.length){
			savedCities.splice(index,1);
			localStorage.setItem('savedCities', JSON.stringify(savedCities));
		}
	};

	const getSavedCities = () => savedCities;

	return {
		save,
		get,
		remove,
		getSavedCities
	}

})();


/*============Get Location Module
*
*
*
this module will be responsible for getting the data
about the location to search for weather 
*
*
*
*
===========*/

const GETLOCATION = (function() {

    let location;

    const locationInput = document.querySelector("#location-input"),
        addCityBtn = document.querySelector("#add-city-btn");

    const _addCity = () => {

        location = locationInput.value.trim();
        locationInput.value = "";
        addCityBtn.setAttribute('disabled', 'true');
        addCityBtn.classList.add('disabled');
        WEATHER.getWeather(location);
    };

    locationInput.addEventListener('input', function() {

        let inputText = this.value.trim();

        if (inputText != '') {
            addCityBtn.removeAttribute('disabled');
            addCityBtn.classList.remove('disabled');
        } else {
            addCityBtn.setAttribute('disabled', 'true');
            addCityBtn.classList.add('disabled');
        }
    });

    addCityBtn.addEventListener('click', _addCity);
})();


/*============Get Weather Data
*
*
*
this module will acquire weather data  and 
then it will pass to another module which will put the data on UI
*
*
*
*
===========*/

const WEATHER = (function() {

    const darkSkyKey = '846b304246a8f385f299d9f86e2c28fc',
        geocoderKey = '5670036af5344ccbaa253a7347b9baa6';

    const _getGeocodeURL = (location) => {

        return 'https://api.opencagedata.com/geocode/v1/json?q=' + location + '&key=' + geocoderKey + '&language=en&pretty=1';
    };

    const _getDarkSkyURL = (lat, lng) => {

        return 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + darkSkyKey + '/' + lat + ',' + lng;
    };

    //get weather data from dark sky
    const _getDarkSkyData = (url, location) => {
        axios.get(url)
            .then((response) => {
                console.log(response);
                UI.drawWeatherData(response.data, location);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getWeather = (location) => {

        UI.loadApp();

        let geoCodeURL = _getGeocodeURL(location);

        axios.get(geoCodeURL)
            .then((response) => {

                let lat = response.data.results[0].geometry.lat,
                    lng = response.data.results[0].geometry.lng;

                let darkskyURL = _getDarkSkyURL(lat, lng);
                _getDarkSkyData(darkskyURL, location);
            })
            .catch((error) => {

                console.error(error);
            });
    };

    return {
        getWeather
    }

})();








/*============Init===========*/

window.onload = function() {

    UI.showApp();
};