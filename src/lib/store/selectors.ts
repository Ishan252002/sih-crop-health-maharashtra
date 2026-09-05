import type { CropCase, Hotspot, RiskLevel } from "../types";
import { HOTSPOTS } from "../mock/hotspots";
import { DISTRICTS } from "../mock/geo";

export function mergedHotspots(cases: CropCase[]): Hotspot[] {
  const farmerCases = cases.filter((c) => c.source === "farmer");
  const spots = HOTSPOTS.map((h) => ({ ...h }));
  for (const c of farmerCases) {
    const threat = c.expertThreatId ?? c.ai.threatId;
    const match = spots.find((h) => h.districtId === c.districtId && h.threatId === threat);
    if (match) {
      match.cases += 1;
      match.trend7d += 1;
      match.lastReported = c.createdAt;
    } else {
      const d = DISTRICTS.find((x) => x.id === c.districtId)!;
      spots.push({ id: `hs-${c.id}`, districtId: c.districtId, cropId: c.cropId, threatId: threat, cases: 1, risk: c.risk, trend7d: 1, lat: d.lat + 0.12, lng: d.lng - 0.1, radiusKm: 6, lastReported: c.createdAt });
    }
  }
  return spots;
}

export function riskCounts(spots: Hotspot[]): Record<RiskLevel, number> {
  return spots.reduce((acc, h) => ({ ...acc, [h.risk]: acc[h.risk] + 1 }), { LOW: 0, MEDIUM: 0, HIGH: 0 } as Record<RiskLevel, number>);
}

export function districtRisk(spots: Hotspot[]) {
  return DISTRICTS.map((d) => {
    const ds = spots.filter((h) => h.districtId === d.id);
    const cases = ds.reduce((a, h) => a + h.cases, 0);
    const risk: RiskLevel = ds.some((h) => h.risk === "HIGH") ? "HIGH" : ds.some((h) => h.risk === "MEDIUM") ? "MEDIUM" : "LOW";
    const trend = ds.length ? Math.round(ds.reduce((a, h) => a + h.trend7d, 0) / ds.length) : 0;
    return { district: d, cases, risk, trend, threats: ds.length };
  }).sort((a, b) => b.cases - a.cases);
}

export function threatDistribution(spots: Hotspot[]) {
  const map = new Map<string, number>();
  for (const h of spots) map.set(h.threatId, (map.get(h.threatId) ?? 0) + h.cases);
  return [...map.entries()].map(([threatId, cases]) => ({ threatId, cases })).sort((a, b) => b.cases - a.cases);
}

export function totalCases(spots: Hotspot[]) {
  return spots.reduce((a, h) => a + h.cases, 0);
}
