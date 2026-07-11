import React, { useState } from "react";
import { Activity, Link2, Copy, Play, Check, Send, AlertCircle, RefreshCw, Sparkles, HelpCircle, ArrowUpRight } from "lucide-react";
import { Article, AffiliateOffer } from "../types";

interface PromoteViewProps {
  articles: Article[];
  offers: AffiliateOffer[];
  onRefresh: () => void;
}

export default function PromoteView({ articles, offers, onRefresh }: PromoteViewProps) {
  // Short Link Generator State
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [selectedSource, setSelectedSource] = useState<"pinterest" | "seo" | "telegram">("pinterest");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Traffic Simulator State
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);
  const [trafficLogs, setTrafficLogs] = useState<string[]>([]);
  const [clicksCount, setClicksCount] = useState(0);

  const handleGenerateLink = () => {
    if (!selectedArticleId) return;
    const origin = window.location.origin;
    const art = articles.find(a => a.id === selectedArticleId);
    if (!art) return;
    const offer = offers.find(o => o.id === art.offerId) || offers[0];
    
    const url = `${origin}/api/redirect?articleId=${art.id}&offer=${offer?.id || ""}&source=${selectedSource}`;
    setGeneratedLink(url);
    setCopiedLink(false);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateTraffic = async () => {
    const publishedArticles = articles.filter(a => a.status === "published");
    if (publishedArticles.length === 0) {
      setTrafficLogs([
        "Error: No published articles in active inventory.",
        "Please go to 'Drafts' or 'Released' first and complete queue tasks to publish articles!"
      ]);
      return;
    }

    setIsSimulatingTraffic(true);
    setClicksCount(0);
    const logsList: string[] = ["Initializing Organic Traffic Syndication...", "Parsing social hashtags and keywords..."];
    setTrafficLogs([...logsList]);

    let token = "optiflow_postback_secure_token_2026";
    try {
      const tokenRes = await fetch("/api/postback-token");
      if (tokenRes.ok) {
        const data = await tokenRes.json();
        token = data.token;
      }
    } catch (e) {
      console.error("Failed to fetch postback token", e);
    }

    const sources: Array<"pinterest" | "seo" | "telegram"> = ["pinterest", "seo", "telegram"];

    // Run 5 sequential simulated clicks over 5 seconds
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const randomArticle = publishedArticles[Math.floor(Math.random() * publishedArticles.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomOffer = offers.find(o => o.id === randomArticle.offerId) || offers[0];

      // Call redirect API to log the click session on the server
      await fetch(`/api/redirect?articleId=${randomArticle.id}&offer=${randomOffer.id}&source=${randomSource}`, {
        mode: "no-cors"
      });

      const newClickLog = `[Traffic] Click #${i} received from ${randomSource.toUpperCase()} on "${randomArticle.title.substring(0, 24)}..."`;
      logsList.push(newClickLog);
      setTrafficLogs([...logsList]);
      setClicksCount(prev => prev + 1);

      // Randomly determine if this click converts into a sale (35% probability)
      if (Math.random() < 0.35) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        await fetch(`/api/postback?payout=${randomOffer.payout}&articleId=${randomArticle.id}&source=${randomSource}&token=${token}`);
        
        const newSaleLog = `🔥 [Sale] SUCCESSFUL CONVERSION! $${randomOffer.payout.toFixed(2)} credited to network from ${randomSource.toUpperCase()}`;
        logsList.push(newSaleLog);
        setTrafficLogs([...logsList]);
      }
    }

    logsList.push("Organic Traffic Simulation sequence complete.");
    setTrafficLogs([...logsList]);
    setIsSimulatingTraffic(false);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="promote-view-root">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-500" />
          Promotional syndication (Layer 5)
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          Generate traffic-ready affiliate tracking urls, launch organic syndication bursts, and test routing parameters in real-time.
        </p>
      </div>

      {/* FTC Affiliate Disclosure Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3.5 text-xs text-emerald-300 flex items-start gap-2.5">
        <span className="font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">FTC Compliance</span>
        <p>
          <strong>Disclosure:</strong> Clicking these links may register a referral commission for this platform at no extra cost to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Short Link Generator Box */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Link2 className="h-4 w-4 text-[#22c55e]" />
              Smart Affiliate URL Builder
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Compile customized redirect URLs with tracking cookies for cross-channel promotions</p>
          </div>

          <div className="space-y-4">
            {/* Choose Article */}
            <div className="rounded-lg border border-white/5 bg-[#1f1e24] focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/30 transition px-3 py-2">
              <label className="text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold block">Select Review Campaign</label>
              <select
                value={selectedArticleId}
                onChange={(e) => setSelectedArticleId(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-xs text-white/70 font-semibold focus:outline-none focus:ring-0 mt-1"
              >
                <option value="" className="bg-[#1f1e24]">-- Select Active Review Article --</option>
                {articles.map(a => (
                  <option key={a.id} value={a.id} className="bg-[#1f1e24] text-white/95">
                    {a.title} ({a.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Choose Source */}
            <div className="rounded-lg border border-white/5 bg-[#1f1e24] focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/30 transition px-3 py-2">
              <label className="text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold block">Target Social Channel</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as any)}
                className="w-full border-0 bg-transparent p-0 text-xs text-white/70 font-semibold focus:outline-none focus:ring-0 mt-1"
              >
                <option value="pinterest" className="bg-[#1f1e24]">Pinterest Boards (Visual)</option>
                <option value="seo" className="bg-[#1f1e24]">SEO Organic Search</option>
                <option value="telegram" className="bg-[#1f1e24]">Telegram Channels (Broadcasts)</option>
              </select>
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerateLink}
              disabled={!selectedArticleId}
              className="w-full py-2 px-4 rounded-lg bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold text-xs transition cursor-pointer disabled:bg-[#35343d] disabled:text-white/40 shadow-xs"
            >
              Generate Programmatic Short-Link
            </button>

            {/* Display generated Link */}
            {generatedLink && (
              <div className="rounded-lg bg-zinc-950/40 border border-white/5 p-3.5 space-y-2 animate-fadeIn">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">SYNDICATED ROUTING LINK</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 bg-transparent border-0 font-mono text-[10px] text-zinc-300 focus:ring-0 p-0 overflow-ellipsis"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition flex items-center justify-center"
                    title="Test Redirect"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Traffic Simulator Console Box */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              Syndicated Traffic Simulator
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Mock organic visitors traversing Pinterest boards & Telegram groups to check postback triggers</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSimulateTraffic}
              disabled={isSimulatingTraffic}
              className="w-full py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:bg-[#121215] disabled:text-white/20"
            >
              <Play className="h-4 w-4" />
              {isSimulatingTraffic ? `Generating traffic (${clicksCount}/5 clicks)...` : "Simulate Social Organic Traffic Surge"}
            </button>

            {/* Simulation logs panel */}
            <div className="rounded-lg bg-zinc-950/70 border border-white/5 h-44 p-4 font-mono text-[10px] space-y-1.5 overflow-y-auto custom-scrollbar-dark select-none">
              <div className="text-[9px] text-zinc-500 border-b border-white/5 pb-1 uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
                <span>SIMULATOR CONSOLE LEDGER</span>
                {isSimulatingTraffic && <span className="text-emerald-400 animate-pulse font-medium">LIVE STREAMS CONNECTED</span>}
              </div>
              {trafficLogs.length === 0 ? (
                <div className="text-zinc-600 italic h-full flex items-center justify-center">
                  Press 'Simulate Social Organic Traffic' to generate traffic bursts.
                </div>
              ) : (
                trafficLogs.map((log, index) => (
                  <p 
                    key={index} 
                    className={`${
                      log.startsWith("Error") ? "text-rose-400" :
                      log.includes("CONVERSION") ? "text-emerald-400 font-bold bg-emerald-950/20 px-1 py-0.5 rounded" :
                      log.startsWith("[Traffic]") ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    &gt; {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Social template assets row */}
      <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Social Syndication templates
          </h2>
          <p className="text-xs text-white/40 mt-0.5">Pre-crafted visual angle descriptions synced with AI-CEO copy guidelines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="rounded-lg border border-white/5 bg-zinc-950/20 p-4 space-y-2">
            <span className="text-[9px] font-mono font-bold text-pink-400 uppercase tracking-wide">PINTEREST LIFESTYLE CARD</span>
            <p className="text-white/70 italic">"Achieving your healthy weights has never been this effortless! 🌸 No exhausting gym hours, no strict limits. Discover the exact ritual leading fitness coaches recommend for quick metabolic reset. Read our complete review below! #wellness #weightloss #healthylifestyle"</p>
          </div>

          <div className="rounded-lg border border-white/5 bg-zinc-950/20 p-4 space-y-2">
            <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-wide">TELEGRAM BROADCAST DIGEST</span>
            <p className="text-white/70 italic">"🚀 SaaS Workflow Alert: Stop manual data typing. We audited the top-performing AI tools that trim 15+ hours from spreadsheet sorting. Complete comparison and discount gateways are listed inside our new report: check link below!"</p>
          </div>
        </div>
      </div>

      {/* Details Box */}
      <div className="rounded-xl border border-white/5 bg-[#2b2a31] p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <HelpCircle className="h-4 w-4 text-[#22c55e]" />
          Trafficking Mechanics & Security Rules
        </h4>
        <p className="text-xs text-white/50 leading-relaxed">
          Social syndication leverages our multi-tier shortlink tracking system. The shortlink uses HTTP 307 redirects to log the visitor’s device parameters, geographic data, and original referrers on our database prior to routing to the destination page. This maintains a clean and secure campaign hierarchy, filtering bots and crawling spiders to safeguard affiliate networks from malicious traffic.
        </p>
      </div>

    </div>
  );
}
