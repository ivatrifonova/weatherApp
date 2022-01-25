import fs from "fs";
import { getDateTime, getWeather } from "./requests.js";
import nodemailer from "nodemailer";

export const convertWeather = (weatherData) => {
  const kelvinUnit = 273.15;
  const temp = Math.round(weatherData.main.temp - kelvinUnit);
  const feelsLike = Math.round(weatherData.main.feels_like - kelvinUnit);
  const tempMin = Math.round(weatherData.main.temp_min - kelvinUnit);
  const tempMax = Math.round(weatherData.main.temp_max - kelvinUnit);

  return { temp, feelsLike, tempMin, tempMax };
};

export const createMessage = (weather, name) => {
  return `The weather for today (${weather.date} ${weather.time}) in ${name} is: 
   Temperature: ${weather.temp} °C
   Minimal Temperature: ${weather.tempMin} °C
   Maximal Temperature: ${weather.tempMax} °C
   Feels like: ${weather.feelsLike} °C
   `;
};

export const createWeather = async () => {
  let weatherData;
  let dateTime;
  let userData;

  try {
    userData = JSON.parse(fs.readFileSync("./data.json", "utf8"));
    weatherData = await getWeather(userData.town);
    dateTime = await getDateTime(weatherData.name);
  } catch (error) {
    throw new Error(error.message);
  }
   
  const convertedCurrentWeather = convertWeather(weatherData);
  const fullWeatherInformation = {
    ...convertedCurrentWeather,
    ...{ date: dateTime.date, time: dateTime.time },
  };
  const message = createMessage(fullWeatherInformation, weatherData.name);

  return { fullWeatherInformation, message };
};

export const sendEmail = async (message) => {
  let userData;
  try {
    userData = JSON.parse(fs.readFileSync("./data.json", "utf8"));
  } catch (error) {
    throw new Error(error.message);
  }

  if (userData.email) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ivaweatherappmail@gmail.com",
        pass: "Nodemailer!z1",
      },
    });

    await transporter.sendMail({
      from: "Iva <ivaweatherappmail@gmail.com>",
      to: userData.email,
      subject: "Weather for today",
      text: message,
    });
  }
  return;
};
