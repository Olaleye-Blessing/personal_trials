import { NetworkError } from "../corona_update/error.js";

import { todayResult, resultFollowingDays, todayDiv, searchedTdayDiv} from "./divContainers.js";

const pageLoader = document.querySelector('[data-loader="page"]');

// window.addEventListener('load', event => {
//     // console.log(pageLoader);
//     pageLoader.style.opacity = 0;
//     setTimeout(() => {
//         pageLoader.remove();
//     }, 1100);
// })

const videoCont = document.querySelector('.bg__video');

const form = document.forms[0];

const searchInput = document.getElementById('search');

const resultCont = document.querySelector('.result');

function createLoader() {
    let div = document.createElement('div');
    div.classList.add('cssload-container');
    div.innerHTML = `<div class="cssload-item cssload-moon"></div>`;
    return div;
}

function notFoundDiv(message) {
    let cont = document.createElement('span');
    cont.classList.add('notFound');
    cont.innerHTML = message;
    form.append(cont);
    setTimeout(() => {
        cont.style.opacity = 0;
        setTimeout(() => {
            cont.remove();
        }, 1000);
    }, 5000);
}

function disableFormElements() {
    for (let i = 0; i < form.elements.length; i++) {
        form.elements[i].classList.add('disabled');
        form.elements[i].disabled = true;
    }
}

function enableFormElements() {
    for (let i = 0; i < form.elements.length; i++) {
        form.elements[i].classList.remove('disabled');
        form.elements[i].disabled = false;
    }
}

function changeBgVideo(src) {
    videoCont.innerHTML = ``;
    videoCont.innerHTML = `<video class="bg__video-content" autoplay muted loop>
    <source src="../videos/weather/${src}.mp4" type="video/mp4">
    <source src="../videos/weather/${src}.webm" type="video/webm">
    </video>`
}

function myDate(milliseconds) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let dateObj = new Date(milliseconds);
    
    let day = days[dateObj.getDay()];
    let date = dateObj.getDate();
    let month = months[dateObj.getMonth()]
    let hours = dateObj.getHours();
    let mins = dateObj.getMinutes();
    let secs = dateObj.getSeconds();

    if (hours < 10) {
        hours = `0${hours}`;
    }

    if (mins < 10) {
        mins = `0${mins}`;
    }

    if (secs < 10) {
        secs = `0${secs}`;
    }
    
    return [day, `${date} ${month}`, `${hours}:${mins}:${secs}`];
}

function createDiv(detail) {
    let div = document.createElement('div');
    div.classList.add('result__container');
    div.innerHTML = `<div class="result__day">
    <p>${ myDate((detail.dt * 1000))[0] }</p></div>
    <figure><img src="http://openweathermap.org/img/wn/${detail.weather[0].icon}@2x.png" alt=""></figure>
    <p>${detail.temp.day || detail.main.temp}<sup>o</sup>C</p>
    <p>${detail.temp.max || detail.main.temp}<sup>o</sup></p>`
    return div;
}

function createDiv_search(detail) {
    let div = document.createElement('div');
    div.classList.add('result__container');
    div.innerHTML = `<div class="result__day">
    <p>${ myDate((detail.dt * 1000))[0] }</p></div>
    <figure><img src="http://openweathermap.org/img/wn/${detail.weather[0].icon}@2x.png" alt=""></figure>
    <p>${detail.main.temp}<sup>o</sup>C</p>
    <p>${detail.main.feels_like}<sup>o</sup></p>`
    return div;
}

form.addEventListener('submit', fetchWeather);

function getVideoWeatherCond(description) {
    let newDescription = description.toLowerCase();
    switch (newDescription) {
        case 'sunny':
            changeBgVideo('Beach - 8010'); 
            break;

        case 'clouds':
            changeBgVideo('Cloud - 9153'); 
            break;

        case 'haze':
            changeBgVideo('Sunset - 34623'); 
            break;

        case 'mist':
            changeBgVideo('Mist - 935'); 
            break;

        case 'fog':
            changeBgVideo('Trees - 56476'); 
            break;

        case 'rain':
            changeBgVideo('Rain - 26369'); 
            break;

        case 'snow':
            changeBgVideo('Snowfall - 2362'); 
            break;

        case 'drizzle':
            changeBgVideo('Drizzle - 14496'); 
            break;

        default:
            changeBgVideo('Fall - 23881');
    }
}

// const clientFetchUrls = ['https://api.ipgeolocation.io/ipgeo?apiKey=b27ecf90eaf747ada703c9a51478c65e', 'https://ipapi.co/json/'];

