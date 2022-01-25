import fs from "fs";
import express from "express";
import { createWeather, sendEmail } from "./utils.js";

const app = express();
const port = 3000;

let weather;

app.listen(port, async () => {
  console.log(`App listening on port ${port}`);

  weather = await createWeather();

  try {
    fs.appendFileSync("output.txt", weather.message);
  } catch (error) {
    throw new Error(error.message);
  }

  await sendEmail(weather.message);
  console.log(weather.message);
});

app.get("/", (req, res) => {
  if (weather) {
    res.send(JSON.stringify(weather.fullWeatherInformation));
  } else {
    res.send(JSON.stringify({ statusCode: 404 }));
  }
});
