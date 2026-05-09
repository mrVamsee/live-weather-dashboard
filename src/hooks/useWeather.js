import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../constants/api';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const HISTORY_KEY = 'weather_history';
const MAX_HISTORY = 5;

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
};

const saveHistory = (city, current) => {
  const filtered = current.filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  const updated = [city, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

/** Format epoch hour as "3 PM" / "11 AM" */
const formatHour = (timeStr) => {
  // timeStr from API: "2024-01-15 14:00"
  const hour = parseInt(timeStr.split(' ')[1].split(':')[0], 10);
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
};

/** Extract next 6 hours from forecastday[0].hour[] */
const extractHourly = (forecastday) => {
  const now = new Date();
  const currentHour = now.getHours();

  // Collect hours from today and tomorrow to handle end-of-day
  const todayHours = forecastday[0]?.hour || [];
  const tomorrowHours = forecastday[1]?.hour || [];
  const allHours = [...todayHours, ...tomorrowHours];

  return allHours
    .filter((h) => {
      const hHour = parseInt(h.time.split(' ')[1].split(':')[0], 10);
      const hDate = h.time.split(' ')[0];
      const todayDate = forecastday[0].date;
      // keep hours strictly after current hour today, or any hour tomorrow
      if (hDate === todayDate) return hHour > currentHour;
      return true;
    })
    .slice(0, 6)
    .map((h) => ({
      time: formatHour(h.time),
      temp: h.temp_c,
      condition: h.condition.text,
      icon: `https:${h.condition.icon}`,
    }));
};

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '' });
  const [history, setHistory] = useState(loadHistory);

  const fetchWeather = useCallback(async (cityName, overrideError) => {
    if (overrideError) {
      setStatus({ loading: false, error: overrideError });
      return;
    }

    if (!cityName || !cityName.trim()) {
      setStatus({ loading: false, error: 'Please enter a city name' });
      return;
    }

    setStatus({ loading: true, error: '' });
    setWeatherData(null);
    setForecastData([]);
    setHourlyData([]);

    try {
      const res = await fetch(
        `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
          cityName.trim()
        )}&days=5&aqi=yes`
      );

      const data = await res.json();

      if (data.error) {
        setStatus({ loading: false, error: 'City not found. Please try again.' });
        return;
      }

      const {
        location: { name, country },
        current: {
          temp_c,
          feelslike_c,
          humidity,
          wind_kph,
          condition: { text, icon },
          air_quality,
        },
        forecast: { forecastday },
      } = data;

      setWeatherData({
        city: name,
        country,
        temperature: temp_c,
        feelsLike: feelslike_c,
        humidity,
        wind: wind_kph,
        condition: text,
        icon: `https:${icon}`,
        aqi: air_quality['us-epa-index'],
      });

      setForecastData(
        forecastday.map((day) => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: `https:${day.day.condition.icon}`,
        }))
      );

      setHourlyData(extractHourly(forecastday));

      setHistory((prev) => saveHistory(name, prev));
      setStatus({ loading: false, error: '' });

      // Update URL without navigation
      window.history.replaceState(
        null,
        '',
        `?city=${encodeURIComponent(name)}`
      );
    } catch {
      setStatus({
        loading: false,
        error: 'Failed to fetch weather data. Check your connection.',
      });
    }
  }, []);

  const removeFromHistory = useCallback((cityName) => {
    setHistory((prev) => {
      const updated = prev.filter((c) => c !== cityName);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    weatherData,
    forecastData,
    hourlyData,
    status,
    history,
    fetchWeather,
    removeFromHistory,
  };
};
