import React, { useState } from "react";
import {
  LayoutDashboard,
  AlertOctagon,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Activity,
  ShieldAlert,
  Search,
  Bell
} from "lucide-react";

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "anomalies", label: "Anomalies", icon: AlertOctagon, badge: "3 New" },
    { id: "inventory", label: "Inventory Risk", icon: Boxes },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* 1. Sidebar (Collapsible Left Navigation) */}
      <aside
        className={`relative flex flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-md transition-all duration-300 z-30 shrink-0 ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold tracking-tight text-white text-base">THE MONEY LEAK</span>
                <span className="block text-[10px] text-cyan-400 font-mono tracking-wider">ENTERPRISE OPS v2.4</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (!activeTab && item.id === "overview");

            return (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /><span>Collapse Sidebar</span></div>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-950">
        
        {/* 2. Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-lg font-bold text-white tracking-tight shrink-0">
              The Money Leak
            </h1>
            
            {/* Highly Visible Disclaimer Banner */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span><strong>Notice:</strong> Insights derived from synthetic educational data.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex lg:hidden items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20">
              <span>Demo Mode</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-800 mx-1" />

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-300 font-mono">ML ENGINE: ONLINE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Operations Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* 3. Hero Section (KPIs Grid - 4 Metric Cards) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Predicted Daily Revenue (Neutral color) */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
                <span>PREDICTED DAILY REVENUE</span>
                <span className="p-1 rounded bg-slate-800 text-slate-300">
                  <Activity className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
                $184,250
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="text-slate-300">Statistical Baseline</span>
                <span className="text-slate-500">•</span>
                <span>Random Forest model</span>
              </div>
            </div>

            {/* Card 2: Actual Revenue (Showing a negative trend) */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
                <span>ACTUAL REVENUE</span>
                <span className="p-1 rounded bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
                $129,480
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-rose-400 font-medium font-mono">
                <TrendingDown className="w-3 h-3" />
                <span>-$54,770 (-29.7% drag)</span>
              </div>
            </div>

            {/* Card 3: Active Stockout Risks (Highlighted in soft red) */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 shadow-sm relative overflow-hidden group hover:border-rose-700/60 transition-colors">
              <div className="flex items-center justify-between text-xs text-rose-300 font-medium mb-2">
                <span>ACTIVE STOCKOUT RISKS</span>
                <span className="p-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Boxes className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-rose-300 tracking-tight">
                14 SKUs Critical
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400/90 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>Impacts $38.4k ad traffic</span>
              </div>
            </div>

            {/* Card 4: Campaign Efficiency Drop (Highlighted in amber) */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 shadow-sm relative overflow-hidden group hover:border-amber-700/60 transition-colors">
              <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-2">
                <span>CAMPAIGN EFFICIENCY DROP</span>
                <span className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight">
                -41.2% ROAS
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/90 font-mono">
                <span>High spend on low conversions</span>
              </div>
            </div>

          </section>

          {/* Dynamic Content Body (Injected Feeds & Panels) */}
          <div className="w-full">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}
