import React, { useEffect, useState } from "react";
import { fetchSeoConfig, updateSeoConfig, generateSeoConfig } from "../lib/api";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { 
  Globe, 
  Search, 
  FileText, 
  Check, 
  Loader2, 
  Sparkles, 
  Eye, 
  HelpCircle, 
  Info, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  Laptop,
  Smartphone,
  Sun,
  Moon,
  Download,
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter
} from "lucide-react";

type SortKey = 'keyword' | 'rankingPosition' | 'searchVolume' | 'status';

const MOCK_KEYWORD_PERFORMANCE = [
  { id: '1', keyword: 'best affiliate programs', rankingPosition: 3, searchVolume: 12500, status: 'Stable' },
  { id: '2', keyword: 'make money online', rankingPosition: 8, searchVolume: 45000, status: 'Rising' },
  { id: '3', keyword: 'passive income ideas', rankingPosition: 12, searchVolume: 22000, status: 'Rising' },
  { id: '4', keyword: 'how to start a blog', rankingPosition: 5, searchVolume: 18000, status: 'Stable' },
  { id: '5', keyword: 'seo tips 2026', rankingPosition: 24, searchVolume: 9500, status: 'Declining' },
  { id: '6', keyword: 'pinterest marketing', rankingPosition: 2, searchVolume: 14000, status: 'Rising' },
  { id: '7', keyword: 'chatgpt prompts for seo', rankingPosition: 1, searchVolume: 50000, status: 'Rising' },
];

