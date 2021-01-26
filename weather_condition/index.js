import { NetworkError } from "../corona_update/error.js";

// console.log(NetworkError);

import { todayResult, resultFollowingDays, todayDiv, searchedTdayDiv} from "./divContainers.js";

const videoCont = document.querySelector('.bg__video');

const form = document.forms[0];

const searchInput = document.getElementById('search');

const resultCont = document.querySelector('.result');

// const notFoundError = document

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
        // removenotFoundMessage();
        cont.style.opacity = 0;
        setTimeout(() => {
            cont.remove();
        }, 1000);
    }, 5000);
}

// function removenotFoundMessage() {
//     if (form.querySelector('.notFound')) {
//         let notFound = form.querySelector('.notFound');
//         notFound.style.opacity = 0;
//         setTimeout(() => {
//             notFound.remove();
//         }, 1000);
//     }
// }

form.addEventListener('submit', fetchWeather);

function getVideoWeatherCond(description) {
    let newDescription = description.toLowerCase();
    console.log(newDescription);
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

        default:
            changeBgVideo('Fall - 23881');
    }
    // if (newDescription.indexOf('sunny') != -1) {
    //     changeBgVideo('Beach - 8010');
    // } else if (newDescription.indexOf('cloud') != -1) {
    //     changeBgVideo('Cloud - 9153');
    // } else if (newDescription.indexOf('haze') != -1) {
    //     changeBgVideo('Sunset - 34623');
    // }
}


async function currentLocationWeather(userInput) {
    try {
        let wetherRes = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=metric&appid=2a63fbe8f73d8e2ae551fffd101e59ee`);
        return await wetherRes.json();
    } catch (error) {
        if (error instanceof TypeError) {
            // console.log('Yes');
            // console.warn(error);
            throw new NetworkError('Network problem');
            // return;
        }
    }
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


async function populateResult(userInput) {
    // resultCont.style.opacity = 0;
    resultCont.classList.remove('opaq');
    videoCont.classList.add('notOpaq');
    // resultCont.classList.remove('opaq');
    let loading = createLoader();
    form.append(loading);
    // form.classList.add('disabled');
    disableFormElements();
    try {
        let currentWeather = await currentLocationWeather(userInput);

        console.log(currentWeather);

        if (currentWeather.message) {
            console.log('yes');
            // notFoundDiv(currentWeather.message);
            enableFormElements();
            loading.style.opacity = 0;
            notFoundDiv(currentWeather.message);

            setTimeout(() => {
                loading.remove();
                setTimeout(() => {
                    resultCont.classList.add('opaq');
                    videoCont.classList.remove('notOpaq');
                }, 100);
            }, 800);
            // videoCont.classList.remove('notOpaq');
            return;
        }

        let locationName = currentWeather.name;

        let currentTime = myDate(currentWeather.dt * 1000);
        // todayResult.style.opacity = 0;
        todayDiv(currentWeather, currentTime, locationName);

        getVideoWeatherCond(currentWeather.weather[0].main);
        // searchedTdayDiv(currentWeather, currentTime, locationName);
        let weatherForecast = await getWeatherData(userInput);
        // console.log(weatherForecast);

        weatherForecast = weatherForecast.list.filter(list => list.dt_txt.indexOf("00:00:00") != -1)

        console.log(weatherForecast);

        resultFollowingDays.innerHTML = ``;
        for (let i = 0; i <= 7; i++) {
            if (weatherForecast[i]) {
                let dailyCont = createDiv_search(weatherForecast[i]);
                // console.log(dailyCont);
                resultFollowingDays.append(dailyCont);
            }
        }
        enableFormElements();
        loading.style.opacity = 0;
        setTimeout(() => {
            loading.remove();
            setTimeout(() => {
                resultCont.classList.add('opaq');
                videoCont.classList.remove('notOpaq');
            }, 200);
        }, 800);
    } catch (error) {
        if (error instanceof NetworkError) {
            console.warn(error.message);
            notFoundDiv(error.message);
            enableFormElements();
            loading.style.opacity = 0;
            setTimeout(() => {
                loading.remove();
                setTimeout(() => {
                    resultCont.classList.add('opaq');
                    videoCont.classList.remove('notOpaq');
                }, 100);
            }, 800);
            console.log('yes');
        }
    }
}

async function fetchWeather(event) {
    event.preventDefault();
    // removenotFoundMessage();
    
    let userInput = searchInput.value.trim();

    if (userInput == '') {
        return;
    }

    populateResult(userInput);

    searchInput.value = '';

    // let currentWeather = await currentLocationWeather(userInput);

    // console.log(currentWeather);

    // if (currentWeather.message) {
    //     console.log('yes');
    //     notFoundDiv(currentWeather.message);
    //     return;
    // }

    // let locationName = currentWeather.name;

    // let currentTime = myDate(currentWeather.dt * 1000);
    // todayDiv(currentWeather, currentTime, locationName);

    // getVideoWeatherCond(currentWeather.weather[0].main);
    // // searchedTdayDiv(currentWeather, currentTime, locationName);
    // let weatherForecast = await getWeatherData(userInput);
    // // console.log(weatherForecast);

    // weatherForecast = weatherForecast.list.filter(list => list.dt_txt.indexOf("00:00:00") != -1)

    // console.log(weatherForecast);

    // resultFollowingDays.innerHTML = ``;
    // for (let i = 0; i <= 7; i++) {
    //     if (weatherForecast[i]) {
    //         let dailyCont = createDiv_search(weatherForecast[i]);
    //         // console.log(dailyCont);
    //         resultFollowingDays.append(dailyCont);
    //     }
    // }
}

searchInput.addEventListener('input', event => {
    console.log('YEYEYE');
    // removenotFoundMessage();
})

async function getWeatherData(userInput) {
    try {
        let weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=metric&appid=2a63fbe8f73d8e2ae551fffd101e59ee`);
        let weatherJson = await weatherRes.json();
        return weatherJson;
    } catch (error) {
        console.warn(error);
    }
}

