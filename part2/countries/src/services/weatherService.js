import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeather = (city) =>
  axios
    .get(BASE_URL, {
      params: {
        q: city,
        units: 'metric',
        appid: API_KEY,
      },
    })
    .then((response) => response.data);