async function fetchClientLocation(url) {
    let clientRes = await fetch(url);
    return clientRes.json();
}

function returnClientInfo(urlRes) {
    return {
            city: urlRes.city,
            longitude: urlRes.longitude,
            latitude: urlRes.latitude
    }
}

async function getUserLocation_ipgeolocate() {
    try {
        let userRes = await fetchClientLocation('https://api.ipgeolocation.io/ipgeo?apiKey=b27ecf90eaf747ada703c9a51478c65e');

        return returnClientInfo(userRes);
    } catch (error) {
        console.warn(error);
    }
}

async function getUserWeather(lat, lon) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=2a63fbe8f73d8e2ae551fffd101e59ee`);
        if (response.ok) {
            return response.json();
        } else {
            console.warn('HTTP error');
        }
    } catch (error) {
        console.error(error);
    }
}

async function setUserWeather() {
    let {city, longitude, latitude} = await getUserLocation_ipgeolocate();
    let userResult = await getUserWeather(latitude, longitude);
    let [current, daily] = [userResult.current, userResult.daily]
    let currentTime = myDate(current.dt * 1000);
    todayDiv(current, currentTime, city);

    getVideoWeatherCond(current.weather[0].main)

    for (let i = 1; i < daily.length - 1; i++) {
        let dailyCont = createDiv(daily[i]);
        resultFollowingDays.append(dailyCont);
    }
    
    pageLoader.style.opacity = 0;
    setTimeout(() => {
        pageLoader.remove();
    }, 1100);
}

document.addEventListener('DOMContentLoaded', async event => {
    await setUserWeather();
})

async function currentLocationWeather(userInput) {
    try {
        let wetherRes = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=metric&appid=2a63fbe8f73d8e2ae551fffd101e59ee`);
        return await wetherRes.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new NetworkError('Network problem');
        }
    }
}

async function populateResult(userInput) {
    let loading = createLoader();
    form.append(loading);
    disableFormElements();

    try {
        let currentWeather = await currentLocationWeather(userInput);

        if (currentWeather.message) {
            enableFormElements();
            loading.style.opacity = 0;
            setTimeout(() => {
                loading.remove();
            }, 650);
            notFoundDiv(currentWeather.message);
            return;
        }

        resultCont.classList.add('notOpaq');
        videoCont.classList.add('notOpaq');

        let locationName = currentWeather.name;

        let currentTime = myDate(currentWeather.dt * 1000);
        
        // todayDiv(currentWeather, currentTime, locationName);

        // setTimeout(() => {
        //     todayDiv(currentWeather, currentTime, locationName);
        //     getVideoWeatherCond(currentWeather.weather[0].main);
        // }, 700);

        // getVideoWeatherCond(currentWeather.weather[0].main);
        
        let weatherForecast = await getWeatherData(userInput);

        weatherForecast = weatherForecast.list.filter(list => list.dt_txt.indexOf("00:00:00") != -1);

        setTimeout(() => {
            todayDiv(currentWeather, currentTime, locationName);
            getVideoWeatherCond(currentWeather.weather[0].main);
            resultFollowingDays.innerHTML = ``;

            for (let i = 0; i <= 7; i++) {
                if (weatherForecast[i]) {
                    let dailyCont = createDiv_search(weatherForecast[i]);
                    resultFollowingDays.append(dailyCont);
                }
            }

            enableFormElements();
            loading.style.opacity = 0;
            setTimeout(() => {
                loading.remove();
                resultCont.classList.remove('notOpaq');
                videoCont.classList.remove('notOpaq');
            }, 650);
        }, 700);
    } catch (error) {
        if (error instanceof NetworkError) {
            console.warn(error.message);
            notFoundDiv(error.message);
            enableFormElements();
            loading.style.opacity = 0;
            setTimeout(() => {
                loading.remove();
            }, 650);
            console.clear();
        }
    }
}


async function fetchWeather(event) {
    event.preventDefault();
    
    let userInput = searchInput.value.trim();

    if (userInput == '') {
        return;
    }

    populateResult(userInput);

    searchInput.value = '';
}

async function getWeatherData(userInput) {
    try {
        let weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=metric&appid=2a63fbe8f73d8e2ae551fffd101e59ee`);
        let weatherJson = await weatherRes.json();
        return weatherJson;
    } catch (error) {
        console.warn(error);
    }
}

// http://openweathermap.org/img/wn/13d@2x.png