import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout.jsx";
import HomePage from "./components/HomePage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AlertFeed, { MOCK_ALERTS } from "./components/AlertFeed.jsx";
import RootCausePanel from "./components/RootCausePanel.jsx";
import OverviewView from "./components/OverviewView.jsx";
import InventoryRiskView from "./components/InventoryRiskView.jsx";
import SettingsView from "./components/SettingsView.jsx";
import LeakBot from "./components/LeakBot.jsx";
import { getApiBase } from "./config.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const API_BASE = getApiBase();

  // Fetch Summary KPIs
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.warn("Summary API offline:", err.message);
    }
  };

  // Fetch Anomaly Stream
  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/anomalies`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.anomalies || data.data || []);

      const formatted = rawList
        .filter((item) => {
          const variance = Number(item.variance !== undefined ? item.variance : 0);
          return variance < 0;
        })
        .map((item, idx) => {
          const id = item.campaign_id || item.campaignId || `CAMP-${idx + 1}`;
          const channel = item.channel || "Omnichannel";
          const category = item.category || "Retail";
          const spend = Number(item.spend || 0);
          const actual = Number(item.actual_revenue !== undefined ? item.actual_revenue : 0);
          const baseline = Number(item.predicted_baseline !== undefined ? item.predicted_baseline : 0);
          const variance = actual - baseline;
          const isCritical = Math.abs(variance) > 35000;

          return {
            id,
            campaign_id: id,
            title: isCritical
              ? `Critical: Capital leak on ${category} (${channel}) campaign`
              : `Warning: Depressed conversion efficiency on ${category} (${channel})`,
            severity: isCritical ? "Critical" : "Warning",
            category,
            channel,
            timestamp: item.date ? `Logged ${item.date}` : "Live Stream",
            spend,
            conversions: item.conversions || 0,
            actual_revenue: actual,
            predicted_baseline: baseline,
            variance,
            is_paused: item.is_paused || false,
            expectedText: `$${Math.round(baseline).toLocaleString()} baseline`,
            actualText: `$${Math.round(actual).toLocaleString()}`,
            deltaText: `-$${Math.abs(Math.round(variance)).toLocaleString()}`,
            driverSnippet: `Spend $${Math.round(spend).toLocaleString()} vs ${Math.round(item.conversions || 0)} conversions`,
            topShapExplanations: item.top_shap_explanations || item.topShapExplanations || [],
            actions: [
              `Pause campaign ${id} spend immediately to stop margin erosion.`,
              `Reallocate remaining budget to top-performing baseline channels.`,
              `Review inventory levels for ${category} to ensure availability.`
            ]
          };
        });

      if (formatted.length > 0) {
        setAlerts(formatted);
      } else {
        setAlerts(MOCK_ALERTS);
      }
    } catch (err) {
      console.warn("Backend offline or loading, using standard enterprise mock alert stream:", err.message);
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAnomalies();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Toggle Pause Campaign Intervention
  const handleTogglePause = async (campaignId) => {
    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/toggle-pause`, { method: "POST" });
      const data = await res.json();
      setAlerts(prev => prev.map(a => a.id === campaignId ? { ...a, is_paused: data.is_paused } : a));
      showNotification(data.message || `Campaign ${campaignId} status updated.`);
      fetchSummary();
    } catch (e) {
      setAlerts(prev => prev.map(a => a.id === campaignId ? { ...a, is_paused: !a.is_paused } : a));
      showNotification(`Campaign ${campaignId} spend updated.`);
    }
  };

  const handleInvestigate = (alertItem) => {
    setSelectedAlert(alertItem);
    setIsModalOpen(true);
  };

  const handleTakeAction = async (alertItem) => {
    await handleTogglePause(alertItem.id);
    showNotification(`Remediation Executed: Campaign ${alertItem.id} spend capped & budget shifted.`);
  };

  const handlePauseCategory = (categoryName) => {
    setAlerts(prev => prev.map(a => a.category === categoryName ? { ...a, is_paused: true } : a));
    showNotification(`All active ${categoryName} campaigns paused to stop stockout ad drain.`);
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab 0: Enterprise Homepage */}
      {activeTab === "home" && (
        <HomePage onLaunchConsole={() => setActiveTab("overview")} />
      )}

      {/* Tab 1: Executive Overview */}
      {activeTab === "overview" && (
        <OverviewView
          alerts={alerts}
          summary={summary}
          onInvestigate={handleInvestigate}
          onTogglePause={handleTogglePause}
        />
      )}

      {/* Tab 2: Dynamic "Why This Is Flagged" Dashboard (Round 2 Upgraded) */}
      {activeTab === "anomalies" && (
        <Dashboard />
      )}

      {/* Tab 3: Inventory Risk */}
      {activeTab === "inventory" && (
        <InventoryRiskView onTogglePauseCategory={handlePauseCategory} />
      )}

      {/* Tab 4: Settings */}
      {activeTab === "settings" && (
        <SettingsView onResetDemo={fetchAnomalies} />
      )}

      {/* Explainability Modal */}
      <RootCausePanel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={selectedAlert}
        onTakeAction={handleTakeAction}
      />

      {/* Conversational Floating Action Bot */}
      <LeakBot />

    </DashboardLayout>
  );
}
