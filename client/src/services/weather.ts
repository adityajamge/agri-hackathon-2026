import { apiRequest } from "./api";
import type { WeatherRiskResponse } from "./models";

export async function fetchWeatherRisk(lat: number, lon: number): Promise<WeatherRiskResponse> {
  const query = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });

  return apiRequest<WeatherRiskResponse>(`/weather?${query.toString()}`);
}
