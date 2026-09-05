export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type Severity = "Mild" | "Moderate" | "Severe";
export type CaseStatus = "Pending" | "Under Review" | "Confirmed" | "Corrected" | "Referred" | "More Info Requested";
export type Lang = "en" | "hi" | "mr";
export type ThreatType = "disease" | "pest";
export type CropStage = "Seedling" | "Vegetative" | "Flowering" | "Fruiting" | "Maturity";

export interface District {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
}

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  season: string;
  stages: CropStage[];
}

export interface Threat {
  id: string;
  name: string;
  type: ThreatType;
  scientific: string;
  crops: string[];
  symptoms: string[];
  favours: string;
  color: string;
}

export interface Hotspot {
  id: string;
  districtId: string;
  cropId: string;
  threatId: string;
  cases: number;
  risk: RiskLevel;
  trend7d: number;
  lat: number;
  lng: number;
  radiusKm: number;
  lastReported: string;
}

export interface WeatherDay {
  day: string;
  date: string;
  temp: number;
  tempMin: number;
  humidity: number;
  rain: number;
  wind: number;
  condition: "Sunny" | "Cloudy" | "Rain" | "Showers" | "Overcast" | "Storm";
}

export interface WeatherSnapshot {
  districtId: string;
  temp: number;
  humidity: number;
  rain24h: number;
  rain72h: number;
  wind: number;
  windDir: string;
  condition: WeatherDay["condition"];
  updatedAt: string;
  forecast: WeatherDay[];
}

export interface SoilCard {
  soilType: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  ec: number;
  zinc: number;
  lastTest: string;
  testedBy: string;
  cardId: string;
}

export interface Plot {
  id: string;
  name: string;
  areaHa: number;
  cropId: string;
  stage: CropStage;
  sownOn: string;
  irrigation: string;
}

export interface Farmer {
  id: string;
  name: string;
  nameLocal: string;
  mobile: string;
  village: string;
  taluka: string;
  districtId: string;
  landHa: number;
  plots: Plot[];
  soil: SoilCard;
  cropHistory: { season: string; cropId: string; yield: string; issue?: string }[];
  registeredOn: string;
  avatarHue: number;
}

export interface DiagnosisResult {
  threatId: string;
  confidence: number;
  severity: Severity;
  affectedArea: number;
  symptoms: string[];
  reasoning: string[];
  alternatives: { threatId: string; confidence: number }[];
  modelVersion: string;
  inferenceMs: number;
}

export interface CropCase {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  districtId: string;
  cropId: string;
  stage: CropStage;
  image: string;
  imageLabel: string;
  createdAt: string;
  updatedAt: string;
  ai: DiagnosisResult;
  risk: RiskLevel;
  riskScore: number;
  status: CaseStatus;
  expertNote?: string;
  expertThreatId?: string;
  expertName?: string;
  followUpDue?: string;
  followUps: { date: string; note: string; improved: boolean }[];
  source: "seed" | "farmer";
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  org: string;
  districtId: string;
  phone: string;
  specialisation: string[];
  distanceKm: number;
  available: boolean;
  languages: Lang[];
}

export interface Alert {
  id: string;
  level: RiskLevel;
  title: string;
  body: string;
  districtId: string;
  cropId?: string;
  threatId?: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface CropInsurance {
  policyNumber: string;
  farmerId: string;
  cropId: string;
  provider: string;
  scheme: string;
  season: string;
  coverage: number;
  status: "Active" | "Pending" | "Expired";
  validFrom: string;
  validTo: string;
  plotId: string;
  addedOn: string;
}
