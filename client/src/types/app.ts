export type RiskLevel = "low" | "medium" | "high";

export interface CropOption {
  id: string;
  name: string;
  shortCode: string;
  climate: string;
}

export interface WeatherSnapshot {
  temperatureC: number;
  humidityPct: number;
  rainfallMm: number;
  windKph: number;
  summary: string;
}

export interface QuickMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "steady";
}

export interface AlertItem {
  id: string;
  title: string;
  crop: string;
  issue: string;
  distanceKm: number;
  severity: RiskLevel;
  reported: string;
}

export interface ScanDiagnosis {
  crop: string;
  issue: string;
  confidence: number;
  severity: RiskLevel;
  advisory: string[];
  ecoOption: string;
  chemicalOption: string;
  imageHint: string;
}

export interface ForecastDay {
  day: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  rainChance: number;
  risk: RiskLevel;
  reason: string;
}

export interface CommunityReport {
  id: string;
  reporter: string;
  crop: string;
  issue: string;
  distanceKm: number;
  time: string;
  severity: RiskLevel;
  note: string;
}

export interface RegionalHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  severity: RiskLevel;
  reports: number;
}

export interface ScanHistoryItem {
  id: string;
  issue: string;
  crop: string;
  confidence: number;
  date: string;
  outcome: string;
}

export interface UserProfile {
  farmName: string;
  village: string;
  district: string;
  primaryCrop: string;
  language: string;
}