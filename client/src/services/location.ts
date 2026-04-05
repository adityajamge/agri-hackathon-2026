import { apiRequest } from "./api";
import type { ReverseGeocodeLocation, ReverseGeocodeResponse } from "./models";

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeLocation> {
  const query = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });

  const response = await apiRequest<ReverseGeocodeResponse>(`/location/reverse?${query.toString()}`);
  return response.location;
}