export default function SeoView() {
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  
  // Interactive simulator states
  const [searchQuery, setSearchQuery] = useState("marketing automation");
  const [mockArticleTitle, setMockArticleTitle] = useState("Ultimate Guide to High-Conversion Copywriting");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("dark");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [filterQuery, setFilterQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'asc' | 'desc' }>({ key: 'searchVolume', direction: 'desc' });

  const sortedAndFilteredKeywords = MOCK_KEYWORD_PERFORMANCE
    .filter(item => item.keyword.toLowerCase().includes(filterQuery.toLowerCase()) || item.status.toLowerCase().includes(filterQuery.toLowerCase()))
    .sort((a, b) => {
      const isAsc = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * isAsc;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * isAsc;
      return 0;
    });

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDownloadCsv = async () => {
    setIsDownloading(true);
    setMessage("");
    try {
      const { fetchKeywords } = await import("../lib/api");
      const keywords = await fetchKeywords();
      if (!keywords || keywords.length === 0) {
        setIsSuccess(false);
        setMessage("No expanded keywords available to download.");
        return;
      }

      const headers = ["Opportunity Keyword", "Intent Level", "Search Volume", "CPC Avg", "Difficulty"];
      const rows = keywords.map(kw => [
        `"${kw.keyword.replace(/"/g, '""')}"`,
        kw.type,
        kw.searchVolume || 0,
        kw.cpc || 0,
        kw.difficulty
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `seo_keywords_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsSuccess(true);
      setMessage("Keywords CSV downloaded successfully!");
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(`Download failed: ${err.message || String(err)}`);
    } finally {
      setIsDownloading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    setMessage("");
    try {
      const result = await generateSeoConfig();
      setSiteTitle(result.siteTitle);
      setSiteDescription(result.siteDescription);
      setIsSuccess(true);
      setMessage("AI successfully analyzed search engine performance metrics and populated optimal branding values!");
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(`AI Generation failed: ${err.message || String(err)}`);
    } finally {
      setIsAiGenerating(false);
      setTimeout(() => setMessage(""), 7000);
    }
  };

  useEffect(() => {
    fetchSeoConfig().then(config => {
      setSiteTitle(config.siteTitle || "");
      setSiteDescription(config.siteDescription || "");
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      await updateSeoConfig({ siteTitle, siteDescription });
      setIsSuccess(true);
      setMessage("Site configuration successfully committed to the database ledger.");
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(`Commit failed: ${err.message || String(err)}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Helper to highlight matching words for real search engine feel
  const renderHighlightedDescription = (desc: string, query: string) => {
    const isLight = previewTheme === "light";
    const placeholderClass = isLight ? "text-zinc-400 italic" : "text-zinc-500 italic";
    const highlightClass = isLight ? "text-zinc-950 font-bold bg-amber-100 px-0.5 rounded" : "text-zinc-100 font-bold bg-zinc-800/80 px-0.5 rounded";
    const textClass = isLight ? "text-zinc-600 text-xs" : "text-zinc-400 text-xs";

    if (!desc) {
      return <span className={placeholderClass}>Please provide a site description to preview.</span>;
    }

    // Google truncates description at roughly 155 characters for SERPs
    const truncatedDesc = desc.length > 155 ? `${desc.slice(0, 155)}...` : desc;

    if (!query || query.trim() === "") return <span className={textClass}>{truncatedDesc}</span>;

    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return <span className={textClass}>{truncatedDesc}</span>;

    // Build regex to match any of the query words
    const pattern = new RegExp(`\\b(${words.join("|")})\\b`, "gi");
    const parts = truncatedDesc.split(pattern);

    return (
      <span className={textClass}>
        {parts.map((part, index) => 
          pattern.test(part) ? (
            <strong key={index} className={highlightClass}>{part}</strong>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Character evaluation metrics
  const titleLength = siteTitle.length;
  const descLength = siteDescription.length;

  const isTitleOptimal = titleLength >= 15 && titleLength <= 60;
  const isDescOptimal = descLength >= 50 && descLength <= 160;

  // Evaluation checklist
  const evaluations = [
    {
      id: "title-length",
      label: "Optimal Title Length (15 - 60 chars)",
      status: titleLength === 0 ? "idle" : isTitleOptimal ? "pass" : "fail",
      detail: `Current: ${titleLength} chars. Optimal index is 15-60.`
    },
    {
      id: "desc-length",
      label: "Optimal Description Length (50 - 160 chars)",
      status: descLength === 0 ? "idle" : isDescOptimal ? "pass" : "fail",
      detail: `Current: ${descLength} chars. Ideal length for SERP layouts is 50-160.`
    },
    {
      id: "branding",
      label: "Brand Integration Check",
      status: siteTitle.trim().length > 3 ? "pass" : "idle",
      detail: siteTitle.trim().length > 3 ? "Brand prefix is established." : "Add a clear brand name."
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn" id="seo-view-root">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Meta Context Injector
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Global SEO & Core Site Identity
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Configure default site branding parameters. OptiFlow embeds these values directly into the AI copywriting templates, tuning the tone, anchor keywords, and site credentials dynamically during generation.
          </p>
        </div>
        <button
          onClick={handleDownloadCsv}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#2b2a31] hover:bg-white/10 text-zinc-200 border border-white/5 transition cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 text-emerald-500" />}
          <span>Download Keyword CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Edit Configurations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6 gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-emerald-500" />
                <h2 className="text-sm font-bold text-zinc-200">Site Branding Values</h2>
              </div>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/35 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none shrink-0"
                id="seo-ai-generate-button"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Site Title */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    Global Site Title / Brand Header
                  </label>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    titleLength === 0 
                      ? 'text-zinc-500 bg-zinc-900' 
                      : isTitleOptimal 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10' 
                        : 'text-amber-400 bg-amber-500/10 border border-amber-500/10'
                  }`}>
                    {titleLength} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="e.g. OptiFlow Premium Labs"
                  maxLength={100}
                  className="w-full bg-[#0c0c0e] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 hover:border-white/10 transition"
                  id="seo-site-title-input"
                />
                <p className="text-[10px] text-zinc-500">
                  Acts as the brand suffix appended to article title tags (e.g., "Article Title | {siteTitle || 'Your Site'}").
                </p>
              </div>

              {/* Site Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-emerald-500" />
                    Global Site Pitch / Meta Description
                  </label>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    descLength === 0 
                      ? 'text-zinc-500 bg-zinc-900' 
                      : isDescOptimal 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10' 
                        : 'text-amber-400 bg-amber-500/10 border border-amber-500/10'
                  }`}>
                    {descLength} / 160 chars
                  </span>
                </div>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="e.g. The premier digital publishing lab and affiliate channel, detailing actionable guides on conversion models, SEO automation, and passive niche monetizations."
                  rows={4}
                  maxLength={300}
                  className="w-full bg-[#0c0c0e] text-zinc-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 hover:border-white/10 transition resize-none leading-relaxed"
                  id="seo-site-description-textarea"
                />
                <p className="text-[10px] text-zinc-500">
                  Communicates your niche authority to the copywriting engine, giving Gemini context on your target audience.
                </p>
              </div>

              {/* Status and Action bar */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-sm transition shadow-md hover:shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  id="seo-save-button"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Writing Configuration...</span>
                    </>
                  ) : (
                    <span>Commit Settings</span>
                  )}
                </button>

                {message && (
                  <div className={`text-xs font-semibold px-4 py-2.5 rounded-lg border flex items-center gap-2 animate-fadeIn ${
                    isSuccess 
                      ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" 
                      : "bg-red-500/5 text-red-400 border-red-500/10"
                  }`}>
                    {isSuccess ? <Check className="h-4 w-4 shrink-0" /> : <ShieldAlert className="h-4 w-4 shrink-0" />}
                    <span>{message}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Prompt injection insights */}
          <div className="bg-[#121215]/60 border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-emerald-500" />
              How this is injected into the Content Engine
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              When the keyword processing loop pulls a target cluster task from the pipeline, the system automatically fetches your current SEO Configuration. It injects these values directly into the core copywriting prompts as global website parameters.
            </p>
            <div className="bg-[#0c0c0e] border border-white/5 rounded-lg p-3 font-mono text-[10px] text-zinc-400 space-y-1 overflow-x-auto">
              <span className="text-zinc-600">// Core context injected to the AI copywriter</span>
              <div>Context: You are writing this for a site with the following properties:</div>
              <div className="text-emerald-400">  Global Site Title: {siteTitle || "[Site Title]"}</div>
              <div className="text-emerald-400">  Global Site Description: {siteDescription || "[Site Description]"}</div>
              <div className="text-zinc-500">Please ensure the article aligns with this global site context.</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Search Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Google SERP Preview simulator */}
          <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-emerald-500" />
                <h3 className="text-sm font-bold text-zinc-200">
                  Search Engine Preview
                </h3>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0c0c0e] p-1 rounded-xl border border-white/5">
                {/* Device Selector */}
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-zinc-800 text-emerald-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Switch to Desktop Search Layout"
                >
                  <Laptop className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-zinc-800 text-emerald-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Switch to Mobile Search Layout"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                {/* Theme Selector */}
                <button
                  type="button"
                  onClick={() => setPreviewTheme("light")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewTheme === "light"
                      ? "bg-zinc-800 text-amber-500"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Light Theme SERP Style"
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme("dark")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewTheme === "dark"
                      ? "bg-zinc-800 text-sky-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Dark Theme SERP Style"
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Analyze how your title tags and description pitch will appear to readers looking for topics on Google. Ensure key terms fit within the non-truncated safety limits.
            </p>

            {/* Simulated Google Search Box Input */}
            <div className="space-y-3 bg-[#0c0c0e]/80 border border-white/5 rounded-xl p-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Simulated Article Headline</span>
                  <span className="text-[9px] text-zinc-500 normal-case">Test title integration</span>
                </label>
                <input 
                  type="text" 
                  value={mockArticleTitle}
                  onChange={(e) => setMockArticleTitle(e.target.value)}
                  placeholder="e.g. 10 Methods to Automate Email Copy"
                  className="w-full bg-[#121215] text-zinc-200 text-xs rounded-lg px-3 py-2 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
                  id="seo-mock-headline-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  Highlight Search Query
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. copywriting, conversion"
                    className="w-full bg-[#121215] text-zinc-200 text-xs rounded-lg pl-9 pr-3 py-2 border border-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
                    id="seo-search-query-input"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Search Result Container */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Google Search Result (SERP View)
              </span>

              {/* Responsive Container Wrapper */}
              <div className={`transition-all duration-300 ${
                previewDevice === "mobile" 
                  ? "max-w-[340px] mx-auto border-4 border-zinc-800 rounded-[2rem] p-3 shadow-2xl bg-black relative" 
                  : "w-full"
              }`}>
                {previewDevice === "mobile" && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-800 rounded-full z-20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-zinc-900" />
                  </div>
                )}

                {/* Simulated Google SERP Wrapper */}
                <div className={`rounded-xl p-5 transition-colors duration-300 font-sans ${
                  previewTheme === "light" 
                    ? "bg-white border border-zinc-200 text-zinc-900" 
                    : "bg-[#202124] border border-zinc-800 text-zinc-100"
                } ${previewDevice === "mobile" ? "mt-4 text-[13px] leading-relaxed" : "text-sm"}`}>
                  
                  {/* Mock Site Favicon and Breadcrumb layout */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                      previewTheme === "light" 
                        ? "bg-zinc-100 border border-zinc-200 text-zinc-700" 
                        : "bg-zinc-800 border border-zinc-700 text-zinc-300"
                    }`}>
                      {siteTitle ? siteTitle.charAt(0).toUpperCase() : "G"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[11px] font-medium truncate ${
                        previewTheme === "light" ? "text-zinc-800" : "text-zinc-200"
                      }`}>
                        {siteTitle || "Your Website Niche"}
                      </span>
                      <div className={`flex items-center text-[10px] leading-none ${
                        previewTheme === "light" ? "text-zinc-500" : "text-zinc-400"
                      }`}>
                        <span className="truncate">
                          https://{siteTitle ? siteTitle.toLowerCase().replace(/[^a-z0-9]/g, "-") : "yoursite"}.com
                        </span>
                        <ChevronRight className="h-2.5 w-2.5 mx-0.5 shrink-0" />
                        <span className="truncate text-[9px] opacity-80">guide</span>
                      </div>
                    </div>
                  </div>

                  {/* Title Tag with real Google colors & dynamic Truncation */}
                  {(() => {
                    const fullTitle = `${mockArticleTitle || "Simulated Article Headline"} | ${siteTitle || "Your Niche Site"}`;
                    const isTitleTooLong = fullTitle.length > 60;
                    const truncatedTitle = isTitleTooLong ? `${fullTitle.slice(0, 60)}...` : fullTitle;

                    return (
                      <div className="space-y-1">
                        <h4 className={`font-medium tracking-normal hover:underline cursor-pointer leading-tight mb-1.5 break-words ${
                          previewDevice === "mobile" ? "text-base font-semibold" : "text-[19px] leading-snug"
                        } ${
                          previewTheme === "light" ? "text-[#1a0dab]" : "text-[#8ab4f8]"
                        }`}>
                          {truncatedTitle}
                        </h4>
                        
                        {isTitleTooLong && (
                          <div className="flex items-center gap-1 text-[9px] font-mono text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/15 self-start w-fit">
                            <span>Google will truncate this title (-{fullTitle.length - 60} chars)</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Meta snippet with highlight word processor */}
                  <div className="mt-1.5 leading-relaxed break-words text-xs">
                    <span className={`font-semibold mr-1 shrink-0 ${
                      previewTheme === "light" ? "text-zinc-600" : "text-zinc-400"
                    }`}>
                      Jul 3, 2026 — 
                    </span>
                    {renderHighlightedDescription(siteDescription, searchQuery)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic scorecard */}
          <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              SEO Quality Diagnostics
            </h3>

            <div className="space-y-3.5">
              {evaluations.map((item) => (
                <div key={item.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-zinc-300 font-medium leading-relaxed">{item.label}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.status === "pass" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : item.status === "fail"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {item.status === "pass" ? "PASSED" : item.status === "fail" ? "OPTIMIZE" : "STANDBY"}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SEO Performance Chart Section */}
      <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden mt-8">
        <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            <div>
              <h2 className="text-sm font-bold text-zinc-200">Keyword Performance Trends</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Simulated organic growth trajectory & visibility metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE DATA
            </span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { month: "Jan", traffic: 1200, keywords: 15 },
                { month: "Feb", traffic: 2100, keywords: 32 },
                { month: "Mar", traffic: 3800, keywords: 58 },
                { month: "Apr", traffic: 5400, keywords: 95 },
                { month: "May", traffic: 8900, keywords: 142 },
                { month: "Jun", traffic: 14200, keywords: 215, keywordForecast: 215 },
                { month: "Jul", keywordForecast: 340 },
                { month: "Aug", keywordForecast: 480 },
                { month: "Sep", keywordForecast: 650 },
              ]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKeywords" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#ffffff40" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
              />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#e4e4e7' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="traffic" 
                name="Organic Traffic"
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTraffic)" 
              />
              <Area 
                type="monotone" 
                dataKey="keywords" 
                name="Ranking Keywords"
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorKeywords)" 
              />
              <Area 
                type="monotone" 
                dataKey="keywordForecast" 
                name="AI Forecast (Keywords)"
                stroke="#a855f7" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorForecast)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keyword Performance Table */}
      <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 shadow-xl relative mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-white/5 mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-emerald-500" />
            <div>
              <h2 className="text-sm font-bold text-zinc-200">Keyword Performance Explorer</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Filter and sort your organic targets</p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter by keyword or status..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-mono tracking-wider text-white/40">
                <th 
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white/70 transition-colors"
                  onClick={() => handleSort('keyword')}
                >
                  <div className="flex items-center gap-1.5">
                    Keyword
                    {sortConfig.key === 'keyword' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                    {sortConfig.key !== 'keyword' && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white/70 transition-colors"
                  onClick={() => handleSort('rankingPosition')}
                >
                  <div className="flex items-center gap-1.5 justify-end">
                    Ranking Pos
                    {sortConfig.key === 'rankingPosition' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                    {sortConfig.key !== 'rankingPosition' && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white/70 transition-colors"
                  onClick={() => handleSort('searchVolume')}
                >
                  <div className="flex items-center gap-1.5 justify-end">
                    Volume
                    {sortConfig.key === 'searchVolume' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                    {sortConfig.key !== 'searchVolume' && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white/70 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                    {sortConfig.key !== 'status' && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {sortedAndFilteredKeywords.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-4 font-medium text-zinc-300">
                    {item.keyword}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400">
                    #{item.rankingPosition}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-zinc-400">
                    {item.searchVolume.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Rising' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.status === 'Stable' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sortedAndFilteredKeywords.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500 text-xs">
                    No keywords matched your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
