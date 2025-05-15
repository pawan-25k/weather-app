const apiKey = '703be15c3de7cef205c81fb034f6066b';
let unit = 'metric'; // default to Celsius

function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }

    fetchWeatherData(`q=${city}`);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(`lat=${lat}&lon=${lon}`);
        }, () => {
            alert("Geolocation failed or is not allowed.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherData(query) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=${unit}`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) throw new Error("Weather data not available.");
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error(error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error("Forecast data not available.");
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error(error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const datetimeDiv = document.getElementById('datetime');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    datetimeDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const unitSymbol = unit === 'metric' ? '°C' : '°F';

        const temperatureHTML = `<p>${temperature}${unitSymbol}</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;
        const now = new Date().toLocaleString();

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        datetimeDiv.innerHTML = `As of: ${now}`;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    hourlyForecastDiv.innerHTML = '';

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours().toString().padStart(2, '0');
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const unitSymbol = unit === 'metric' ? '°C' : '°F';

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}${unitSymbol}</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function changeUnit() {
    const selected = document.querySelector('input[name="unit"]:checked').value;
    unit = selected;

    // Refresh weather if there's input or geolocation
    const city = document.getElementById('city').value;
    if (city) getWeather();
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
