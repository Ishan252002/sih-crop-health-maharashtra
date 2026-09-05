"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Inner = dynamic(() => import("./hotspot-map-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full min-h-[320px] rounded-[inherit]" />,
});

export type HotspotMapProps = ComponentProps<typeof Inner>;

export function HotspotMap(props: HotspotMapProps) {
  return <Inner {...props} />;
}

export function MapLegend({ className, dark }: { className?: string; dark?: boolean }) {
  const items = [
    { label: "High risk", color: "#d13c3c", dots: "●●●●●" },
    { label: "Medium risk", color: "#e09a1c", dots: "●●●" },
    { label: "Low risk", color: "#2f8f6b", dots: "●" },
  ];
  return (
    <div className={`${dark ? "glass-dark text-white" : "glass text-ink-800"} rounded-2xl px-3.5 py-2.5 text-xs shadow-soft ${className ?? ""}`}>
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2 py-0.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: i.color }} />
          <span className="font-semibold w-20">{i.label}</span>
          <span className="tracking-tighter" style={{ color: i.color }}>{i.dots}</span>
        </div>
      ))}
    </div>
  );
}
