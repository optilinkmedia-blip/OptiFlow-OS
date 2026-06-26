import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    type: "up" | "down" | "neutral";
    value: string;
  };
}

export default function KPICard({ title, value, subtext, icon, trend }: KPICardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm transition-all duration-300 hover:border-[#22c55e]/20 hover:shadow-md" id={`kpi-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold ${
            trend.type === "up" ? "bg-[#22c55e]/10 text-emerald-600" :
            trend.type === "down" ? "bg-rose-500/10 text-rose-600" :
            "bg-[#2b2a31] text-white/50"
          }`}>
            {trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-[10px] text-white/40 font-mono tracking-wide">{subtext}</p>
      )}
    </div>
  );
}
