import type { WeatherSnapshot, WeatherDay } from "../types";

const mk = (day: string, date: string, temp: number, tempMin: number, humidity: number, rain: number, wind: number, condition: WeatherDay["condition"]): WeatherDay => ({ day, date, temp, tempMin, humidity, rain, wind, condition });

export const WEATHER: Record<string, WeatherSnapshot> = {
  nashik: {
    districtId: "nashik", temp: 29, humidity: 82, rain24h: 18, rain72h: 41, wind: 14, windDir: "SW", condition: "Showers",
    updatedAt: "2026-09-05T09:00:00+05:30",
    forecast: [
      mk("Fri", "05 Sep", 29, 22, 82, 18, 14, "Showers"),
      mk("Sat", "06 Sep", 28, 22, 86, 24, 16, "Rain"),
      mk("Sun", "07 Sep", 27, 21, 88, 31, 18, "Rain"),
      mk("Mon", "08 Sep", 28, 21, 84, 12, 13, "Overcast"),
      mk("Tue", "09 Sep", 30, 22, 76, 4, 11, "Cloudy"),
      mk("Wed", "10 Sep", 31, 23, 68, 0, 10, "Sunny"),
      mk("Thu", "11 Sep", 32, 23, 62, 0, 9, "Sunny"),
    ],
  },
  pune: {
    districtId: "pune", temp: 26, humidity: 78, rain24h: 9, rain72h: 22, wind: 12, windDir: "W", condition: "Cloudy",
    updatedAt: "2026-09-05T09:00:00+05:30",
    forecast: [
      mk("Fri", "05 Sep", 26, 20, 78, 9, 12, "Cloudy"),
      mk("Sat", "06 Sep", 25, 20, 84, 16, 14, "Showers"),
      mk("Sun", "07 Sep", 25, 19, 86, 21, 15, "Rain"),
      mk("Mon", "08 Sep", 26, 20, 80, 8, 12, "Overcast"),
      mk("Tue", "09 Sep", 27, 20, 72, 2, 10, "Cloudy"),
      mk("Wed", "10 Sep", 28, 21, 66, 0, 9, "Sunny"),
      mk("Thu", "11 Sep", 29, 21, 60, 0, 9, "Sunny"),
    ],
  },
  jalgaon: {
    districtId: "jalgaon", temp: 33, humidity: 58, rain24h: 0, rain72h: 3, wind: 9, windDir: "NW", condition: "Sunny",
    updatedAt: "2026-09-05T09:00:00+05:30",
    forecast: [
      mk("Fri", "05 Sep", 33, 24, 58, 0, 9, "Sunny"),
      mk("Sat", "06 Sep", 34, 25, 55, 0, 10, "Sunny"),
      mk("Sun", "07 Sep", 33, 24, 61, 2, 11, "Cloudy"),
      mk("Mon", "08 Sep", 32, 24, 66, 6, 12, "Cloudy"),
      mk("Tue", "09 Sep", 31, 23, 70, 10, 12, "Showers"),
      mk("Wed", "10 Sep", 31, 23, 64, 3, 10, "Cloudy"),
      mk("Thu", "11 Sep", 32, 24, 58, 0, 9, "Sunny"),
    ],
  },
  nagpur: {
    districtId: "nagpur", temp: 32, humidity: 64, rain24h: 2, rain72h: 8, wind: 11, windDir: "E", condition: "Cloudy",
    updatedAt: "2026-09-05T09:00:00+05:30",
    forecast: [
      mk("Fri", "05 Sep", 32, 24, 64, 2, 11, "Cloudy"),
      mk("Sat", "06 Sep", 31, 24, 70, 7, 12, "Cloudy"),
      mk("Sun", "07 Sep", 30, 23, 76, 14, 14, "Showers"),
      mk("Mon", "08 Sep", 30, 23, 74, 9, 12, "Overcast"),
      mk("Tue", "09 Sep", 31, 24, 68, 3, 10, "Cloudy"),
      mk("Wed", "10 Sep", 33, 25, 60, 0, 9, "Sunny"),
      mk("Thu", "11 Sep", 33, 25, 58, 0, 9, "Sunny"),
    ],
  },
};

const generic = (id: string, temp: number, humidity: number, rain: number): WeatherSnapshot => ({
  districtId: id, temp, humidity, rain24h: rain, rain72h: rain * 2.2, wind: 12, windDir: "SW", condition: rain > 10 ? "Showers" : humidity > 75 ? "Cloudy" : "Sunny",
  updatedAt: "2026-09-05T09:00:00+05:30",
  forecast: WEATHER.nashik.forecast.map((d, i) => ({ ...d, temp: temp + (i % 3) - 1, humidity: Math.max(45, humidity - i * 3), rain: Math.max(0, rain - i * 3) })),
});

export function weatherFor(districtId: string): WeatherSnapshot {
  if (WEATHER[districtId]) return WEATHER[districtId];
  const presets: Record<string, [number, number, number]> = {
    ahmednagar: [30, 72, 6], kolhapur: [27, 84, 22], satara: [27, 80, 15], sangli: [28, 79, 12], solapur: [32, 60, 1],
    sambhajinagar: [31, 66, 3], amravati: [32, 62, 2], yavatmal: [32, 63, 1], latur: [30, 68, 4], wardha: [32, 65, 3], dhule: [33, 57, 0],
  };
  const [t, h, r] = presets[districtId] ?? [30, 70, 5];
  return generic(districtId, t, h, r);
}
