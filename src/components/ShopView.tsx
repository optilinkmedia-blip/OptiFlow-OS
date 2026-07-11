import React, { useState } from "react";
import { ShoppingBag, ShoppingCart, Tag, CheckCircle2, Package, Sparkles, ExternalLink, HelpCircle } from "lucide-react";
import { AffiliateOffer, Article } from "../types";

interface ShopViewProps {
  offers: AffiliateOffer[];
  articles: Article[];
  onRefresh: () => void;
}

export default function ShopView({ offers, articles, onRefresh }: ShopViewProps) {
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<string>("");

  const handleSimulateCheckout = async (offer: AffiliateOffer) => {
    // Find a published article that promotes this offer's vertical/niche
    const matchingArticles = articles.filter(a => {
      if (a.offerId === offer.id) return true;
      const matchedOffer = offers.find(o => o.id === a.offerId);
      return matchedOffer && (matchedOffer.vertical || matchedOffer.category) === (offer.vertical || offer.category);
    });
    const targetArticle = matchingArticles.length > 0 ? matchingArticles[0] : null;

    if (!targetArticle) {
      setPurchaseStatus(`Error: No active review article found promoting "${offer.vertical || offer.category || "General"}". Please generate an article for this vertical first in the 'Drafts' tab!`);
      setTimeout(() => setPurchaseStatus(""), 5000);
      return;
    }

    setBuyingId(offer.id);
    setPurchaseStatus("Processing client handshake...");

    try {
      // Simulate click through the gateway
      await new Promise(r => setTimeout(r, 800));
      setPurchaseStatus("Logging referral traffic click...");
      await fetch(`/api/redirect?articleId=${targetArticle.id}&offer=${offer.id}&source=seo`, {
        mode: "no-cors"
      });

      // Simulate postback conversion
      await new Promise(r => setTimeout(r, 1000));
      setPurchaseStatus("Processing payment gateway token...");
      
      let token = "optiflow_postback_secure_token_2026";
      try {
        const tokenRes = await fetch("/api/postback-token");
        if (tokenRes.ok) {
          const data = await tokenRes.json();
          token = data.token;
        }
      } catch (e) {
        console.error("Failed to fetch postback token, using fallback", e);
      }

      const payoutVal = offer.payout ?? offer.commission ?? 0;
      const res = await fetch(`/api/postback?payout=${payoutVal}&articleId=${targetArticle.id}&source=seo&token=${token}`);
      if (res.ok) {
        setPurchaseStatus(`Purchase Successful! Registered a $${payoutVal.toFixed(2)} referral payout for "${offer.name}".`);
        onRefresh();
      } else {
        setPurchaseStatus("API postback node rejected checkout payload.");
      }
    } catch (err) {
      setPurchaseStatus("Connection interrupted during checkout.");
    } finally {
      setTimeout(() => {
        setBuyingId(null);
        setPurchaseStatus("");
      }, 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="shop-view-root">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-emerald-500" />
          Programmatic Store Showcase
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          Review front-end product displays. Every product matches an affiliate offer; customers click, visit review articles, and buy, triggering automated tracking.
        </p>
      </div>

      {/* FTC Affiliate Disclosure Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3.5 text-xs text-emerald-300 flex items-start gap-2.5">
        <span className="font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">FTC Compliance</span>
        <p>
          <strong>Disclosure:</strong> Clicking these links may register a referral commission for this platform at no extra cost to you.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase font-bold">Catalog Size</div>
            <div className="text-lg font-bold text-white mt-0.5">{offers.length} Products Active</div>
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase font-bold">Store Status</div>
            <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live & Synced
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase font-bold">Target Niche Coverage</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {Array.from(new Set(offers.map(o => o.vertical))).length} Core Verticals
            </div>
          </div>
        </div>
      </div>

      {/* Main product listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => {
          const matchedArt = articles.find(a => a.offerId === offer.id);
          return (
            <div 
              key={offer.id} 
              className="rounded-xl border border-white/5 bg-[#1f1e24] overflow-hidden flex flex-col hover:border-white/10 transition-all duration-300 group shadow-lg"
            >
              {/* Image box placeholder with nice colors */}
              <div className="h-40 bg-linear-to-br from-[#2b2a31] to-[#121215] relative flex items-center justify-center p-6 border-b border-white/5">
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono font-bold text-[#22c55e] uppercase tracking-wider">
                  {offer.network}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-white/60">
                  {offer.vertical || offer.category}
                </div>
                
                <div className="text-center space-y-2">
                  <Tag className="h-8 w-8 text-white/20 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-[11px] text-white/30 font-mono font-semibold tracking-wider uppercase">OFFER_CAMPAIGN</div>
                </div>
              </div>

              {/* Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#22c55e] transition">
                    {offer.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <span>Promoted by:</span>
                    {matchedArt ? (
                      <span className="text-[#22c55e] font-semibold underline truncate max-w-[150px]" title={matchedArt.title}>
                        {matchedArt.title}
                      </span>
                    ) : (
                      <span className="text-amber-500 font-medium">No published review article</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-b border-white/5 py-2">
                  <div>
                    <span className="text-[9px] font-mono text-white/40 uppercase font-bold">Suggested Retail Price</span>
                    <div className="text-base font-extrabold text-[#22c55e] font-mono mt-0.5">
                      ${((offer.payout ?? offer.commission ?? 0) * 2.5).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-white/40 uppercase font-bold">Your Commission Payout</span>
                    <div className="text-xs font-bold text-white mt-0.5 font-mono">
                      ${(offer.payout ?? offer.commission ?? 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Simulated Purchase Button */}
                <button
                  onClick={() => handleSimulateCheckout(offer)}
                  disabled={buyingId !== null}
                  className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-white transition-all text-xs font-semibold text-white/80 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-[#121215] disabled:text-white/20 disabled:cursor-not-allowed shadow-xs"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {buyingId === offer.id ? "Checking Out..." : "Simulate Customer Checkout"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Status Reporter */}
      {purchaseStatus && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-[#22c55e]/20 bg-[#121215] p-4 shadow-2xl max-w-sm animate-slideIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Checkout Simulator Gateway</span>
              <p className="text-xs text-white/80 leading-relaxed font-sans">{purchaseStatus}</p>
            </div>
          </div>
        </div>
      )}

      {/* Information block */}
      <div className="rounded-xl border border-white/5 bg-[#2b2a31] p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <HelpCircle className="h-4 w-4 text-[#22c55e]" />
          About Storefront Synchronization
        </h4>
        <p className="text-xs text-white/50 leading-relaxed">
          The storefront represents what your organic search/social visitors experience. When they search a keyword, land on a review article, or click pins, they are funneled here. Clicking <strong>Simulate Customer Checkout</strong> mimics the exact end-to-end user path: generating click sessions on the gateway, directing to the appropriate affiliate offers, and calling postback trackers. The dashboard's graphs, revenue streams, and daily charts will update instantly!
        </p>
      </div>
    </div>
  );
}
