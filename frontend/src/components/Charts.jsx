import React, { useState } from "react";
import { TrendingDown, Info, DollarSign, Calendar } from "lucide-react";

// --- 1. Interactive Revenue Divergence Timeline Chart ---
export function RevenueDivergenceChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // 12-month data points from real timeline
  const points = data || [
    { month: "Jan", baseline: 142000, actual: 138000, leak: 4000 },
    { month: "Feb", baseline: 156000, actual: 149000, leak: 7000 },
    { month: "Mar", baseline: 168000, actual: 142000, leak: 26000 },
    { month: "Apr", baseline: 184000, actual: 129000, leak: 55000 },
    { month: "May", baseline: 175000, actual: 131000, leak: 44000 },
    { month: "Jun", baseline: 192000, actual: 145000, leak: 47000 },
    { month: "Jul", baseline: 188000, actual: 139000, leak: 49000 },
    { month: "Aug", baseline: 195000, actual: 134000, leak: 61000 },
    { month: "Sep", baseline: 181000, actual: 140000, leak: 41000 },
    { month: "Oct", baseline: 189000, actual: 135000, leak: 54000 },
    { month: "Nov", baseline: 210000, actual: 152000, leak: 58000 },
    { month: "Dec", baseline: 225000, actual: 164000, leak: 61000 },
  ];

  const width = 720;
  const height = 240;
  const paddingX = 45;
  const paddingY = 30;

  const maxVal = 240000;
  const minVal = 100000;

  const getX = (i) => paddingX + (i * (width - 2 * paddingX)) / (points.length - 1);
  const getY = (val) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);

  // SVG Paths
  const baselinePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.baseline)}`).join(" ");
  const actualPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.actual)}`).join(" ");

  // Shaded Leak Polygon (Area between baseline and actual)
  const leakAreaPath = [
    `M ${getX(0)} ${getY(points[0].baseline)}`,
    ...points.map((p, i) => `L ${getX(i)} ${getY(p.baseline)}`),
    ...[...points].reverse().map((p, i) => `L ${getX(points.length - 1 - i)} ${getY(p.actual)}`),
    "Z"
  ].join(" ");

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Revenue Leak Divergence Curve
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Negative Variance Shaded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Statistical baseline vs actual realized transactions over time</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
            <span className="text-slate-600 font-medium">Expected Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
            <span className="text-slate-600 font-medium">Actual Realized</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="leakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[120000, 160000, 200000].map((v) => (
            <g key={v}>
              <line
                x1={paddingX}
                y1={getY(v)}
                x2={width - paddingX}
                y2={getY(v)}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={getY(v) + 3}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400"
              >
                ${v / 1000}k
              </text>
            </g>
          ))}

          {/* Shaded Money Leak Zone */}
          <path d={leakAreaPath} fill="url(#leakGradient)" />

          {/* Baseline Curve (Dashed Blue) */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Actual Curve (Solid Rose) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />

          {/* Points & Hover Target Bars */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cyActual = getY(p.actual);
            const cyBase = getY(p.baseline);
            const isHovered = hoverIndex === i;

            return (
              <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
                {/* Invisible hover column */}
                <rect
                  x={cx - 15}
                  y={0}
                  width="30"
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                />

                {/* X-axis labels */}
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-medium transition-colors ${
                    isHovered ? "fill-slate-900 font-bold" : "fill-slate-400"
                  }`}
                >
                  {p.month}
                </text>

                {/* Hover guideline */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={height - paddingY}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Data point dots */}
                <circle
                  cx={cx}
                  cy={cyBase}
                  r={isHovered ? 4.5 : 2.5}
                  fill="#2563eb"
                  className="transition-all"
                />
                <circle
                  cx={cx}
                  cy={cyActual}
                  r={isHovered ? 4.5 : 2.5}
                  fill="#f43f5e"
                  className="transition-all"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip Bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs mt-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{activePoint.month} 2025 Telemetry:</span>
            <span className="text-slate-500">
              Expected: <strong className="text-blue-600 font-mono">${activePoint.baseline.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">
              Actual: <strong className="text-slate-900 font-mono">${activePoint.actual.toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono font-bold text-rose-600">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Money Leak: -${activePoint.leak.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. Category Performance Comparison Chart ---
export function CategoryPerformanceChart() {
  const categories = [
    { name: "Grocery", expected: 215700, actual: 21246, leak: 194454, channel: "App" },
    { name: "Sports", expected: 180540, actual: 51292, leak: 129248, channel: "Web" },
    { name: "Home", expected: 87323, actual: 33137, leak: 54186, channel: "App" },
    { name: "Electronics", expected: 75400, actual: 42468, leak: 32932, channel: "Store" },
    { name: "Fashion", expected: 64500, actual: 35320, leak: 29180, channel: "App" },
    { name: "Beauty", expected: 51200, actual: 29145, leak: 22055, channel: "Web" },
  ];

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Category Variance Benchmark</h3>
          <p className="text-xs text-slate-500">Side-by-side comparison of baseline target vs realized revenue</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">Gross Volume ($)</span>
      </div>

      <div className="space-y-3.5 pt-1">
        {categories.map((cat, i) => {
          const maxCat = 220000;
          const expWidth = Math.min(100, (cat.expected / maxCat) * 100);
          const actWidth = Math.min(100, (cat.actual / maxCat) * 100);

          return (
            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{cat.name} ({cat.channel})</span>
                <span className="font-mono font-bold text-rose-600">
                  -${cat.leak.toLocaleString()} leak
                </span>
              </div>

              {/* Dual bar: expected vs actual */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-12 text-slate-400 font-medium">Target</span>
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${expWidth}%` }} />
                  </div>
                  <span className="w-14 text-right font-mono text-slate-600">${(cat.expected / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-12 text-slate-400 font-medium">Actual</span>
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${actWidth}%` }} />
                  </div>
                  <span className="w-14 text-right font-mono text-rose-600 font-bold">${(cat.actual / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- 3. Interactive SHAP Waterfall Decomposition Chart ---
export function ShapWaterfallChart({ alert }) {
  const steps = [
    { label: "Base Expectation", val: 215700, diff: 0, type: "base" },
    { label: "Stockout Flag", val: 170700, diff: -45000, type: "negative" },
    { label: "Ad Spend Pace", val: 142300, diff: -28400, type: "negative" },
    { label: "CTR Drop (-18%)", val: 127700, diff: -14600, type: "negative" },
    { label: "Category Discount", val: 135700, diff: +8000, type: "positive" },
    { label: "Realized Revenue", val: 21246, diff: 0, type: "total" },
  ];

  const maxVal = 220000;

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          SHAP Waterfall Decomposition
        </span>
        <span className="text-[11px] font-mono text-slate-500">Mathematical attribution</span>
      </div>

      <div className="space-y-2 pt-1 text-xs">
        {steps.map((st, i) => {
          const widthPct = Math.max(10, Math.min(100, (st.val / maxVal) * 100));
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-700">{st.label}</span>
                <span className="font-mono">
                  {st.diff !== 0 && (
                    <span className={st.diff > 0 ? "text-emerald-600 font-bold mr-1.5" : "text-rose-600 font-bold mr-1.5"}>
                      {st.diff > 0 ? `+$${st.diff.toLocaleString()}` : `-$${Math.abs(st.diff).toLocaleString()}`}
                    </span>
                  )}
                  <strong className="text-slate-900">${st.val.toLocaleString()}</strong>
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    st.type === "base"
                      ? "bg-blue-600"
                      : st.type === "positive"
                      ? "bg-emerald-500"
                      : st.type === "negative"
                      ? "bg-rose-500"
                      : "bg-slate-900"
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
