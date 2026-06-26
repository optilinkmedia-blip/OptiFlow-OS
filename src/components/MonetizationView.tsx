import React, { useState } from "react";
import { Coins, Copy, ExternalLink, HelpCircle, Landmark, Play, ShieldCheck, TrendingUp } from "lucide-react";
import { AffiliateOffer, Article } from "../types";

interface MonetizationViewProps {
  offers: AffiliateOffer[];
  articles: Article[];
  onRefresh: () => void;
}

export default function MonetizationView({ offers, articles, onRefresh }: MonetizationViewProps) {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [testArticleId, setTestArticleId] = useState("");
  const [testSource, setTestSource] = useState<"pinterest" | "seo" | "telegram">("pinterest");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMsg, setSimulationMsg] = useState("");

  const selectedOffer = offers.find(o => o.id === selectedOfferId);

  // Trigger simulated conversion via actual server API endpoints!
  const handleSimulateConversion = async () => {
    if (!testArticleId) return;
    const art = articles.find(a => a.id === testArticleId);
    if (!art) return;
    const offer = offers.find(o => o.id === art.offerId) || offers[0];

    setIsSimulating(true);
    setSimulationMsg("Initializing postback handshake...");

    try {
      // First hit redirect gateway to log click
      await fetch(`/api/redirect?articleId=${art.id}&offer=${offer.id}&source=${testSource}`, {
        mode: "no-cors"
      });
      
      setSimulationMsg("Handshake successful. Dispatching postback ping...");
      
      // Hit postback node to register conversion
      const res = await fetch(`/postback?payout=${offer.payout}&articleId=${art.id}&source=${testSource}`);
      if (res.ok) {
        setSimulationMsg(`Success! $${offer.payout.toFixed(2)} payout posted to Article ID "${art.id}".`);
        onRefresh();
      } else {
        setSimulationMsg("Postback server rejected ping.");
      }
    } catch (err) {
      setSimulationMsg("Postback execution failed.");
    } finally {
      setTimeout(() => {
        setIsSimulating(false);
        setSimulationMsg("");
      }, 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="monetization-view-root">
      
      {/* Header description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Monetization Bridge (Layer 4)
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          The Yield Mapping and Monetization Engine. Integrates ClickBank commissions, MaxBounty CPA gates, and SaaS subscriptions, matching the highest EPC offer against target content keywords.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Affiliate Offers Table list */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-2 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-[#22c55e]" />
              Affiliate Offers Catalog
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Affiliate campaigns and pricing metrics currently synced with programmatic models</p>
          </div>

          <div className="border border-white/5 rounded-lg bg-[#1f1e24] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#2b2a31] text-[9px] uppercase font-mono tracking-wider text-white/40">
                  <th className="py-2.5 px-3">Offer Name Campaign</th>
                  <th className="py-2.5 px-3 text-center">Network</th>
                  <th className="py-2.5 px-3 text-center">Vertical</th>
                  <th className="py-2.5 px-3 text-right">Target Payout</th>
                  <th className="py-2.5 px-3 text-right">System EPC</th>
                  <th className="py-2.5 px-3 text-center">Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-white/70">
                {offers.map((offer) => (
                  <tr 
                    key={offer.id} 
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={`cursor-pointer transition duration-150 ${
                      selectedOfferId === offer.id 
                        ? 'bg-[#22c55e]/10 text-white font-semibold' 
                        : 'hover:bg-[#2b2a31]'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-white/90">
                      {offer.name}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                        offer.network === 'MaxBounty' ? 'bg-red-50 text-red-700' :
                        offer.network === 'ClickBank' ? 'bg-amber-500/10 text-amber-700' :
                        'bg-[#35343d] text-white/80'
                      }`}>
                        {offer.network}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-white/50 font-medium">
                      {offer.vertical}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                      ${offer.payout.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-white/70 font-semibold">
                      ${offer.epc.toFixed(2)} EPC
                    </td>
                    <td className="py-3 px-3 text-center">
                      <a 
                        href={offer.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#22c55e] hover:text-[#22c55e] hover:underline font-bold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Source <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {selectedOffer && (
            <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-3.5 space-y-1.5 animate-fadeIn">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wide font-bold">Selected Offer Blueprint</span>
              <h3 className="text-xs font-bold text-white/90">{selectedOffer.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                EPC Performance metrics indicate that matching this offer with long-tail phrases in the <span className="text-[#22c55e] font-sans font-bold">{selectedOffer.vertical}</span> niche yields solid user engagement. Currently optimized for Pinterest lifestyle angles.
              </p>
            </div>
          )}
        </div>

        {/* Real-time postback simulator / Testing suite */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Conversion Tracking Test
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Simulate postbacks to verify that EPC aggregation operates correctly on the backend server</p>
          </div>

          {articles.filter(a => a.status === 'published').length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-lg text-white/40 text-xs bg-[#2b2a31]">
              No published articles.<br />
              <span className="text-[9px] text-white/40 mt-1 block">Publish content in the Seeds view before testing clicks.</span>
            </div>
          ) : (
            <div className="space-y-4 font-sans text-white/50">
              
              {/* Select target published article */}
              <div className="rounded-lg border border-white/5 bg-[#1f1e24] focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/30 transition px-3 py-2">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold block">Select Article to hit</label>
                <select
                  value={testArticleId}
                  onChange={(e) => setTestArticleId(e.target.value)}
                  className="w-full border-0 bg-transparent p-0 text-xs text-white/70 font-semibold focus:outline-none focus:ring-0 mt-1"
                >
                  <option value="" className="bg-[#1f1e24]">-- Choose Campaign --</option>
                  {articles.filter(a => a.status === 'published').map(a => (
                    <option key={a.id} value={a.id} className="bg-[#1f1e24] text-white/90">
                      {a.title.substring(0, 30)}... (EPC: ${a.epc.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select simulated source */}
              <div className="rounded-lg border border-white/5 bg-[#1f1e24] focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/30 transition px-3 py-2">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold block">Simulated Visitor Traffic Source</label>
                <select
                  value={testSource}
                  onChange={(e) => setTestSource(e.target.value as any)}
                  className="w-full border-0 bg-transparent p-0 text-xs text-white/70 font-semibold focus:outline-none focus:ring-0 mt-1"
                >
                  <option value="pinterest" className="bg-[#1f1e24] text-white/90">Pinterest Feed (Viral boards)</option>
                  <option value="seo" className="bg-[#1f1e24] text-white/90">Google Organic (programmatic SEO)</option>
                  <option value="telegram" className="bg-[#1f1e24] text-white/90">Telegram Channels (syndication)</option>
                </select>
              </div>

              {/* Action trigger button */}
              <button
                onClick={handleSimulateConversion}
                disabled={!testArticleId || isSimulating}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] hover:bg-[#22c55e]/80 disabled:bg-[#35343d] disabled:text-white/40 text-white px-4 py-2 text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                <Play className="h-4 w-4" />
                {isSimulating ? "Tracking Activity..." : "Trigger Simulated Sale"}
              </button>

              {/* Micro diagnostic notifications logs under simulation */}
              {simulationMsg && (
                <div className="rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/10 p-3 flex flex-col gap-1 items-start text-[10px] font-mono select-none text-emerald-800">
                  <span className="text-emerald-700 font-bold uppercase tracking-wider">&gt; POSTBACK_LOG</span>
                  <p className="text-white/70 font-sans mt-0.5">{simulationMsg}</p>
                </div>
              )}

              <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-4 space-y-2 text-[11px] leading-relaxed">
                <div className="flex items-center gap-1.5 text-white/80 font-bold uppercase text-[9px] tracking-wider">
                  <HelpCircle className="h-3.5 w-3.5 text-[#22c55e]/80" />
                  How conversions work:
                </div>
                <p className="text-white/50">
                  The system tracks visitors using custom server-side routes. A link click directs the user to our Express gateway <code className="text-[#22c55e] font-mono font-bold">/redirect</code>. If a purchase follows, the advertiser’s server triggers our postback node <code className="text-emerald-600 font-mono font-bold">/postback</code>, which logs conversions directly in our database.
                </p>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
