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

  //  API key 
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
        setTcity(''); // Reset UI on error
        return;
      }

      // Destructuring values from API response
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

      // Updating State Variables
      setTcity(name);
      setTemperature(temp_c);
      setFeelsLike(feelslike_c);
      setWind(wind_kph);
      setHumidity(humidity);
      setCondition(text);
      setAQI(air_quality["us-epa-index"]);
      
      // Ensure the icon URL has the proper protocol
      setIcon(`https:${icon}`);

    } catch (err) {
      setError("Failed to fetch weather data");
      setTcity('');
    } finally {
      setLoading(false);
    }
  };

  const checkWeather = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    fetchWeather(city.trim());
    setCity(''); // Clear the input field after searching
  };

  return (
    <div className="screen">
  {/* SEPARATED HEADER */}
  <div className="top-header">
    <div className="logo">🌦️</div>
    <div className="title-section">
      <h1>Live Weather Data</h1>
      <p >Real-time Weather Intelligence</p>
    </div>
  </div>

  {/* MAIN DASHBOARD CONTAINER */}
  <div className="main">
    <SearchBar
      city={city}
      setCity={setCity}
      onSearch={checkWeather}
    />

    {loading && <Loader />}
    
    {error && <ErrorMessage message={error} />}

    {!tcity && !loading && !error && (
      <p style={{ marginTop: "20px", textAlign: "center", color: "#0b49e6",fontSize:"20px" }}>
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