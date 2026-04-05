const express = require("express");
const { z } = require("zod");
const { env } = require("../config/env");
const { HttpError } = require("../lib/httpError");
const { computeRiskLevel, buildRiskReason } = require("../lib/weatherRisk");

const router = express.Router();

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

function average(values) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function nearestHourIndex(hourlyTimes) {
  if (!Array.isArray(hourlyTimes) || hourlyTimes.length === 0) {
    return 0;
  }

  const now = Date.now();
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  hourlyTimes.forEach((time, index) => {
    const distance = Math.abs(new Date(time).getTime() - now);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

router.get("/", async (req, res, next) => {
  try {
    const query = querySchema.parse(req.query);

    const params = new URLSearchParams({
      latitude: String(query.lat),
      longitude: String(query.lon),
      hourly: "temperature_2m,relativehumidity_2m,precipitation_probability",
      daily: "weathercode,precipitation_sum",
      forecast_days: "7",
      timezone: "auto",
    });

    const weatherResponse = await fetch(`${env.OPEN_METEO_BASE_URL}/forecast?${params.toString()}`);

    if (!weatherResponse.ok) {
      const errorBody = await weatherResponse.text();
      throw new HttpError(502, "Failed to fetch weather forecast", errorBody);
    }

    const weatherData = await weatherResponse.json();
    const hourly = weatherData.hourly || {};
    const daily = weatherData.daily || {};

    const hourlyTimes = hourly.time || [];
    const hourlyTemp = hourly.temperature_2m || [];
    const hourlyHumidity = hourly.relativehumidity_2m || hourly.relative_humidity_2m || [];
    const hourlyPrecipProb = hourly.precipitation_probability || [];

    const currentIndex = nearestHourIndex(hourlyTimes);
    const currentTemp = Number(hourlyTemp[currentIndex] ?? 0);
    const currentHumidity = Number(hourlyHumidity[currentIndex] ?? 0);

    const forecastByDate = new Map();
    hourlyTimes.forEach((time, idx) => {
      const date = String(time).slice(0, 10);
      if (!forecastByDate.has(date)) {
        forecastByDate.set(date, []);
      }

      forecastByDate.get(date).push({
        temperature: Number(hourlyTemp[idx] ?? 0),
        humidity: Number(hourlyHumidity[idx] ?? 0),
        precipitationProbability: Number(hourlyPrecipProb[idx] ?? 0),
      });
    });

    const dailyDates = daily.time || [];
    const dailyWeatherCodes = daily.weathercode || [];
    const dailyPrecipitationSum = daily.precipitation_sum || [];

    const forecast = dailyDates.map((date, idx) => {
      const dayHourly = forecastByDate.get(String(date)) || [];
      const dayTemperature = average(dayHourly.map((entry) => entry.temperature));
      const dayHumidity = average(dayHourly.map((entry) => entry.humidity));
      const maxPrecipitationProbability = Math.max(
        0,
        ...dayHourly.map((entry) => entry.precipitationProbability),
      );
      const precipitationSum = Number(dailyPrecipitationSum[idx] ?? 0);
      const rainfallExpected = precipitationSum > 0 || maxPrecipitationProbability > 0;
      const riskLevel = computeRiskLevel({
        temperature: dayTemperature,
        humidity: dayHumidity,
        rainfallExpected,
      });

      return {
        date,
        temperature: Math.round(dayTemperature * 10) / 10,
        humidity: Math.round(dayHumidity),
        precipitation_sum_mm: Number(precipitationSum.toFixed(2)),
        precipitation_probability: Math.round(maxPrecipitationProbability),
        rainfall_expected: rainfallExpected,
        weathercode: dailyWeatherCodes[idx] ?? null,
        risk_level: riskLevel,
        risk_reason: buildRiskReason({
          riskLevel,
          humidity: dayHumidity,
          rainDayOffset: idx,
        }),
      };
    });

    const rainDayOffset = forecast.findIndex((day) => day.rainfall_expected);
    const rainfallExpectedSoon = rainDayOffset >= 0 && rainDayOffset <= 2;

    const currentRiskLevel = computeRiskLevel({
      temperature: currentTemp,
      humidity: currentHumidity,
      rainfallExpected: rainfallExpectedSoon,
    });

    return res.json({
      temperature: Math.round(currentTemp),
      humidity: Math.round(currentHumidity),
      rainfall_expected: rainfallExpectedSoon,
      risk_level: currentRiskLevel,
      risk_reason: buildRiskReason({
        riskLevel: currentRiskLevel,
        humidity: currentHumidity,
        rainDayOffset: rainDayOffset >= 0 ? rainDayOffset : undefined,
      }),
      forecast,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
