const apiKey = "703be15c3de7cef205c81fb034f6066b";
let unit = localStorage.getItem("unit") || "metric";

// Initialize UI
document.addEventListener("DOMContentLoaded", () => {
  // Load saved theme
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  
  // Set unit radio button
  document.getElementById(unit === "metric" ? "unit-c" : "unit-f").checked = true;

  // Add Enter key listener
  document.getElementById("city").addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeather();
  });
});

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function changeUnit() {
  unit = document.querySelector('input[name="unit"]:checked').value;
  localStorage.setItem("unit", unit);
  if (document.getElementById("city").value) getWeather();
}

function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) return alert("Please enter a city name");
  fetchWeatherData(`q=${city}`);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      fetchWeatherData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
    }, () => alert("Location access denied"));
  }
}

async function fetchWeatherData(query) {
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  try {
    // Current Weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${unit}`);
    const weatherData = await weatherRes.json();
    
    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    displayWeather(weatherData);
    fetchAQI(weatherData.coord.lat, weatherData.coord.lon);

    // Forecast (Hourly + Daily)
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=${unit}`);
    const forecastData = await forecastRes.json();
    
    displayHourlyForecast(forecastData.list);
    displayDailyForecast(forecastData.list);

  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    loader.style.display = "none";
  }
}

function displayWeather(data) {
  // Update Background Class
  document.body.className = document.body.classList.contains("dark") ? "dark" : "";
  const main = data.weather[0].main.toLowerCase();
  if (main.includes("clear")) document.body.classList.add("sunny");
  else if (main.includes("cloud")) document.body.classList.add("cloudy");
  else if (main.includes("rain") || main.includes("drizzle")) document.body.classList.add("rainy");
  else if (main.includes("snow")) document.body.classList.add("snowy");

  // Main Info
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  document.getElementById("temp-div").innerHTML = `<p>${Math.round(data.main.temp)}°</p>`;
  document.getElementById("city-name").innerText = data.name;
  document.getElementById("weather-desc").innerText = data.weather[0].description;
  document.getElementById("datetime").innerText = new Date().toLocaleString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' });

  // Stats
  document.getElementById("humidity").innerText = data.main.humidity;
  document.getElementById("wind").innerText = unit === "metric" ? (data.wind.speed * 3.6).toFixed(1) : data.wind.speed;
  document.getElementById("wind-unit").innerText = unit === "metric" ? "km/h" : "mph";
  document.getElementById("feels").innerText = Math.round(data.main.feels_like);
  document.getElementById("pressure").innerText = data.main.pressure;
  document.getElementById("visibility").innerText = (data.visibility / 1000).toFixed(1);
}

function fetchAQI(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const aqiMap = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
      document.getElementById("aqi").innerText = aqiMap[data.list[0].main.aqi - 1];
    });
}

function displayHourlyForecast(list) {
  const container = document.getElementById("hourly-forecast");
  container.innerHTML = "";
  list.slice(0, 8).forEach(item => {
    const time = new Date(item.dt * 1000).getHours() + ":00";
    container.innerHTML += `
      <div class="hourly-item">
        <div>${time}</div>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <b>${Math.round(item.main.temp)}°</b>
      </div>`;
  });
}

function displayDailyForecast(list) {
  const container = document.getElementById("daily-forecast");
  container.innerHTML = "";
  
  // Filter for mid-day readings (12:00:00) to represent the day
  const dailyData = list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    container.innerHTML += `
      <div class="daily-item">
        <div>${day}</div>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <div><b>${Math.round(item.main.temp)}°</b></div>
      </div>`;
  });
}
