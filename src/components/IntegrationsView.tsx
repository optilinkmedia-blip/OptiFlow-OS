import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Key, 
  Settings2, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  Globe, 
  Share2, 
  Send, 
  BarChart3, 
  BrainCircuit, 
  Network, 
  Plug, 
  Eye, 
  EyeOff,
  Search,
  Plus,
  X,
  Download,
  Copy,
  Check,
  Terminal,
  Code
} from "lucide-react";
import { fetchIntegrations, updateIntegration, testIntegration } from "../lib/api";

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "pending";
  additionalConfig: Record<string, string>;
  lastTestedAt?: number;
  errorMessage?: string;
  hasKey: boolean;
}

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Form states
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});
  const [tempConfigs, setTempConfigs] = useState<Record<string, Record<string, string>>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // New API Integration registration states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApiId, setNewApiId] = useState("");
  const [newApiName, setNewApiName] = useState("");
  const [newApiDesc, setNewApiDesc] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [newApiUrl, setNewApiUrl] = useState("");
  const [newApiError, setNewApiError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Deployment and Report state
  const [activeSubTab, setActiveSubTab] = useState<"credentials" | "deployment">("credentials");
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const loadArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleDownloadCsv = () => {
    if (articles.length === 0) {
      alert("No articles available in database to export.");
      return;
    }

    const headers = [
      "ID",
      "Title",
      "Keyword",
      "Status",
      "Clicks",
      "Conversions",
      "Revenue ($)",
      "EPC ($)",
      "Created At",
      "Meta Description"
    ];

    const rows = articles.map(art => [
      art.id,
      `"${(art.title || "").replace(/"/g, '""')}"`,
      `"${(art.keyword || "").replace(/"/g, '""')}"`,
      art.status || "draft",
      art.clicks || 0,
      art.conversions || 0,
      (art.revenue || 0).toFixed(2),
      (art.epc || 0).toFixed(2),
      new Date(art.createdAt || Date.now()).toISOString(),
      `"${(art.metaDescription || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `optiflow_performance_report_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegisterCustomApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiId.trim() || !newApiName.trim()) {
      setNewApiError("ID and Name are required.");
      return;
    }
    
    // Normalize ID to alphanumeric lowercase with underscores
    const cleanId = newApiId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    
    setIsAdding(true);
    setNewApiError("");
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cleanId,
          name: newApiName.trim(),
          description: newApiDesc.trim(),
          apiKey: newApiKey.trim(),
          isCustom: true,
          additionalConfig: {
            siteUrl: newApiUrl.trim()
          }
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to register custom API");
      }
      
      await loadData();
      setSelectedId(cleanId);
      setShowAddModal(false);
      
      // Reset state
      setNewApiId("");
      setNewApiName("");
      setNewApiDesc("");
      setNewApiKey("");
      setNewApiUrl("");
    } catch (err: any) {
      setNewApiError(err.message || "An error occurred during registration.");
    } finally {
      setIsAdding(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchIntegrations();
      setIntegrations(data);
      
      // Initialize temp values
      const keys: Record<string, string> = {};
      const configs: Record<string, Record<string, string>> = {};
      data.forEach((item: IntegrationItem) => {
        keys[item.id] = item.hasKey ? "••••••••" : "";
        configs[item.id] = { ...(item.additionalConfig || {}) };
      });
      setTempKeys(keys);
      setTempConfigs(configs);

      // Default expand the first one if none selected
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadArticles();
  }, []);

  const handleKeyChange = (id: string, value: string) => {
    setTempKeys(prev => ({ ...prev, [id]: value }));
  };

  const handleConfigChange = (id: string, key: string, value: string) => {
    setTempConfigs(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: value
      }
    }));
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (id: string) => {
    setIsSaving(id);
    setTestResult(null);
    try {
      const apiKeyToSend = tempKeys[id];
      const configToSend = tempConfigs[id];
      await updateIntegration(id, apiKeyToSend, configToSend);
      
      // Reload updated integration statuses
      const updated = await fetchIntegrations();
      setIntegrations(updated);
      
      // Flash success indicator
      setTestResult({
        id,
        success: true,
        message: "Settings saved successfully!"
      });
    } catch (err: any) {
      setTestResult({
        id,
        success: false,
        message: err.message || "Failed to save settings."
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleTest = async (id: string) => {
    setIsTesting(id);
    setTestResult(null);
    try {
      const apiKeyToSend = tempKeys[id];
      const configToSend = tempConfigs[id];
      const res = await testIntegration(id, apiKeyToSend, configToSend);
      
      // Reload list to get updated status
      const updated = await fetchIntegrations();
      setIntegrations(updated);

      let message = "";
      if (res.success) {
        message = "Connection test succeeded! This API integration is fully operational.";
      } else if (res.transient) {
        message = `Transient issue: ${res.error}`;
      } else {
        message = `Connection failed: ${res.error || "Unknown authentication error."}`;
      }

      setTestResult({
        id,
        success: res.success || !!res.transient,
        message
      });
    } catch (err: any) {
      setTestResult({
        id,
        success: false,
        message: err.message || "Network error while testing connection."
      });
    } finally {
      setIsTesting(null);
    }
  };

  const getIconForIntegration = (id: string) => {
    switch (id) {
      case "gemini":
        return <BrainCircuit className="h-5 w-5 text-emerald-500" />;
      case "openai":
        return <BrainCircuit className="h-5 w-5 text-teal-500" />;
      case "anthropic":
        return <BrainCircuit className="h-5 w-5 text-orange-400" />;
      case "apify":
        return <Network className="h-5 w-5 text-indigo-400" />;
      case "pinterest":
        return <Share2 className="h-5 w-5 text-rose-500" />;
      case "wordpress":
        return <Globe className="h-5 w-5 text-sky-500" />;
      case "google_analytics":
        return <BarChart3 className="h-5 w-5 text-amber-500" />;
      case "mailchimp":
        return <Send className="h-5 w-5 text-yellow-500" />;
      default:
        return <Plug className="h-5 w-5 text-zinc-400" />;
    }
  };

  const filteredIntegrations = integrations.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeConnectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <div className="space-y-6 animate-fadeIn" id="api-integration-board-root">
      
      {/* Top statistics panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Plug className="h-6 w-6 text-emerald-500" />
            API Integration Board
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your credentials, test external API handshakes, and route traffic across active advertising and content pipelines.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#18181b] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-zinc-500 font-mono">HEALTH RATIO</p>
              <p className="text-sm font-semibold text-zinc-100">
                {activeConnectedCount} / {integrations.length} Active
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Register Custom API</span>
          </button>

          <button 
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-white/5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white transition disabled:opacity-50 cursor-pointer"
            title="Refresh integration states"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex border-b border-white/5 pb-0.5">
        <button
          onClick={() => setActiveSubTab("credentials")}
          className={`px-5 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === "credentials"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Settings2 className="h-4 w-4" />
          API Credentials & Pipelines
        </button>
        <button
          onClick={() => setActiveSubTab("deployment")}
          className={`px-5 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === "deployment"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Terminal className="h-4 w-4" />
          System Webhook Deployment
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
            Endpoints Active
          </span>
        </button>
      </div>

      {activeSubTab === "credentials" ? (
        loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm font-mono tracking-widest uppercase text-zinc-500">Checking system links...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left list pane (5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search active APIs..."
                className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition placeholder:text-zinc-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto custom-scrollbar-dark pr-1">
              {filteredIntegrations.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setTestResult(null);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition text-left flex items-start gap-3.5 relative overflow-hidden ${
                      isSelected 
                        ? "bg-[#18181b] border-emerald-500/30 shadow-md ring-1 ring-emerald-500/10" 
                        : "bg-[#0c0c0e] border-white/5 hover:border-white/10 hover:bg-[#121215]"
                    }`}
                  >
                    <div className="p-2 bg-[#18181b] rounded-lg border border-white/5 shrink-0 mt-0.5">
                      {getIconForIntegration(item.id)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-zinc-100 text-sm truncate">{item.name}</span>
                        
                        {/* Status pills */}
                        {item.status === "connected" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : item.status === "pending" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Setup
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-zinc-500/10 text-zinc-400 border border-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                            Offline
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3 text-zinc-500" />
                          {item.hasKey ? "Key Configured" : "No Key Set"}
                        </span>
                        
                        {item.lastTestedAt && (
                          <span>
                            Tested {new Date(item.lastTestedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredIntegrations.length === 0 && (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-white/5 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs">No active links matched your search term.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right details / Edit pane (7 columns) */}
          <div className="lg:col-span-7">
            {selectedId ? (() => {
              const item = integrations.find(x => x.id === selectedId);
              if (!item) return null;

              const isItemTesting = isTesting === item.id;
              const isItemSaving = isSaving === item.id;
              const currentResult = testResult?.id === item.id ? testResult : null;

              return (
                <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 space-y-6 shadow-sm">
                  
                  {/* Detailed Card Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#18181b] rounded-xl border border-white/5">
                        {getIconForIntegration(item.id)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-zinc-100">{item.name}</h2>
                        <span className="text-xs font-mono text-zinc-500">ID: {item.id}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.status === "connected" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Connection Operational
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-zinc-500/10 text-zinc-400 border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider">
                          <AlertCircle className="h-3.5 w-3.5 text-zinc-500" />
                          Connection Offline
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-[#18181b]/50 border border-white/5 rounded-xl p-4 text-sm text-zinc-300">
                    <p>{item.description}</p>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                        <span>API Authentication Token / Key</span>
                        <span className="text-[10px] text-zinc-500 normal-case">Masked on read-out</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showKeys[item.id] ? "text" : "password"}
                          placeholder={item.hasKey ? "••••••••" : "Enter access secret key"}
                          className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl pl-4 pr-12 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition placeholder:text-zinc-600 font-mono"
                          value={tempKeys[item.id] || ""}
                          onChange={e => handleKeyChange(item.id, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility(item.id)}
                          className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-200 transition focus:outline-none"
                        >
                          {showKeys[item.id] ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Conditional input fields based on integration ID */}
                    {item.id === "gemini" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                              <span>Preferred Model Version</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const useCustom = tempConfigs[item.id]?.useCustomModel !== "true";
                                  handleConfigChange(item.id, "useCustomModel", useCustom ? "true" : "false");
                                }}
                                className="text-[10px] text-emerald-400 hover:text-emerald-300 transition hover:underline font-normal cursor-pointer"
                              >
                                {tempConfigs[item.id]?.useCustomModel === "true" ? "Choose from list" : "Enter custom model ID"}
                              </button>
                            </label>
                            
                            {tempConfigs[item.id]?.useCustomModel === "true" ? (
                              <input
                                type="text"
                                placeholder="e.g. gemini-2.0-flash"
                                className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition font-mono"
                                value={tempConfigs[item.id]?.model || ""}
                                onChange={e => handleConfigChange(item.id, "model", e.target.value)}
                              />
                            ) : (
                              <select
                                className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition cursor-pointer font-mono"
                                value={tempConfigs[item.id]?.model || "gemini-2.0-flash"}
                                onChange={e => handleConfigChange(item.id, "model", e.target.value)}
                              >
                                <option value="gemini-2.0-flash">gemini-2.0-flash (Fast)</option>
                                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Reasoning)</option>
                                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Lite)</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {item.id === "wordpress" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            WordPress Blog URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://myblog.com"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                            value={tempConfigs[item.id]?.siteUrl || ""}
                            onChange={e => handleConfigChange(item.id, "siteUrl", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            CMS Username
                          </label>
                          <input
                            type="text"
                            placeholder="admin"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                            value={tempConfigs[item.id]?.username || ""}
                            onChange={e => handleConfigChange(item.id, "username", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {item.id === "pinterest" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            Creator Username
                          </label>
                          <input
                            type="text"
                            placeholder="@design_trends"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                            value={tempConfigs[item.id]?.username || ""}
                            onChange={e => handleConfigChange(item.id, "username", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            Target Board ID
                          </label>
                          <input
                            type="text"
                            placeholder="745289945032"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                            value={tempConfigs[item.id]?.boardId || ""}
                            onChange={e => handleConfigChange(item.id, "boardId", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {item.id === "mailchimp" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            Audience List ID
                          </label>
                          <input
                            type="text"
                            placeholder="9e6a3f12bc"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                            value={tempConfigs[item.id]?.audienceId || ""}
                            onChange={e => handleConfigChange(item.id, "audienceId", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {item.id === "google_analytics" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            Data Stream Stream ID (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="450821390"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                            value={tempConfigs[item.id]?.streamId || ""}
                            onChange={e => handleConfigChange(item.id, "streamId", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {!["gemini", "apify", "wordpress", "pinterest", "google_analytics", "mailchimp"].includes(item.id) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                            Base / Test URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://api.partner.com/v1"
                            className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition font-mono"
                            value={tempConfigs[item.id]?.siteUrl || ""}
                            onChange={e => handleConfigChange(item.id, "siteUrl", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback Message */}
                  {currentResult && (
                    <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                      currentResult.success 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                    }`}>
                      {currentResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">{currentResult.success ? "Verification Complete" : "Authentication Error"}</p>
                        <p className="mt-1 leading-relaxed">{currentResult.message}</p>
                      </div>
                    </div>
                  )}

                  {item.status === "disconnected" && item.errorMessage && !currentResult && (
                    <div className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-300 flex items-start gap-3 text-xs">
                      <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Last Authentication Error</p>
                        <p className="mt-1 leading-relaxed">{item.errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {item.lastTestedAt ? `Last handshake check: ${new Date(item.lastTestedAt).toLocaleString()}` : "Never tested."}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleTest(item.id)}
                        disabled={isItemTesting || isItemSaving}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isItemTesting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            Test Connection
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSave(item.id)}
                        disabled={isItemTesting || isItemSaving}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-900 text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/10 disabled:opacity-50"
                      >
                        {isItemSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            Save Settings
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })() : (
              <div className="h-full bg-[#121215] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <Settings2 className="h-12 w-12 text-zinc-600 mb-4 animate-pulse" />
                <h3 className="text-zinc-300 font-semibold text-lg">Select an API Integration</h3>
                <p className="text-zinc-500 text-sm max-w-sm mt-1">
                  Choose a third-party platform from the sidebar list to configure access credentials, adjust endpoints, and test pipeline handshakes.
                </p>
              </div>
            )}
          </div>

        </div>
        )
      ) : (
        <div className="space-y-6">
          {/* Analytics Snapshot & Export */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Download Report Card */}
            <div className="md:col-span-2 bg-[#121215] border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors duration-500 pointer-events-none" />
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Content Metrics & Export
                </span>
                <h3 className="text-lg font-bold text-zinc-100">Compiled Articles Performance Ledger</h3>
                <p className="text-sm text-zinc-400 mt-2 max-w-xl">
                  Export your active article inventory, indexing statuses, traffic metrics, affiliate conversion ratios, and pipeline performance metrics into a standard CSV spreadsheet for direct importing into analytics tools or spreadsheets.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6 pt-6 border-t border-white/5">
                <button
                  onClick={handleDownloadCsv}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold transition shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Report (CSV)</span>
                </button>
                <button
                  onClick={loadArticles}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingArticles ? "animate-spin" : ""}`} />
                  <span>Reload Performance Ledger</span>
                </button>
              </div>
            </div>

            {/* Performance Stats Snapshot */}
            <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">System Inventory Stats</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-zinc-400">Total Cataloged Articles</span>
                    <span className="font-mono text-zinc-100 font-bold">{articles.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-zinc-400">Aggregated Traffic Clicks</span>
                    <span className="font-mono text-zinc-100 font-bold">
                      {articles.reduce((acc, a) => acc + (a.clicks || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-zinc-400">Total Pipeline Conversions</span>
                    <span className="font-mono text-zinc-100 font-bold">
                      {articles.reduce((acc, a) => acc + (a.conversions || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Est. Accumulated Revenue</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ${articles.reduce((acc, a) => acc + (a.revenue || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#18181b] border border-white/5 rounded-xl p-3 text-center mt-6">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Average EPC (Earnings Per Click)</p>
                <p className="text-lg font-bold text-zinc-200 mt-1 font-mono">
                  ${articles.reduce((acc, a) => acc + (a.clicks || 0), 0) > 0
                    ? (articles.reduce((acc, a) => acc + (a.revenue || 0), 0) / articles.reduce((acc, a) => acc + (a.clicks || 0), 0)).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>

          </div>

          {/* API Webhook Documentation & Testing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-zinc-100">API Webhooks & Trigger-Based Integration Hook Catalog</h3>
            </div>
            <p className="text-sm text-zinc-400 max-w-3xl">
              Configure trigger actions and route data dynamically into OptiFlow from external programs or automation layers. Securely query, inject, and execute content pipeline sequences using standard JSON payloads.
            </p>

            <div className="grid grid-cols-1 gap-6">
              
              {/* Endpoint 1: POST /api/deploy/trigger-cycle */}
              <div className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-white/5 bg-[#18181b] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      POST
                    </span>
                    <div>
                      <h4 className="font-bold text-zinc-100 flex items-center gap-2 text-sm md:text-base">
                        Trigger Content Pipeline Cycle
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">/api/deploy/trigger-cycle</span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Automate keyword discovery & copywriting pipeline trigger.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono hidden sm:inline bg-[#0c0c0e] px-3 py-1.5 rounded border border-white/5 truncate max-w-xs md:max-w-md">
                      {window.location.origin}/api/deploy/trigger-cycle
                    </span>
                    <button
                      onClick={() => handleCopyText(`${window.location.origin}/api/deploy/trigger-cycle`, "trigger")}
                      className="p-2 bg-[#0c0c0e] hover:bg-[#1c1c22] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                    >
                      {copiedText === "trigger" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedText === "trigger" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Schema */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Payload Schema (JSON)</span>
                    <pre className="bg-[#0c0c0e] border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
{`{
  "seed": "keto baking"  // [Optional] Adds seed keyword & triggers expansion
}`}
                    </pre>
                    <p className="text-xs text-zinc-500">
                      * If no <code className="text-zinc-300">seed</code> is provided, OptiFlow triggers scheduled keyword expansion cycles for any existing unexpanded seed keywords.
                    </p>
                  </div>
                  {/* Interactive Test Console */}
                  <WebhookSimulator endpoint="/api/deploy/trigger-cycle" method="POST" placeholder='{\n  "seed": "keto baking"\n}' />
                </div>
              </div>

              {/* Endpoint 2: POST /api/deploy/articles */}
              <div className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-white/5 bg-[#18181b] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      POST
                    </span>
                    <div>
                      <h4 className="font-bold text-zinc-100 flex items-center gap-2 text-sm md:text-base">
                        Inject Custom Formulated Article
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">/api/deploy/articles</span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Manually/programmatically bypass AI writer and submit custom formatted drafts.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono hidden sm:inline bg-[#0c0c0e] px-3 py-1.5 rounded border border-white/5 truncate max-w-xs md:max-w-md">
                      {window.location.origin}/api/deploy/articles
                    </span>
                    <button
                      onClick={() => handleCopyText(`${window.location.origin}/api/deploy/articles`, "articles_post")}
                      className="p-2 bg-[#0c0c0e] hover:bg-[#1c1c22] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                    >
                      {copiedText === "articles_post" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedText === "articles_post" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Schema */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Payload Schema (JSON)</span>
                    <pre className="bg-[#0c0c0e] border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
{`{
  "title": "Low Carb Keto Shakes",
  "content": "## Core Recipe\\n\\n1. Avocado\\n2. Almond milk",
  "keyword": "keto shakes",      // [Optional]
  "status": "published",       // "draft" | "queued" | "published"
  "metaDescription": "Yummy"   // [Optional]
}`}
                    </pre>
                  </div>
                  {/* Interactive Test Console */}
                  <WebhookSimulator 
                    endpoint="/api/deploy/articles" 
                    method="POST" 
                    placeholder='{\n  "title": "Low Carb Keto Shakes",\n  "content": "## Recipe\\n\\n- Blend ingredients",\n  "status": "published"\n}' 
                  />
                </div>
              </div>

              {/* Endpoint 3: GET /api/deploy/articles */}
              <div className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-white/5 bg-[#18181b] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-bold font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                      GET
                    </span>
                    <div>
                      <h4 className="font-bold text-zinc-100 flex items-center gap-2 text-sm md:text-base">
                        Fetch Live Content Index
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">/api/deploy/articles</span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Retrieve active database articles list with integrated EPC metadata.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono hidden sm:inline bg-[#0c0c0e] px-3 py-1.5 rounded border border-white/5 truncate max-w-xs md:max-w-md font-semibold">
                      {window.location.origin}/api/deploy/articles?status=published
                    </span>
                    <button
                      onClick={() => handleCopyText(`${window.location.origin}/api/deploy/articles?status=published`, "articles_get")}
                      className="p-2 bg-[#0c0c0e] hover:bg-[#1c1c22] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                    >
                      {copiedText === "articles_get" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedText === "articles_get" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Schema */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Query Parameters</span>
                    <div className="bg-[#0c0c0e] border border-white/5 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs">
                        <span className="font-mono font-bold text-emerald-400">status</span>
                        <span className="text-zinc-500 font-mono">string</span>
                        <span className="text-zinc-400">Filter articles: <code className="text-zinc-200">draft</code> | <code className="text-zinc-200">queued</code> | <code className="text-zinc-200">published</code></span>
                      </div>
                    </div>
                  </div>
                  {/* Interactive Test Console */}
                  <WebhookSimulator endpoint="/api/deploy/articles?status=published" method="GET" />
                </div>
              </div>

              {/* Endpoint 4: POST /api/deploy/offers */}
              <div className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-white/5 bg-[#18181b] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      POST
                    </span>
                    <div>
                      <h4 className="font-bold text-zinc-100 flex items-center gap-2 text-sm md:text-base">
                        Deploy New Affiliate Offer
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">/api/deploy/offers</span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Automate monetization linking by programmatic insertion of payout rules.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono hidden sm:inline bg-[#0c0c0e] px-3 py-1.5 rounded border border-white/5 truncate max-w-xs md:max-w-md font-semibold">
                      {window.location.origin}/api/deploy/offers
                    </span>
                    <button
                      onClick={() => handleCopyText(`${window.location.origin}/api/deploy/offers`, "offers_post")}
                      className="p-2 bg-[#0c0c0e] hover:bg-[#1c1c22] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                    >
                      {copiedText === "offers_post" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedText === "offers_post" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Schema */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Payload Schema (JSON)</span>
                    <pre className="bg-[#0c0c0e] border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
{`{
  "name": "Super Carb blocker shake",
  "network": "MaxBounty",         // "MaxBounty" | "ClickBank" | "ShareASale" | "SaaS"
  "payout": 45.00,
  "url": "https://maxb.com/off_998",
  "vertical": "Diet & Fitness"
}`}
                    </pre>
                  </div>
                  {/* Interactive Test Console */}
                  <WebhookSimulator 
                    endpoint="/api/deploy/offers" 
                    method="POST" 
                    placeholder='{\n  "name": "Super Carb blocker shake",\n  "network": "MaxBounty",\n  "payout": 45.00,\n  "url": "https://maxb.com/off_998",\n  "vertical": "Diet & Fitness"\n}' 
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Custom API Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#18181b]">
              <div className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-zinc-100">Register Custom API Integration</h2>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white transition p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleRegisterCustomApi} className="p-6 space-y-4">
              {newApiError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{newApiError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                  Integration ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. tracking_partner_api"
                  className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition font-mono"
                  value={newApiId}
                  onChange={e => setNewApiId(e.target.value)}
                />
                <p className="text-[10px] text-zinc-500 mt-1">Unique slug used in backend calls. Non-alphanumeric chars will be converted to underscores.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom Conversion Tracker"
                  className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                  value={newApiName}
                  onChange={e => setNewApiName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this custom integration handles..."
                  rows={2}
                  className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition resize-none"
                  value={newApiDesc}
                  onChange={e => setNewApiDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                    Base / test URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.partner.com/v1"
                    className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition font-mono"
                    value={newApiUrl}
                    onChange={e => setNewApiUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                    API Secret Key / Credential
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    className="w-full bg-[#18181b] text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition font-mono"
                    value={newApiKey}
                    onChange={e => setNewApiKey(e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#18181b] border border-white/5 hover:bg-[#27272a] text-zinc-300 hover:text-white transition text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold transition text-sm disabled:opacity-50 cursor-pointer"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Register Integration</span>
                    </>
                  )
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function WebhookSimulator({ 
  endpoint, 
  method, 
  placeholder 
}: { 
  endpoint: string; 
  method: "POST" | "GET"; 
  placeholder?: string;
}) {
  const [payload, setPayload] = useState(placeholder || "");
  const [response, setResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleRunTest = async () => {
    setTesting(true);
    setResponse(null);
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" }
      };
      if (method === "POST" && payload) {
        options.body = payload;
      }
      
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const res = await fetch(cleanEndpoint, options);
      const data = await res.json();
      setIsSuccess(res.ok);
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setIsSuccess(false);
      setResponse(JSON.stringify({ error: "Network / execution error during simulation", message: err.message }, null, 2));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-[#0c0c0e] border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Test Sandbox</span>
          <span className="text-[10px] font-mono text-zinc-500">Local Sandbox Mode</span>
        </div>
        {method === "POST" && (
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={4}
            className="w-full bg-[#121215] text-zinc-100 text-xs font-mono rounded-lg p-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition resize-none"
            placeholder="Edit request payload body JSON..."
          />
        )}
      </div>

      <button
        onClick={handleRunTest}
        disabled={testing}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition text-xs font-semibold disabled:opacity-50 cursor-pointer"
      >
        {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        <span>{testing ? "Executing Simulated Call..." : "Execute simulated hook"}</span>
      </button>

      {response && (
        <div className="space-y-1 mt-2 animate-fadeIn">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-zinc-500">Simulation Response Output</span>
            <span className={isSuccess ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {isSuccess ? "200 OK" : "Error"}
            </span>
          </div>
          <pre className="max-h-48 overflow-y-auto bg-[#121215] border border-white/5 rounded-lg p-3 font-mono text-[11px] text-zinc-300 custom-scrollbar-dark">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
