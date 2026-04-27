import React from 'react';

const WeatherCard = ({
  city,
  icon,
  temperature,
  feelsLike,
  condition,
  wind,
  humidity,
  aqi
}) => {
  
  const getAQIDesc = (index) => {
    const levels = {
      1: { text: "Good", color: "#4caf50" },
      2: { text: "Moderate", color: "#ffeb3b" },
      3: { text: "Unhealthy for Sensitive Groups", color: "#ff9800" },
      4: { text: "Unhealthy", color: "#f44336" },
      5: { text: "Very Unhealthy", color: "#9c27b0" },
      6: { text: "Hazardous", color: "#7e0023" }
    };
    return levels[index] || { text: "Unknown", color: "#999" };
  };

  const aqiInfo = getAQIDesc(aqi);
  const { text, color } = aqiInfo;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="weather-city-text">{city}</h2>
       <p 
        className="weather-condition-pill">
         {condition}
       </p>
      </div>

      <div className="weather-main">
        {icon && <img src={icon} alt={condition} className="weather-icon" />}
        <div className="temp-display">
          <div className="weather-temp-pill">
            {Math.round(temperature)}°C
          </div>
        </div>
      </div>

      {/* FIXED STATS SECTION */}
      <div className="stats">
        <div className="stat-box">
          <span className="stat-content">Feels Like 🌡️ {Math.round(feelsLike)}°C</span>
        </div>
        <div className="stat-box">
          <span className="stat-content">Wind Speed 💨 {wind} km/h</span>
        </div>
        <div className="stat-box">
          <span className="stat-content">Humidity 💧 {humidity}%</span>
        </div>
      </div>

      {aqi && (
        <div 
          className="aqi-badge" 
          style={{ borderLeft: `6px solid ${aqiInfo.color}`,backgroundColor: color, borderRadius:"20px",color:'blue',fontFamily:"emoji" }}
        >
          <span className="aqi-label">Air Quality Index: {aqi} </span>
          <div className="aqi-section">
    {/* Now 'text' and 'color' will work! */}
    <p > {text}</p>
  </div>
        </div>
        
      )}
    </div>
  );
};

export default WeatherCard;