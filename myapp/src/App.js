import './App.css';
import SearchBar from './components/SearchBar';
import ErrorMessage from './components/ErrorMessage';
import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';
import { useState } from 'react';

const App = () => {
  const [city, setCity] = useState('');
  const [tcity, setTcity] = useState('');

  const [temperature, setTemperature] = useState('');
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [condition, setCondition] = useState('');
  const [icon, setIcon] = useState('');
  const [aqi, setAQI] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "90b5c82a514d4b08ad2120836262604";

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&aqi=yes`
      );

      const data = await res.json();

      if (data.error) {
        setError("City not found");
        setTcity('');
        return;
      }

      const {
        location: { name },
        current: {
          temp_c,
          feelslike_c,
          humidity,
          wind_kph,
          condition: { text, icon },
          air_quality
        }
      } = data;

      setTcity(name);
      setTemperature(temp_c);
      setFeelsLike(feelslike_c);
      setWind(wind_kph);
      setHumidity(humidity);
      setCondition(text);
      setAQI(air_quality["us-epa-index"]);
      setIcon(`https:${icon}`);

    } catch (err) {
      setError("Failed to fetch weather data");
      setTcity('');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED SEARCH HANDLER
  const handleSearch = () => {
    if (!city || city.trim() === "") {
      setError("Please enter a city name");
      return;
    }

    setError("");
    fetchWeather(city.trim());
    setCity('');
  };

  // ✅ CLEAR CITY ON TYPING
  const handleCityChange = (value) => {
    setCity(value);
    if (error) setError('');
  };

  return (
    <div className="screen">

      {/* HEADER */}
      <div className="top-header">
        <div className="logo">🌦️</div>
        <div className="title-section">
          <h1>Live Weather Dashboard</h1>
          <p>Real-time Weather Intelligence</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <SearchBar
          city={city}
          setCity={handleCityChange}
          onSearch={handleSearch}
        />

        {/* ERROR MESSAGE */}
        {error && <ErrorMessage message={error} />}

        {loading && <Loader />}

        {!tcity && !loading && !error && (
          <p style={{ marginTop: "20px", textAlign: "center", color: "#0b49e6", fontSize: "20px" }}>
            🔍 Enter a city to check weather
          </p>
        )}

        {tcity && !loading && !error && (
          <WeatherCard
            city={tcity}
            icon={icon}
            temperature={temperature}
            feelsLike={feelsLike}
            condition={condition}
            wind={wind}
            humidity={humidity}
            aqi={aqi}
          />
        )}

      </div>
    </div>
  );
};

export default App;