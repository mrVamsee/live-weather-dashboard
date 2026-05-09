import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_BASE = 'https://api.weatherapi.com/v1';
const RECENT_KEY = 'weatherRecentCities';
const MAX_RECENT = 5;

/* ---------- helpers ---------- */
function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}

function saveRecent(list) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

function addRecent(city, current) {
  const filtered = current.filter(c => c.toLowerCase() !== city.toLowerCase());
  const next = [city, ...filtered].slice(0, MAX_RECENT);
  saveRecent(next);
  return next;
}

function iconUrl(raw) {
  if (!raw) return '';
  return raw.startsWith('http') ? raw : 'https:' + raw;
}

/* Parse "YYYY-MM-DD HH:MM" → hour number 0-23 */
function parseHour(timeStr) {
  return parseInt(timeStr.split(' ')[1].split(':')[0], 10);
}

/* "YYYY-MM-DD HH:MM" → "3 PM" */
function formatHourLabel(timeStr) {
  const h = parseHour(timeStr);
  if (h === 0)  return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

/* forecastday[0].date "YYYY-MM-DD" → "MON" etc, idx 0 → "TODAY" */
function dayLabel(dateStr, idx) {
  if (idx === 0) return 'TODAY';
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  return days[new Date(dateStr + 'T12:00:00').getDay()];
}

/* Get next 6 hours from the hourly array using localtime */
function getNext6Hours(forecastday, localtime) {
  const currentHour = parseHour(localtime);
  const todayHours   = forecastday[0]?.hour || [];
  const tomorrowHours = forecastday[1]?.hour || [];
  const all = [...todayHours, ...tomorrowHours];
  const future = all.filter(h => {
    const hDate = h.time.split(' ')[0];
    const tDate = forecastday[0].date;
    const hHour = parseHour(h.time);
    if (hDate === tDate) return hHour > currentHour;
    return true;
  });
  return future.slice(0, 6);
}

/* ---------- skeleton pieces ---------- */
function SkeletonBlock({ w, h, radius }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: radius || 8 }}
    />
  );
}

function SkeletonLoader() {
  return (
    <div className="skeleton-wrap">
      <SkeletonBlock w="55%" h={36} radius={8} />
      <SkeletonBlock w="40%" h={72} radius={12} />
      <SkeletonBlock w="100%" h={48} radius={12} />
      <SkeletonBlock w="100%" h={48} radius={12} />
      <SkeletonBlock w="100%" h={48} radius={12} />
      <div className="skeleton-row">
        {[1,2,3,4,5,6].map(i => <SkeletonBlock key={i} w={72} h={100} radius={16} />)}
      </div>
      <div className="skeleton-row">
        {[1,2,3,4,5].map(i => <SkeletonBlock key={i} w={80} h={110} radius={16} />)}
      </div>
    </div>
  );
}

