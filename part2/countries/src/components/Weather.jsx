import { useState, useEffect } from 'react';
import * as weatherService from '../services/weatherService';

export const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    if (!city) return;

    setWeatherData(null);
    setWeatherError(false);

    weatherService
      .getWeather(city)
      .then(setWeatherData)
      .catch((error) => {
        console.error('Fetch weather failed:', error);
        setWeatherError(true);
      });
  }, [city]);

  return (
    <>
      <h2>Weather in {city}</h2>
      {weatherError ? (
        <p style={{ color: 'red' }}>Could not load weather data.</p>
      ) : weatherData ? (
        <>
          <p>Temperature: {weatherData.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>Wind: {weatherData.wind.speed} m/s</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </>
  );
};
