import React from 'react';
import './WeatherSkeleton.css';

const WeatherSkeleton = () => (
    <div className="skeleton-wrapper" aria-label="Loading weather data" role="status">
        {/* City name */}
        <div className="skeleton-base skeleton-city" />
        {/* Condition pill */}
        <div className="skeleton-base skeleton-pill" />
        {/* Icon circle */}
        <div className="skeleton-base skeleton-icon" />
        {/* Temp pill */}
        <div className="skeleton-base skeleton-temp" />
        {/* Stat boxes */}
        <div className="skeleton-stats">
            <div className="skeleton-base skeleton-stat" />
            <div className="skeleton-base skeleton-stat" />
            <div className="skeleton-base skeleton-stat" />
        </div>
        {/* Forecast row */}
        <div className="skeleton-forecast-row">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-base skeleton-forecast-card" />
            ))}
        </div>
    </div>
);

export default WeatherSkeleton;