function changeBgVideo(src) {
    videoCont.innerHTML = ``;
    videoCont.innerHTML = `<video class="bg__video-content" autoplay muted loop>
    <source src="../videos/weather/${src}.mp4" type="video/mp4">
    <source src="../videos/weather/${src}.webm" type="video/webm">
    </video>`
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
        
        // let userRes = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=b27ecf90eaf747ada703c9a51478c65e');
        // let userDetail = await userRes.json();
        // return {
        //     city: userDetail.city,
        //     longitude: userDetail.longitude,
        //     latitude: userDetail.latitude
        // }
    } catch (error) {
        console.warn(error);
    }
}

async function setUserWeather() {
    let {city, longitude, latitude} = await getUserLocation_ipgeolocate();
    console.log(city);
    let userResult = await getUserWeather(latitude, longitude);
    let [current, daily] = [userResult.current, userResult.daily]
    console.log(current, daily);
    let currentTime = myDate(current.dt * 1000);
    todayDiv(current, currentTime, city);

    console.log(current.weather[0].main.toLowerCase());

    getVideoWeatherCond(current.weather[0].main)

    // if (current.weather[0].main.toLowerCase().indexOf('sunny') != -1) {
    //     changeBgVideo('Beach - 8010');
    // } else if (current.weather[0].main.toLowerCase().indexOf('cloud') != -1) {
    //     changeBgVideo('Cloud - 9153');
    // }

    for (let i = 1; i < daily.length - 1; i++) {
        let dailyCont = createDiv(daily[i]);
        console.log(dailyCont);
        resultFollowingDays.append(dailyCont);
    }
    resultCont.classList.add('opaq');
}


async function getUserWeather(lat, lon) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=2a63fbe8f73d8e2ae551fffd101e59ee`);
        if (response.ok) {
            return response.json();
        } else {
            console.warn('HTTP error')
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async event => {
    await setUserWeather();
})

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
    
    // console.log(day, date, month, hours, mins, secs);
    return [day, `${date} ${month}`, `${hours}:${mins}:${secs}`];
}

function createDiv(detail) {
    console.log(detail);
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
    console.log(detail);
    let div = document.createElement('div');
    div.classList.add('result__container');
    div.innerHTML = `<div class="result__day">
    <p>${ myDate((detail.dt * 1000))[0] }</p></div>
    <figure><img src="http://openweathermap.org/img/wn/${detail.weather[0].icon}@2x.png" alt=""></figure>
    <p>${detail.main.temp}<sup>o</sup>C</p>
    <p>${detail.main.feels_like}<sup>o</sup></p>`
    return div;
}


// http://openweathermap.org/img/wn/13d@2x.png

// myDate(1611609846 * 1000);
// myDate(1611607316000);
// myDate(1611597563187);

// console.log(Date.now())