import { apiRequest } from "./api";
import { getAuthToken } from "./session";
import type {
  CommunityReportsResponse,
  CreateCommunityReportPayload,
  CreateCommunityReportResponse,
} from "./models";

function getRequiredToken(providedToken?: string) {
  const token = providedToken || getAuthToken();
  if (!token) {
    throw new Error("Authentication token is missing. Please sign in again.");
  }

  return token;
}

export async function fetchCommunityReports(
  options: {
    limit?: number;
    latitude?: number;
    longitude?: number;
  } = {},
  token?: string,
) {
  const query = new URLSearchParams();

  if (typeof options.limit === "number") {
    query.set("limit", String(options.limit));
  }

  if (typeof options.latitude === "number" && typeof options.longitude === "number") {
    query.set("lat", String(options.latitude));
    query.set("lon", String(options.longitude));
  }

  const queryString = query.toString();
  const endpoint = queryString ? `/community/reports?${queryString}` : "/community/reports";

  return apiRequest<CommunityReportsResponse>(endpoint, {
    token: getRequiredToken(token),
  });
}

export async function createCommunityReport(payload: CreateCommunityReportPayload, token?: string) {
  return apiRequest<CreateCommunityReportResponse>("/community/reports", {
    method: "POST",
    token: getRequiredToken(token),
    body: payload,
  });
}
