export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  farmName: string;
  village: string;
  district: string;
  primaryCrop: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  farmName: string;
  village: string;
  district: string;
  primaryCrop: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface WeatherForecastDay {
  date: string;
  temperature: number;
  humidity: number;
  precipitation_sum_mm: number;
  precipitation_probability: number;
  rainfall_expected: boolean;
  weathercode: number | null;
  risk_level: RiskLevel;
  risk_reason: string;
}

export interface WeatherRiskResponse {
  temperature: number;
  humidity: number;
  rainfall_expected: boolean;
  risk_level: RiskLevel;
  risk_reason: string;
  forecast: WeatherForecastDay[];
}

export type TreatmentPlan = {
  biological?: string[];
  chemical?: string[];
  prevention?: string[];
  [key: string]: unknown;
};

export interface CropScanResult {
  id: string;
  userId: string;
  imageUrl: string;
  cropName: string | null;
  diseaseName: string;
  probability: number;
  confidence_percent: number;
  treatment: TreatmentPlan;
  isHealthy: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  cached: boolean;
}

export interface CropAnalyzeResponse {
  result: CropScanResult;
  raw_result?: unknown;
}

export interface CropHistoryResponse {
  history: CropScanResult[];
}
