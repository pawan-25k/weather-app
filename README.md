# 🌤️ Pro Weather Pro

**Pro Weather Pro** is a sleek, modern, and highly responsive weather application built with vanilla JavaScript. It provides real-time weather data, air quality insights, and detailed forecasts using the OpenWeatherMap API. Featuring a beautiful glassmorphism UI, it dynamically adapts its appearance based on the current weather conditions.

---

## ✨ Features

* **Real-Time Data:** Get current temperature, humidity, wind speed, atmospheric pressure, and visibility.
* **Air Quality Index (AQI):** Stay informed about local air quality levels (Good to Very Poor).
* **Dynamic Visuals:** * The background gradient changes automatically based on weather (Sunny, Cloudy, Rainy, Snowy).
    * Includes a **Dark/Light Mode** toggle that persists using `localStorage`.
* **Detailed Forecasts:**
    * **24-Hour Forecast:** Scrollable hourly updates.
    * **5-Day Forecast:** Daily temperature and condition overviews.
* **Smart Search:** * Search by city name.
    * **Geolocation Support:** One-click access to weather for your current location.
* **Unit Customization:** Toggle between **Metric (°C, km/h)** and **Imperial (°F, mph)** units.
* **Error Handling:** User-friendly error messages for invalid city names or denied location access.

---

## 🚀 Tech Stack

* **HTML5:** Semantic structure.
* **CSS3:** Custom properties, Flexbox, Grid, and Glassmorphism effects.
* **JavaScript (ES6+):** Asynchronous API fetching and DOM manipulation.
* **API:** [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather, 5-Day Forecast, and Air Pollution).

---

Site👉: https://weather-n-app.netlify.app/
---

## 📂 Project Structure

```text
.
├── index.html      # Application structure and layout
├── style.css       # Glassmorphism UI and dynamic theme styling
├── script.js      # API logic, UI updates, and theme management
└── README.md       # Project documentation
