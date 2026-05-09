import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import WeatherCard from './components/WeatherCard';
import ForecastStrip from './components/ForecastStrip';
import ErrorMessage from './components/ErrorMessage';
import WeatherSkeleton from './components/Skeleton';
import ThemeToggle from './components/ThemeToggle';
import { useWeather } from './hooks/useWeather';

const UNIT_KEY  = 'weather_unit';
const THEME_KEY = 'weather_theme';

const App = () => {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState(() => localStorage.getItem(UNIT_KEY) || 'C');
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');
  const [geoLoading, setGeoLoading] = useState(false);

  const {
    weatherData,
    forecastData,
    hourlyData,
    status,
    history,
    fetchWeather,
    removeFromHistory,
  } = useWeather();

  // Apply dark class to body
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Auto-fetch city from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get('city');
    if (urlCity) fetchWeather(urlCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(() => {
    if (!city.trim()) return;
    fetchWeather(city.trim());
    setCity('');
  }, [city, fetchWeather]);

  const handleCityChange = useCallback((value) => setCity(value), []);

  const handleHistorySelect = useCallback(
    (selectedCity) => fetchWeather(selectedCity),
    [fetchWeather]
  );

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        fetchWeather(`${latitude},${longitude}`);
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        fetchWeather(null, 'Location access denied. Please search manually.');
      }
    );
  }, [fetchWeather]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      localStorage.setItem(UNIT_KEY, next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return (
    <div className="screen">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="top-header">
        <div className="logo" aria-hidden="true">🌦️</div>
        <div className="title-section">
          <h1>Live Weather Dashboard</h1>
          <p>Real-time Weather Intelligence</p>
        </div>
        <div className="header-controls">
          <button
            className="unit-toggle"
            onClick={toggleUnit}
            aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
            title="Toggle temperature unit"
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </div>

      {/* ── Main panel ─────────────────────────────────────────────────── */}
      <div className="main">
        <SearchHistory
          history={history}
          onSelect={handleHistorySelect}
          onRemove={removeFromHistory}
        />

        <SearchBar
          city={city}
          setCity={handleCityChange}
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          geoLoading={geoLoading}
        />

        {status.error && <ErrorMessage message={status.error} />}

        {status.loading && <WeatherSkeleton />}

        {!weatherData && !status.loading && !status.error && (
          <p className="empty-state">🔍 Enter a city to check weather</p>
        )}

        {weatherData && !status.loading && (
          <>
            <WeatherCard weatherData={weatherData} unit={unit} />

            {hourlyData.length > 0 && (
              <ForecastStrip
                forecastData={hourlyData}
                unit={unit}
                title="Next 6 Hours"
              />
            )}

            <ForecastStrip
              forecastData={forecastData}
              unit={unit}
              title="5-Day Forecast"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
