# 🌦️ Live Weather Dashboard

A real-time weather application built with React 18, powered by WeatherAPI.com.

**Live Demo:** [your-app.vercel.app](https://your-app.vercel.app) ← _replace after deploy_

---

## Features

- 🔍 Real-time weather for any city worldwide
- 📍 Geolocation — detect your city automatically
- 📅 5-day forecast strip with high/low temperatures
- 🌫️ Air Quality Index (AQI) with US EPA classification
- 🕐 Search history — last 5 cities, stored in localStorage
- 🌡️ °C / °F toggle — preference saved across sessions
- 💀 Skeleton loader — shimmer placeholder while fetching
- 📱 Responsive glassmorphism UI

---

## Tech Stack

React 18 · Create React App · WeatherAPI.com · CSS3 · Vercel

---

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app/Weather
   ```

2. Create a `.env` file in the `Weather/` directory:
   ```
   REACT_APP_WEATHER_API_KEY=your_weatherapi_key_here
   ```
   Get a free key at [weatherapi.com](https://www.weatherapi.com/)

3. Install dependencies and start:
   ```bash
   npm install
   npm start
   ```

The app runs at `http://localhost:3000`.

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `Weather`
4. Add the environment variable `REACT_APP_WEATHER_API_KEY` in Vercel's project settings
5. Deploy — `vercel.json` handles SPA routing automatically

---

## Project Structure

```
src/
  components/
    ErrorMessage/
    ForecastStrip/
    SearchBar/
    SearchHistory/
    Skeleton/
    WeatherCard/
    __tests__/
  hooks/
    useWeather.js
  utils/
    aqi.js
    units.js
  constants/
    api.js
  App.js
  App.css
  index.js
```

---

## Screenshot

_Add a screenshot here after first deploy_

---

## License

MIT
