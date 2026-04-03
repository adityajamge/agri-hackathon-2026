import type {
  AlertItem,
  CommunityReport,
  CropOption,
  ForecastDay,
  QuickMetric,
  RegionalHotspot,
  ScanDiagnosis,
  ScanHistoryItem,
  UserProfile,
  WeatherSnapshot,
} from "../types/app";

export const cropOptions: CropOption[] = [
  { id: "rice", name: "Rice", shortCode: "RI", climate: "Humid lowland" },
  {
    id: "wheat",
    name: "Wheat",
    shortCode: "WH",
    climate: "Dry and cool",
  },
  {
    id: "cotton",
    name: "Cotton",
    shortCode: "CT",
    climate: "Warm and semi dry",
  },
  {
    id: "tomato",
    name: "Tomato",
    shortCode: "TO",
    climate: "Moderate and humid",
  },
  {
    id: "soybean",
    name: "Soybean",
    shortCode: "SB",
    climate: "Warm monsoon",
  },
  {
    id: "chili",
    name: "Chili",
    shortCode: "CH",
    climate: "Hot and dry",
  },
];

export const weatherNow: WeatherSnapshot = {
  temperatureC: 31,
  humidityPct: 87,
  rainfallMm: 14,
  windKph: 11,
  summary: "High humidity with intermittent rain.",
};

export const quickMetrics: QuickMetric[] = [
  { label: "Regional risk", value: "High", trend: "up" },
  { label: "Nearby reports", value: "12", trend: "up" },
  { label: "Safe spray window", value: "6 hrs", trend: "steady" },
  { label: "Leaf wetness", value: "4.1 hrs", trend: "up" },
];

export const urgentAlerts: AlertItem[] = [
  {
    id: "a1",
    title: "Late blight pattern rising",
    crop: "Tomato",
    issue: "Late Blight",
    distanceKm: 3.4,
    severity: "high",
    reported: "2h ago",
  },
  {
    id: "a2",
    title: "Aphid swarm detected",
    crop: "Cotton",
    issue: "Aphids",
    distanceKm: 6.8,
    severity: "medium",
    reported: "6h ago",
  },
  {
    id: "a3",
    title: "Rust incidence trending down",
    crop: "Wheat",
    issue: "Leaf Rust",
    distanceKm: 8.2,
    severity: "low",
    reported: "1d ago",
  },
];

export const latestScan: ScanDiagnosis = {
  crop: "Tomato",
  issue: "Late Blight",
  confidence: 94,
  severity: "high",
  advisory: [
    "Remove heavily infected leaves from field edges first.",
    "Spray bio-fungicide in the evening when leaf surface is cool.",
    "Recheck humidity risk in 24 hours before repeat spray.",
  ],
  ecoOption: "Bacillus subtilis foliar spray every 5 days",
  chemicalOption: "Mancozeb 2 g/L as backup if spread continues",
  imageHint: "Dark water-soaked lesions with white fungal growth under leaf",
};

export const forecastWeek: ForecastDay[] = [
  {
    day: "Fri",
    tempMin: 25,
    tempMax: 33,
    humidity: 88,
    rainChance: 70,
    risk: "high",
    reason: "Humid + rain + warm night",
  },
  {
    day: "Sat",
    tempMin: 24,
    tempMax: 32,
    humidity: 85,
    rainChance: 58,
    risk: "high",
    reason: "Persistent leaf moisture",
  },
  {
    day: "Sun",
    tempMin: 23,
    tempMax: 31,
    humidity: 78,
    rainChance: 35,
    risk: "medium",
    reason: "Humidity easing",
  },
  {
    day: "Mon",
    tempMin: 22,
    tempMax: 30,
    humidity: 73,
    rainChance: 20,
    risk: "medium",
    reason: "Moderate fungal pressure",
  },
  {
    day: "Tue",
    tempMin: 21,
    tempMax: 29,
    humidity: 66,
    rainChance: 10,
    risk: "low",
    reason: "Drying trend",
  },
  {
    day: "Wed",
    tempMin: 22,
    tempMax: 30,
    humidity: 69,
    rainChance: 18,
    risk: "low",
    reason: "Stable weather",
  },
  {
    day: "Thu",
    tempMin: 23,
    tempMax: 31,
    humidity: 72,
    rainChance: 22,
    risk: "medium",
    reason: "Moisture starts rising",
  },
];

export const riskRules: string[] = [
  "Humidity above 80% for two days boosts fungal outbreak probability.",
  "Temperature between 25 C and 35 C accelerates pest life cycle.",
  "Rain above 10 mm with warm nights increases spore spread radius.",
  "Clusters of nearby reports push local risk score upward instantly.",
];

export const communityReports: CommunityReport[] = [
  {
    id: "r1",
    reporter: "Farmer S. Patil",
    crop: "Tomato",
    issue: "Late Blight",
    distanceKm: 2.3,
    time: "1h ago",
    severity: "high",
    note: "Spots on lower leaves spreading quickly after rain.",
  },
  {
    id: "r2",
    reporter: "Farmer A. More",
    crop: "Cotton",
    issue: "Aphids",
    distanceKm: 4.7,
    time: "4h ago",
    severity: "medium",
    note: "Clusters on new shoots; started neem spray.",
  },
  {
    id: "r3",
    reporter: "Farmer T. Deshmukh",
    crop: "Wheat",
    issue: "Leaf Rust",
    distanceKm: 7.9,
    time: "18h ago",
    severity: "low",
    note: "Early patches only, contained in one corner.",
  },
];

export const regionalHotspots: RegionalHotspot[] = [
  { id: "h1", x: 22, y: 30, label: "North Hamlet", severity: "high", reports: 5 },
  { id: "h2", x: 55, y: 44, label: "Canal Belt", severity: "medium", reports: 3 },
  { id: "h3", x: 73, y: 68, label: "Market Side", severity: "low", reports: 2 },
  { id: "h4", x: 40, y: 72, label: "South Ridge", severity: "high", reports: 4 },
];

export const scanHistory: ScanHistoryItem[] = [
  {
    id: "s1",
    issue: "Late Blight",
    crop: "Tomato",
    confidence: 94,
    date: "2026-04-03",
    outcome: "Action plan applied",
  },
  {
    id: "s2",
    issue: "Aphids",
    crop: "Cotton",
    confidence: 86,
    date: "2026-03-28",
    outcome: "Monitoring",
  },
  {
    id: "s3",
    issue: "Healthy Leaf",
    crop: "Soybean",
    confidence: 91,
    date: "2026-03-21",
    outcome: "No action needed",
  },
];

export const defaultProfile: UserProfile = {
  farmName: "Green Acre Farm",
  village: "Nandgaon",
  district: "Nashik",
  primaryCrop: "Tomato",
  language: "English",
};

export const issueOptions = [
  "Late Blight",
  "Leaf Miner",
  "Aphids",
  "Rust",
  "Unknown Spotting",
];