import React, { useState } from "react";
import { Copy, Plus, Search, Sparkles, Sprout, TrendingUp, Activity, AlertTriangle, Compass, DollarSign, Flame, Globe, Heart, Award, Check, Download } from "lucide-react";
import { ExpandedKeyword, SeedKeyword } from "../types";

interface SeedsViewProps {
  seeds: SeedKeyword[];
  keywords: ExpandedKeyword[];
  onAddSeed: (keyword: string) => void;
  onTriggerCycle: () => void;
  isSubmitting: boolean;
}

export default function SeedsView({
  seeds,
  keywords,
  onAddSeed,
  onTriggerCycle,
  isSubmitting
}: SeedsViewProps) {
  const [newSeedText, setNewSeedText] = useState("");
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [intelligenceTab, setIntelligenceTab] = useState<"pinterest" | "serp" | "fusion">("pinterest");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeedText.trim()) return;
    onAddSeed(newSeedText.trim());
    setNewSeedText("");
  };

  const filteredKeywords = selectedSeedId
    ? keywords.filter(k => k.seedId === selectedSeedId)
    : keywords;

  const currentSeed = seeds.find(s => s.id === selectedSeedId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Silent confirmation
  };

  const handleDownloadCsv = () => {
    if (filteredKeywords.length === 0) return;
    
    const headers = ["Opportunity Keyword", "Intent Level", "Search Volume", "CPC Avg", "Difficulty"];
    const rows = filteredKeywords.map(kw => [
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
    link.setAttribute("download", `keywords_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="seeds-view-root">
      
      {/* Header description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Discovery Engine (Layer 1)
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          Provide a core seed keyword. The Opportunity Engine crawls demand, expands search intent, and creates long-tail campaign assets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Seed keyword feed input list */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-1 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-[#22c55e]" />
              Source Seed Keywords
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Insert seeds to activate autonomous marketing runs</p>
          </div>

          {/* Core Input box */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative rounded-lg border border-white/5 bg-[#1f1e24] focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/30 transition px-3 py-2">
              <label className="text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold block">Seed Keyword / Topic</label>
              <input
                type="text"
                value={newSeedText}
                onChange={(e) => setNewSeedText(e.target.value)}
                placeholder="e.g. make money online for students"
                className="w-full border-0 bg-transparent p-0 text-xs text-white/90 focus:outline-none focus:ring-0 placeholder-slate-400 mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !newSeedText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] hover:bg-[#22c55e]/80 disabled:bg-[#35343d] disabled:text-white/40 text-white px-4 py-2 text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Expelling Seeds..." : "Plunge Seed Keyword"}
            </button>
          </form>

          {/* Quick manual simulation trigger if needed */}
          {seeds.length > 0 && seeds.some(s => s.keywordCount === 0) && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 flex flex-col gap-1.5 shadow-xs">
              <p className="text-[10px] text-amber-800 font-bold">Unexpanded seed topics detected in memory.</p>
              <button
                onClick={onTriggerCycle}
                className="text-left text-xs text-amber-700 font-bold hover:underline cursor-pointer"
              >
                Trigger discovery cycles manually &rarr;
              </button>
            </div>
          )}

          {/* Active seed rows list */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Active Pipelines</h3>
            
            {seeds.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/5 rounded-lg text-white/40 text-xs bg-[#2b2a31]">
                No seed keywords added yet.
              </div>
            ) : (
              seeds.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSeedId(s.id === selectedSeedId ? null : s.id)}
                  className={`flex flex-col gap-1.5 rounded-lg border p-3.5 cursor-pointer transition ${
                    s.id === selectedSeedId
                      ? "border-[#22c55e] bg-[#22c55e]/10 shadow-xs"
                      : "border-white/5 bg-[#2b2a31] hover:border-white/5 hover:bg-slate-55/65"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-white/90 truncate pr-2">{s.keyword}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'active' ? 'bg-[#22c55e]/10 animate-pulse' : 'bg-slate-300'}`} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/50 font-mono tracking-wide">
                    <span>Expanded: <strong className="text-white/70 font-bold">{s.keywordCount || 0}</strong></span>
                    <span>Articles: <strong className="text-white/70 font-bold">{s.articleCount || 0}</strong></span>
                    <span className="text-emerald-605 font-bold">${(s.revenue || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Opportunity Keywords Feed Output list */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-2 space-y-6">
          
          {/* Market Intelligence Fusion Report Card */}
          {currentSeed && (
            <div className="rounded-xl border border-slate-150 bg-[#2b2a31] p-5 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5/60 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                    <Activity className="h-4 w-4 text-rose-500 animate-pulse" />
                    OptiFlow Demand Intelligence Center
                  </h3>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    Real-time market insights aggregated for seed topic <strong className="text-white/70 font-bold">"{currentSeed.keyword}"</strong>
                  </p>
                </div>
                
                {/* Integration Status Indicator */}
                <div className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 text-[9px] font-mono font-medium text-[#22c55e] shadow-3xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]/10 animate-pulse" />
                  Demand Intelligence Sync Enabled
                </div>
              </div>

              {currentSeed.intelligenceFusion ? (
                <div className="space-y-4">
                  {/* Selector Tabs */}
                  <div className="flex border-b border-white/5 text-xs">
                    <button
                      onClick={() => setIntelligenceTab("pinterest")}
                      className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-medium transition cursor-pointer -mb-[1px] ${
                        intelligenceTab === "pinterest"
                          ? "border-rose-500 text-rose-600 font-bold"
                          : "border-transparent text-white/50 hover:text-white/90"
                      }`}
                    >
                      <svg className="h-3.5 w-3.5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.07 2.71 7.5 6.47 8.61-.09-.76-.17-1.92.04-2.75l1.62-6.88s-.4-.82-.4-2c0-1.88 1.09-3.28 2.45-3.28 1.15 0 1.71.87 1.71 1.91 0 1.16-.74 2.88-1.12 4.49-.32 1.34.67 2.43 1.99 2.43 2.39 0 4.22-2.52 4.22-6.15 0-3.21-2.31-5.46-5.61-5.46-3.83 0-6.08 2.87-6.08 5.84 0 1.16.45 2.4 1.01 3.07a.38.38 0 01.09.35c-.1.42-.32 1.3-.36 1.48-.06.24-.2.32-.45.2-1.63-.76-2.65-3.14-2.65-5.06 0-4.12 3-7.9 8.63-7.9 4.53 0 8.05 3.23 8.05 7.54 0 4.5-2.84 8.12-6.78 8.12-1.32 0-2.57-.69-3-1.5l-.81 3.1c-.29 1.12-1.1 2.53-1.64 3.41C10.02 21.68 11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                      </svg>
                      Pinterest Scraper (Step 1)
                    </button>
                    <button
                      onClick={() => setIntelligenceTab("serp")}
                      className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-medium transition cursor-pointer -mb-[1px] ${
                        intelligenceTab === "serp"
                          ? "border-sky-500 text-sky-600 font-bold"
                          : "border-transparent text-white/50 hover:text-white/90"
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5 text-sky-500" />
                      Google SERP Intent (Step 2)
                    </button>
                    <button
                      onClick={() => setIntelligenceTab("fusion")}
                      className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-medium transition cursor-pointer -mb-[1px] ${
                        intelligenceTab === "fusion"
                          ? "border-violet-500 text-violet-600 font-bold"
                          : "border-transparent text-white/50 hover:text-white/90"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      Growth Fusion Engine (Step 3)
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {intelligenceTab === "pinterest" && (
                    <div className="space-y-3">
                      <div className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">
                        Extracted Viral Pinterest Hooks & Engagement Gaps
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentSeed.intelligenceFusion.pinterestData.map((pin, i) => (
                          <div key={i} className="rounded-lg border border-white/5 bg-[#1f1e24] p-3 space-y-2 select-text hover:border-rose-500/20 transition">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[11px] font-semibold text-white/90 line-clamp-2 leading-snug">
                                {pin.title}
                              </span>
                              <span className="shrink-0 flex items-center gap-0.5 rounded bg-rose-500/10 px-1 py-0.5 text-[9px] font-bold text-rose-600 font-mono">
                                <Flame className="h-2.5 w-2.5 text-rose-500 animate-pulse" />
                                {pin.pinCount}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1 text-[9px] text-white/50 font-mono">
                              <span className="bg-[#35343d] rounded px-1 text-white/70 font-bold">palette:</span>
                              <span className="text-white/70 italic font-medium">{pin.visualStyle}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {pin.viralKeywords.map((kw, idx) => (
                                <span key={idx} className="bg-rose-500/10 text-rose-700 font-bold font-mono text-[8px] rounded px-1.5 py-0.2">
                                  #{kw.replace(/\s+/g, '')}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {intelligenceTab === "serp" && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">
                          Google Search Engine Results Pages (SERP) Gaps
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-white/50 font-mono font-bold uppercase">Commercial intent:</span>
                          <span className="text-[10px] text-sky-700 bg-sky-500/10 font-bold px-1.5 py-0.5 rounded border border-sky-100">{currentSeed.intelligenceFusion.serpData.intentLevel}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-150 bg-[#1f1e24] p-3 space-y-2">
                          <div className="text-[9px] text-white/40 uppercase font-mono font-bold flex items-center gap-1 border-b border-white/5 pb-1">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            General Organic Trends
                          </div>
                          <ul className="text-[11px] text-white/70 space-y-1.5">
                            {currentSeed.intelligenceFusion.serpData.rankingTrends.map((t, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 shrink-0 font-bold mt-0.5"><Check className="h-3 w-3" /></span>
                                <span className="leading-relaxed">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-lg border border-slate-150 bg-[#1f1e24] p-3 space-y-2">
                          <div className="text-[9px] text-white/40 uppercase font-mono font-bold flex items-center gap-1 border-b border-white/5 pb-1">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            Underserved Content Gaps
                          </div>
                          <ul className="text-[11px] text-white/70 space-y-1.5">
                            {currentSeed.intelligenceFusion.serpData.contentGaps.map((cg, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-500 shrink-0 font-bold mt-0.5"><AlertTriangle className="h-3 w-3" /></span>
                                <span className="leading-relaxed">{cg}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {intelligenceTab === "fusion" && (
                    <div className="space-y-3">
                      <div className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-wider">
                        Autonomous SaaS Growth & Affiliate Fusion Framework
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-white/40 uppercase font-mono flex items-center gap-1">
                              <Compass className="h-3.5 w-3.5 text-[#22c55e]/80" />
                              Viral Traffic Angle
                            </div>
                            <ul className="text-[11px] text-white/70 pl-4 list-disc space-y-1">
                              {currentSeed.intelligenceFusion.fusionReport.viralAngles.map((va, idx) => (
                                <li key={idx} className="leading-relaxed">{va}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-white/40 uppercase font-mono flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5 text-rose-500" />
                              Psychological Desire
                            </div>
                            <ul className="text-[11px] text-white/70 pl-4 list-disc space-y-1">
                              {currentSeed.intelligenceFusion.fusionReport.emotionalHooks.map((eh, idx) => (
                                <li key={idx} className="leading-relaxed">{eh}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-white/40 uppercase font-mono flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              Monetization Gate Mechanics
                            </div>
                            <ul className="text-[11px] text-white/70 pl-4 list-disc space-y-1">
                              {currentSeed.intelligenceFusion.fusionReport.monetizablePatterns.map((mp, idx) => (
                                <li key={idx} className="leading-relaxed">{mp}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-white/40 uppercase font-mono flex items-center gap-1">
                              <Award className="h-3.5 w-3.5 text-amber-500" />
                              High-Yield Affiliate Matching
                            </div>
                            <ul className="text-[11px] text-white/70 pl-4 list-disc space-y-1">
                              {currentSeed.intelligenceFusion.fusionReport.affiliateOpportunities.map((ao, idx) => (
                                <li key={idx} className="leading-relaxed">{ao}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-white/40 border border-dashed border-white/5/80 rounded-lg">
                  <span className="flex h-2 w-2 rounded-full bg-amber-450 animate-ping mb-2" />
                  <span className="text-[11px] font-mono text-white/70 font-semibold uppercase">Formulating Fusion Intelligence Report...</span>
                  <p className="text-[10px] text-white/40 max-w-sm mt-1">
                    This seed's scraper tasks are currently queued. Complete the pending queue cycles to overlay Pinterest engagement metrics & Google SERP gaps.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#22c55e]/80" />
                {currentSeed ? `"${currentSeed.keyword}" Opportunities` : "Accrued Opportunities Engine Feed"}
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                {currentSeed ? `Showing ${filteredKeywords.length} keywords expanded from seed` : `Programmatic index of all ${filteredKeywords.length} long-tail targets`}
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {selectedSeedId && (
                <button
                  onClick={() => setSelectedSeedId(null)}
                  className="text-xs text-[#22c55e] hover:text-[#22c55e] font-bold hover:underline text-left cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
              {filteredKeywords.length > 0 && (
                <button
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2b2a31] hover:bg-white/10 text-zinc-200 border border-white/5 transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Download CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* Expanded Keyword list rows */}
          {filteredKeywords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-150 bg-[#2b2a31] rounded-xl">
              <Search className="h-8 w-8 text-white/30 mb-2" />
              <span className="text-xs text-white/40 font-mono">Opportunity table empty</span>
              <p className="text-[10px] text-white/40 max-w-sm mt-0.5">
                Add a seed keyword in the input column to initiate real-time AI research operations.
              </p>
            </div>
          ) : (
            <div className="border border-white/5 rounded-lg bg-[#1f1e24] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#2b2a31] text-[9px] uppercase font-mono tracking-wider text-white/40">
                      <th className="py-2.5 px-3">Opportunity Keyword</th>
                      <th className="py-2.5 px-3">Intent Level</th>
                      <th className="py-2.5 px-3 text-right">Search Volume</th>
                      <th className="py-2.5 px-3 text-right">CPC Avg</th>
                      <th className="py-2.5 px-3 text-center">Difficulty</th>
                      <th className="py-2.5 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-white/70">
                    {filteredKeywords.map((kw) => (
                      <tr key={kw.id} className="hover:bg-[#2b2a31] transition duration-150">
                        <td className="py-3 px-3 font-semibold text-white/90">
                          {kw.keyword}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            kw.type === 'buyer-intent' ? 'bg-indigo-55 text-[#22c55e]' :
                            kw.type === 'pinterest-search' ? 'bg-rose-55 text-rose-700' :
                            kw.type === 'problem-based' ? 'bg-amber-55 text-amber-700' :
                            'bg-teal-55 text-teal-700'
                          }`}>
                            {kw.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-white/70">
                          {(kw.searchVolume || 0).toLocaleString()} /mo
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-white/70">
                          ${(kw.cpc || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            kw.difficulty === 'high' ? 'bg-rose-500/10 text-rose-600' :
                            kw.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-[#22c55e]/10 text-emerald-600'
                          }`}>
                            {kw.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => copyToClipboard(kw.keyword)}
                            className="text-white/40 hover:text-[#22c55e] p-1 rounded transition cursor-pointer"
                            title="Copy Keyword"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