/* ---------- main component ---------- */
export default function App() {
  const [query, setQuery]           = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [recent, setRecent]         = useState(loadRecent);

  /* Auto-load from URL ?city= on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get('city');
    if (urlCity) fetchWeather(urlCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = useCallback(async (cityName) => {
    const trimmed = (cityName || '').trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(trimmed)}&days=5&aqi=no&alerts=no`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error.message || 'City not found. Please try again.');
        setLoading(false);
        return;
      }

      setWeatherData(data);
      setRecent(prev => addRecent(data.location.name, prev));

      /* Update URL without navigation */
      window.history.replaceState(null, '', `?city=${encodeURIComponent(data.location.name)}`);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(query);
    setQuery('');
  };

  const removeRecent = (city, e) => {
    e.stopPropagation();
    setRecent(prev => {
      const next = prev.filter(c => c !== city);
      saveRecent(next);
      return next;
    });
  };

  /* Derived display data — only read when weatherData is set */
  const loc      = weatherData?.location;
  const cur      = weatherData?.current;
  const forecast = weatherData?.forecast?.forecastday || [];
  const hours    = weatherData ? getNext6Hours(forecast, loc.localtime) : [];

  return (
    <div className="app">
      <div className="container">

        {/* ── App title ─────────────────────────────────────────── */}
        <div className="app-title">
          <span className="app-icon">🌦️</span>
          <div>
            <h1>Live Weather</h1>
            <p className="app-subtitle">Real-time weather intelligence</p>
          </div>
        </div>

        {/* ── Search bar ────────────────────────────────────────── */}
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter city name..."
            autoComplete="off"
            spellCheck="false"
          />
          <button className="search-btn" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Search'}
          </button>
        </form>

        {/* ── Error ─────────────────────────────────────────────── */}
        {error && <p className="error-msg">⚠ {error}</p>}

        {/* ── Recent cities ─────────────────────────────────────── */}
        {recent.length > 0 && (
          <div className="recent-row">
            <span className="recent-label">Recent:</span>
            <div className="chips">
              {recent.map(city => (
                <div
                  key={city}
                  className="chip"
                  onClick={() => fetchWeather(city)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && fetchWeather(city)}
                >
                  <span className="chip-name">{city}</span>
                  <button
                    className="chip-remove"
                    onClick={e => removeRecent(city, e)}
                    aria-label={`Remove ${city}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Skeleton ──────────────────────────────────────────── */}
        {loading && <SkeletonLoader />}

        {/* ── Empty state ───────────────────────────────────────── */}
        {!loading && !weatherData && !error && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>Search for a city to see the weather</p>
          </div>
        )}

        {/* ── Weather data ──────────────────────────────────────── */}
        {!loading && weatherData && (
          <div className="weather-wrap fade-in">

            {/* Current weather card */}
            <div className="card current-card">
              <div className="current-top">
                <div>
                  <h2 className="city-name">{loc.name}</h2>
                  <p className="country-name">{loc.country}</p>
                  <p className="condition-text">{cur.condition.text}</p>
                </div>
                <img
                  className="condition-icon"
                  src={iconUrl(cur.condition.icon)}
                  alt={cur.condition.text}
                />
              </div>

              <div className="temp-display">
                {Math.round(cur.temp_c)}<span className="temp-unit">°C</span>
              </div>

              <div className="stats">
                <div className="stat-row">
                  <span className="stat-label">🌡️ Feels Like</span>
                  <span className="stat-value">{Math.round(cur.feelslike_c)}°C</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">💨 Wind Speed</span>
                  <span className="stat-value">{cur.wind_kph} km/h</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">💧 Humidity</span>
                  <span className="stat-value">{cur.humidity}%</span>
                </div>
              </div>
            </div>

            {/* Hourly strip */}
            {hours.length > 0 && (
              <div className="strip-section">
                <h3 className="strip-title">Next 6 Hours</h3>
                <div className="strip-scroll">
                  {hours.map((h, i) => (
                    <div className="strip-card" key={i}>
                      <span className="strip-label">{formatHourLabel(h.time)}</span>
                      <img
                        className="strip-icon"
                        src={iconUrl(h.condition.icon)}
                        alt={h.condition.text}
                      />
                      <span className="strip-value">{Math.round(h.temp_c)}°C</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5-day forecast strip */}
            {forecast.length > 0 && (
              <div className="strip-section">
                <h3 className="strip-title">5-Day Forecast</h3>
                <div className="strip-scroll forecast-grid">
                  {forecast.map((day, i) => (
                    <div className="strip-card" key={day.date}>
                      <span className="strip-label">{dayLabel(day.date, i)}</span>
                      <img
                        className="strip-icon"
                        src={iconUrl(day.day.condition.icon)}
                        alt={day.day.condition.text}
                      />
                      <span className="strip-value">{Math.round(day.day.maxtemp_c)}°C</span>
                      <span className="strip-low">{Math.round(day.day.mintemp_c)}°C</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
