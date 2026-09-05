import type { CropStage, Lang, RiskLevel, SoilCard, WeatherSnapshot } from "./types";
import { clamp } from "./utils";

export interface RiskInput {
  weather: WeatherSnapshot;
  cropId: string;
  stage: CropStage;
  threatId?: string;
  soil?: SoilCard;
  localCases?: number;
}

export interface RiskFactor {
  label: string;
  value: string;
  contribution: number;
  direction: "up" | "down" | "neutral";
}

export interface RiskOutput {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  explanation: string;
  explanations: Record<Lang, string>;
  trend: { day: string; date: string; score: number; level: RiskLevel }[];
}

const FUNGAL = new Set(["early-blight", "late-blight", "powdery-mildew", "downy-mildew", "leaf-spot"]);

export function levelFor(score: number): RiskLevel {
  if (score >= 66) return "HIGH";
  if (score >= 36) return "MEDIUM";
  return "LOW";
}

function dayScore(temp: number, humidity: number, rain: number, fungal: boolean) {
  let s = 0;
  if (fungal) {
    s += clamp((humidity - 55) * 1.2, 0, 32);
    s += clamp(rain * 1.0, 0, 18);
    s += temp >= 22 && temp <= 30 ? 12 : temp > 30 ? 4 : 7;
  } else {
    s += clamp((temp - 24) * 3.2, 0, 26);
    s += clamp((70 - humidity) * 0.5, 0, 14);
    s += rain > 12 ? -6 : 6;
    s += 12;
  }
  return s;
}

export function computeRisk(input: RiskInput): RiskOutput {
  const { weather, stage, threatId, soil, localCases = 0 } = input;
  const fungal = threatId ? FUNGAL.has(threatId) : true;
  const factors: RiskFactor[] = [];
  let score = dayScore(weather.temp, weather.humidity, weather.rain24h, fungal);

  factors.push({ label: "Humidity", value: `${weather.humidity}%`, contribution: fungal ? clamp((weather.humidity - 55) * 1.2, 0, 32) : clamp((70 - weather.humidity) * 0.5, 0, 14), direction: fungal ? (weather.humidity > 75 ? "up" : "neutral") : weather.humidity < 60 ? "up" : "neutral" });
  factors.push({ label: "Rainfall (24h)", value: `${weather.rain24h} mm`, contribution: fungal ? clamp(weather.rain24h * 1.0, 0, 18) : weather.rain24h > 12 ? -6 : 6, direction: fungal ? (weather.rain24h > 8 ? "up" : "neutral") : weather.rain24h > 12 ? "down" : "neutral" });
  factors.push({ label: "Temperature", value: `${weather.temp}°C`, contribution: fungal ? (weather.temp >= 22 && weather.temp <= 30 ? 12 : 6) : clamp((weather.temp - 24) * 3.2, 0, 26), direction: "up" });

  const stageBoost: Record<CropStage, number> = { Seedling: 5, Vegetative: 3, Flowering: 8, Fruiting: 8, Maturity: 4 };
  score += stageBoost[stage];
  factors.push({ label: "Crop stage", value: stage, contribution: stageBoost[stage], direction: stageBoost[stage] >= 8 ? "up" : "neutral" });

  if (soil) {
    const nLow = soil.nitrogen < 280;
    const ocLow = soil.organicCarbon < 0.5;
    const soilC = (nLow ? 4 : 0) + (ocLow ? 3 : 0) + (soil.ph > 8 || soil.ph < 6 ? 2 : 0);
    score += soilC;
    factors.push({ label: "Soil health", value: nLow ? "Low nitrogen" : "Balanced", contribution: soilC, direction: soilC > 0 ? "up" : "down" });
  }

  const caseC = clamp(localCases * 0.25, 0, 10);
  score += caseC;
  factors.push({ label: "Nearby cases (14 km)", value: `${localCases}`, contribution: caseC, direction: localCases > 10 ? "up" : "neutral" });

  score = Math.round(clamp(score, 4, 97));
  const level = levelFor(score);

  const trend = weather.forecast.map((d) => {
    const s = Math.round(clamp(dayScore(d.temp, d.humidity, d.rain, fungal) + stageBoost[stage] + caseC * 0.6, 4, 97));
    return { day: d.day, date: d.date, score: s, level: levelFor(s) };
  });

  const h = weather.humidity, r = weather.rain24h, tp = weather.temp;
  const kind = fungal ? (h > 75 && r > 8 ? "wet" : h > 70 ? "humid" : "dry") : tp > 30 && h < 65 ? "hot" : "moderate";
  const explanations: Record<Lang, string> = {
    en: {
      wet: `High humidity (${h}%) and recent rainfall (${r} mm) with ${tp}°C temperatures create ideal conditions for fungal spore germination and spread.`,
      humid: `Humidity is elevated at ${h}%. Leaf wetness during mornings can allow fungal infection even without heavy rain.`,
      dry: `Dry conditions (${h}% humidity) are limiting fungal activity. Keep monitoring lower leaves.`,
      hot: `Hot, dry conditions (${tp}°C, ${h}%) favour rapid insect multiplication and short generation cycles.`,
      moderate: `Moderate conditions. Pest populations are building slowly; trap counts decide the next action.`,
    }[kind],
    hi: {
      wet: `अधिक नमी (${h}%) और हाल की वर्षा (${r} मिमी) के साथ ${tp}°C तापमान फफूंद के बीजाणुओं के अंकुरण और फैलाव के लिए आदर्श स्थिति बनाते हैं।`,
      humid: `नमी ${h}% पर अधिक है। सुबह पत्तियों का गीलापन भारी बारिश के बिना भी फफूंद संक्रमण होने दे सकता है।`,
      dry: `सूखी स्थिति (${h}% नमी) फफूंद की गतिविधि को सीमित कर रही है। निचली पत्तियों की निगरानी जारी रखें।`,
      hot: `गर्म, सूखी स्थिति (${tp}°C, ${h}%) कीटों के तेज़ी से बढ़ने और छोटे जीवन-चक्र के अनुकूल है।`,
      moderate: `सामान्य स्थिति। कीट आबादी धीरे-धीरे बढ़ रही है; ट्रैप गिनती अगला कदम तय करेगी।`,
    }[kind],
    mr: {
      wet: `जास्त आर्द्रता (${h}%) आणि अलीकडील पाऊस (${r} मिमी) सोबत ${tp}°C तापमान बुरशीच्या बीजाणूंच्या उगवणीसाठी व प्रसारासाठी आदर्श परिस्थिती निर्माण करतात.`,
      humid: `आर्द्रता ${h}% इतकी जास्त आहे. सकाळी पानांवरील ओलावा जोरदार पावसाशिवायही बुरशी संसर्ग होऊ देऊ शकतो.`,
      dry: `कोरडी परिस्थिती (${h}% आर्द्रता) बुरशीची क्रिया मर्यादित ठेवत आहे. खालच्या पानांचे निरीक्षण सुरू ठेवा.`,
      hot: `उष्ण, कोरडी परिस्थिती (${tp}°C, ${h}%) कीटकांच्या जलद वाढीस आणि लहान जीवनचक्रास अनुकूल आहे.`,
      moderate: `मध्यम परिस्थिती. कीड संख्या हळूहळू वाढत आहे; सापळ्यातील संख्या पुढील कृती ठरवेल.`,
    }[kind],
  };
  const explanation = explanations.en;

  return { score, level, factors, explanation, explanations, trend };
}
