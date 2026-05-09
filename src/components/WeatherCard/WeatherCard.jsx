import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getAQIDesc } from '../../utils/aqi';
import { formatTemp } from '../../utils/units';
import './WeatherCard.css';

const WeatherCard = ({ weatherData, unit }) => {
    const { city, country, icon, temperature, feelsLike, condition, wind, humidity, aqi } =
        weatherData;

    const aqiInfo = getAQIDesc(aqi);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const url = `${window.location.origin}${window.location.pathname}?city=${encodeURIComponent(city)}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="card card-enter">
            {/* Header: city + share */}
            <div className="card-header">
                <div className="card-title-row">
                    <h2 className="weather-city-text">
                        {city}
                        {country && <span className="weather-country">, {country}</span>}
                    </h2>
                    <button
                        className="share-btn"
                        onClick={handleShare}
                        aria-label="Copy shareable link"
                        title="Share this city's weather"
                    >
                        {copied ? <span className="share-copied">Copied!</span> : '🔗'}
                    </button>
                </div>
                <p className="weather-condition-pill">{condition}</p>
            </div>

            {/* Icon + temp */}
            <div className="weather-main">
                {icon && <img src={icon} alt={condition} className="weather-icon" />}
                <div className="weather-temp-pill temp-animated">{formatTemp(temperature, unit)}</div>
            </div>

            {/* Stat boxes */}
            <div className="stats">
                <div className="stat-box">
                    <span className="stat-content">
                        🌡️ Feels Like &nbsp;
                        <span className="temp-animated">{formatTemp(feelsLike, unit)}</span>
                    </span>
                </div>
                <div className="stat-box">
                    <span className="stat-content">💨 Wind &nbsp;{wind} km/h</span>
                </div>
                <div className="stat-box">
                    <span className="stat-content">💧 Humidity &nbsp;{humidity}%</span>
                </div>
            </div>

            {/* AQI badge — fixed contrast */}
            {aqi && (
                <div
                    className="aqi-badge"
                    style={{ borderLeft: `5px solid ${aqiInfo.color}` }}
                >
                    <span className="aqi-dot" style={{ backgroundColor: aqiInfo.color }} />
                    <div className="aqi-content">
                        <span className="aqi-label">Air Quality Index: {aqi}</span>
                        <p className="aqi-text">{aqiInfo.text}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

WeatherCard.propTypes = {
    weatherData: PropTypes.shape({
        city: PropTypes.string.isRequired,
        country: PropTypes.string,
        icon: PropTypes.string,
        temperature: PropTypes.number.isRequired,
        feelsLike: PropTypes.number.isRequired,
        condition: PropTypes.string.isRequired,
        wind: PropTypes.number.isRequired,
        humidity: PropTypes.number.isRequired,
        aqi: PropTypes.number,
    }).isRequired,
    unit: PropTypes.oneOf(['C', 'F']).isRequired,
};

export default WeatherCard;
