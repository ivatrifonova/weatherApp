import axios from "axios";
import cityTimezones from "city-timezones";

export const getWeather = async (town) => {
  return await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=f880ab8e8a5f8d21893b60d15734d506`
    )
    .then((response) => {
      if (response.cod > 299) {
        return new Error(response.message);
      } else {
        return response.data;
      }
    });
};

export const getDateTime = async (town) => {
  const cityLookup = cityTimezones.lookupViaCity(town);

  return await axios
    .get(
      `https://www.timeapi.io/api/Time/current/coordinate?latitude=${cityLookup[0].lat}&longitude=${cityLookup[0].lng}`
    )
    .then((response) => {
      if (response.status > 299) {
        return new Error(response.message);
      } else {
        return response.data;
      }
    });
};
