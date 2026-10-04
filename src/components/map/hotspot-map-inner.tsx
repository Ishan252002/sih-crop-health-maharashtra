"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, useMap, ZoomControl, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Hotspot, RiskLevel } from "@/lib/types";
import { cropById, districtById, threatById } from "@/lib/mock/geo";

const COLORS: Record<RiskLevel, string> = { LOW: "#2f8f6b", MEDIUM: "#e09a1c", HIGH: "#d13c3c" };

// CARTO raster basemaps now require an API key and stamp "API KEY REQUIRED" over
// unkeyed tiles, so fall back to plain OSM tiles when NEXT_PUBLIC_CARTO_KEY is absent.
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY;

// Every field here is passed straight into <TileLayer> and must be defined on both
// branches: react-leaflet copies the props onto Leaflet's options, so an undefined
// value shadows Leaflet's own default instead of falling back to it (an undefined
// `subdomains` crashes TileLayer on this.options.subdomains.length).
const BASEMAP: { url: string; subdomains: string; maxZoom: number; attribution: string } = CARTO_KEY
  ? {
      url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`,
      subdomains: "abcd",
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    }
  : {
      // No {s} placeholder in this url, so the subdomains are simply unused here.
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    };

function pinIcon(h: Hotspot, selected: boolean) {
  const c = COLORS[h.risk];
  const size = h.risk === "HIGH" ? 46 : h.risk === "MEDIUM" ? 38 : 32;
  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:${c};opacity:.35;animation:pulse-ring 2.2s cubic-bezier(.2,.7,.3,1) infinite;"></span>
      ${h.risk === "HIGH" ? `<span style="position:absolute;inset:0;border-radius:9999px;background:${c};opacity:.25;animation:pulse-ring 2.2s cubic-bezier(.2,.7,.3,1) infinite;animation-delay:.7s;"></span>` : ""}
      <span style="position:relative;width:${size * 0.55}px;height:${size * 0.55}px;border-radius:9999px;background:${c};border:3px solid #fff;box-shadow:0 6px 16px -4px rgba(20,32,26,.5)${selected ? `,0 0 0 4px ${c}55` : ""};display:flex;align-items:center;justify-content:center;color:#fff;font:700 10px Inter,system-ui;">${h.cases}</span>
    </div>`;
  return L.divIcon({ html, className: "hotspot-pin", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function FlyTo({ target }: { target?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 8), { duration: 0.9 });
  }, [target, map]);
  return null;
}

function FitBounds({ hotspots, selectedId }: { hotspots: Hotspot[]; selectedId?: string }) {
  const map = useMap();
  const fitted = useRef<Hotspot[] | null>(null);
  useEffect(() => {
    if (fitted.current === hotspots || hotspots.length === 0) return;
    // A selection owns the viewport -- leave the fit pending so we never fight FlyTo.
    if (selectedId) return;
    const bounds = L.latLngBounds(hotspots.map((h) => [h.lat, h.lng] as L.LatLngTuple));
    if (!bounds.isValid()) return;
    fitted.current = hotspots;
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [hotspots, selectedId, map]);
  return null;
}

function Resize() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(map.getContainer());
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [map]);
  return null;
}

export default function HotspotMapInner({ hotspots, selectedId, onSelect, height = 480, center = [19.4, 76.2], zoom = 6.6, interactive = true, wheelZoom = false, showZones = true, className }: { hotspots: Hotspot[]; selectedId?: string; onSelect?: (h: Hotspot) => void; height?: number | string; center?: [number, number]; zoom?: number; interactive?: boolean; wheelZoom?: boolean; showZones?: boolean; className?: string }) {
  const selected = useMemo(() => hotspots.find((h) => h.id === selectedId), [hotspots, selectedId]);
  const labelled = useMemo(() => {
    const best = new Map<string, Hotspot>();
    for (const h of hotspots) if (!best.has(h.districtId) || best.get(h.districtId)!.cases < h.cases) best.set(h.districtId, h);
    return new Set([...best.values()].map((h) => h.id));
  }, [hotspots]);
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={interactive && wheelZoom}
      dragging={interactive}
      doubleClickZoom={interactive}
      attributionControl
      zoomSnap={0.25}
      zoomDelta={0.5}
      className={className}
      style={{ height, width: "100%", borderRadius: "inherit" }}
    >
      <TileLayer url={BASEMAP.url} subdomains={BASEMAP.subdomains} maxZoom={BASEMAP.maxZoom} attribution={BASEMAP.attribution} />
      {interactive && <ZoomControl position="bottomright" />}
      <Resize />
      <FlyTo target={selected ? [selected.lat, selected.lng] : undefined} />
      <FitBounds hotspots={hotspots} selectedId={selectedId} />
      {showZones &&
        hotspots.map((h) => (
          <Circle key={`z-${h.id}`} center={[h.lat, h.lng]} radius={h.radiusKm * 1000} pathOptions={{ color: COLORS[h.risk], fillColor: COLORS[h.risk], fillOpacity: h.id === selectedId ? 0.28 : 0.14, weight: h.id === selectedId ? 2 : 1, dashArray: h.risk === "HIGH" ? undefined : "4 6" }} />
        ))}
      {hotspots.map((h) => (
        <Marker
          key={h.id}
          position={[h.lat, h.lng]}
          icon={pinIcon(h, h.id === selectedId)}
          eventHandlers={{ click: () => onSelect?.(h) }}
          title={`${districtById(h.districtId).name} · ${cropById(h.cropId).name} · ${threatById(h.threatId).name}`}
          zIndexOffset={h.risk === "HIGH" ? 500 : h.risk === "MEDIUM" ? 250 : 0}
        >
          {labelled.has(h.id) && (
            <Tooltip permanent direction="bottom" offset={[0, 14]} className="hotspot-label" opacity={1}>
              {districtById(h.districtId).name}
            </Tooltip>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
