import React, { useState } from "react";
import { BookOpen, Calendar, ChevronRight, Eye, FileText, Globe, Search } from "lucide-react";
import { Article } from "../types";

interface ContentFactoryViewProps {
  articles: Article[];
  offers: any[];
}

export default function ContentFactoryView({ articles, offers }: ContentFactoryViewProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const getOfferName = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    return offer ? `${offer.name} (${offer.network})` : "Unassigned Offer";
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="content-factory-root">
      
      {/* Header description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Content Factory (Layer 2)
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          The Production Engine translates high-intent keywords into multi-thousand word affiliate assets, strategic FAQ grids, and Call-to-Action routing scripts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Comprehensive programmatic campaign articles feed */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-1 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#22c55e]" />
              Programmatic Feed
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Select an article to review standard markdown drafts</p>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {articles.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/5 rounded-lg text-white/40 text-xs bg-[#2b2a31]">
                No articles drafted yet.<br />
                <span className="text-[9px] text-white/40 mt-1 block">Queue keyword expansion tasks to automate.</span>
              </div>
            ) : (
              articles.map((article) => {
                const isActive = article.id === selectedArticleId;
                return (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticleId(article.id)}
                    className={`group relative flex flex-col gap-2 rounded-lg border p-3.5 cursor-pointer transition ${
                      isActive
                        ? "border-[#22c55e] bg-[#22c55e]/10"
                        : "border-white/5 bg-[#2b2a31] hover:border-white/5 hover:bg-[#2b2a31]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                          article.status === 'published' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
                          article.status === 'queued' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-[#35343d] text-white/50'
                        }`}>
                          {article.status}
                        </span>
                        {article.abTest && article.abTest.active && (
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase bg-amber-500/10 text-amber-500">
                             A/B
                          </span>
                        )}
                        {article.abTest && !article.abTest.active && (
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase bg-[#22c55e]/10 text-[#22c55e]">
                             A/B DONE
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-white/40 font-mono">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-white/90 group-hover:text-[#22c55e] transition leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-[11px] text-white/40 line-clamp-2">
                      {article.metaDescription}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-white/40 font-mono border-t border-white/5 pt-2 mt-1">
                      <span>CTR Clicks: <strong className="text-white/70 font-bold">{article.clicks || 0}</strong></span>
                      <span className="text-emerald-600 font-bold">${(article.revenue || 0).toFixed(2)}</span>
                    </div>

                    <div className="absolute right-3.5 bottom-12 opacity-0 group-hover:opacity-100 transition duration-205">
                      <ChevronRight className="h-4 w-4 text-[#22c55e]/80" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Programmatic Article Drafting Board (Full Details Panel) */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-2 space-y-5">
          {!selectedArticle ? (
            <div className="flex flex-col items-center justify-center py-28 text-center text-white/40 border border-dashed border-white/5 bg-[#2b2a31] rounded-xl">
              <BookOpen className="h-10 w-10 text-white/30 mb-2" />
              <span className="text-xs font-semibold">No Article Selected</span>
              <p className="text-[10px] text-white/40 max-w-xs mt-0.5">
                Select an article from the programmatic feed sidebar to review titles, meta tags, and FAQ placements.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#22c55e] font-mono font-bold uppercase">Keyword Target:</span>
                    <span className="text-[10px] text-white/80 underline font-mono tracking-wide">{selectedArticle.keyword}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white/90 mt-1 leading-tight">{selectedArticle.title}</h2>
                </div>

                <div className="text-right p-3 rounded-lg border border-white/5 bg-[#2b2a31] shrink-0 self-start">
                  <div className="text-[9px] text-white/40 font-mono uppercase tracking-wide">Assigned Offer</div>
                  <div className="text-xs font-bold text-[#22c55e] mt-0.5">{getOfferName(selectedArticle.offerId)}</div>
                  {selectedArticle.abTest && (
                    <div className="mt-1 pt-1 border-t border-white/5">
                      {selectedArticle.abTest.active ? (
                        <span className="flex items-center justify-end gap-1 text-[9px] text-amber-500 font-mono font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> A/B Testing
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-500 font-mono font-bold text-right block">A/B Winner Locked</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Metrics */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-3">
                  <div className="text-[9px] text-white/40 font-mono uppercase font-bold">STATUS</div>
                  <div className="text-xs font-bold text-white/70 uppercase mt-0.5">{selectedArticle.status}</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-3">
                  <div className="text-[9px] text-white/40 font-mono uppercase font-bold">TOTAL CLICKS</div>
                  <div className="text-xs font-bold text-white/70 mt-0.5">{selectedArticle.clicks || 0} visits</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-3">
                  <div className="text-[9px] text-white/40 font-mono uppercase font-bold">CONVERSIONS</div>
                  <div className="text-xs font-bold text-white/70 mt-0.5">{selectedArticle.conversions || 0} sales</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-3">
                  <div className="text-[9px] text-white/40 font-mono uppercase font-bold">YIELD VALUATION</div>
                  <div className="text-xs font-bold text-[#22c55e] mt-0.5 font-mono">${(selectedArticle.revenue || 0).toFixed(2)}</div>
                </div>
              </div>

              {/* A/B Test Metrics (If available) */}
              {selectedArticle.abTest && (
                <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-4 mt-2">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">
                    <span>Performance Split Testing</span>
                    {selectedArticle.abTest.active ? (
                      <span className="text-amber-500 px-1.5 py-0.5 bg-amber-500/10 rounded">Tracking Traffic</span>
                    ) : (
                      <span className="text-emerald-500 px-1.5 py-0.5 bg-emerald-500/10 rounded">Test Finalized</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedArticle.abTest.offers.map((offerTest, idx) => {
                      const isWinner = !selectedArticle.abTest?.active && selectedArticle.abTest?.winnerOfferId === offerTest.offerId;
                      const flagged = offerTest.flaggedForReview;
                      return (
                        <div key={idx} className={`rounded p-2.5 border ${isWinner ? 'border-[#22c55e]/30 bg-[#22c55e]/5' : (flagged ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5 bg-[#1f1e24]')}`}>
                           <div className="flex justify-between items-center text-xs font-bold text-white/90 mb-2">
                             <span>{getOfferName(offerTest.offerId)}</span>
                             {isWinner && <span className="text-[#22c55e] text-[9px] uppercase tracking-wide">★ Winner</span>}
                             {flagged && <span className="text-rose-400 text-[9px] uppercase tracking-wide">⚠ Flagged</span>}
                           </div>
                           <div className="grid grid-cols-3 gap-2 text-center">
                             <div>
                               <div className="text-[9px] text-white/40">Clicks</div>
                               <div className="text-xs font-mono font-bold text-white/70">{offerTest.clicks}</div>
                             </div>
                             <div>
                               <div className="text-[9px] text-white/40">Sales</div>
                               <div className="text-xs font-mono font-bold text-[#22c55e]">{offerTest.conversions}</div>
                             </div>
                             <div>
                               <div className="text-[9px] text-white/40">EPC</div>
                               <div className="text-xs font-mono font-bold text-white/70">${(offerTest.epc || 0).toFixed(2)}</div>
                             </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tabs for Structured Metadata vs Markdown Body */}
              <div className="space-y-4">
                
                {/* Meta properties Card */}
                <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-3.5 space-y-1">
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">SEO Meta Description Tags</div>
                  <p className="text-xs text-white/50 italic">{selectedArticle.metaDescription}</p>
                </div>

                {/* Article Markdown body container */}
                <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-5 space-y-4 shadow-xs">
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest border-b border-white/5 pb-1.5">Full Affiliate Document Body</div>
                  
                  <div className="text-white/70 space-y-3.5 max-h-96 overflow-y-auto leading-relaxed text-xs pr-1 select-text">
                    {/* Render basic markdown syntax */}
                    {selectedArticle.content.split("\n\n").map((para, pIdx) => {
                      if (para.startsWith("##")) {
                        return <h3 key={pIdx} className="text-sm font-bold text-white/80 font-sans mt-3">{para.replace("##", "").trim()}</h3>;
                      }
                      if (para.startsWith("###")) {
                        return <h4 key={pIdx} className="text-[11px] font-bold text-[#22c55e] font-sans mt-2">{para.replace("###", "").trim()}</h4>;
                      }
                      if (para.startsWith("1.") || para.startsWith("-")) {
                        return (
                          <div key={pIdx} className="pl-3.5 space-y-1 my-1.5">
                            {para.split("\n").map((li, lIdx) => (
                              <div key={lIdx} className="text-[11px] text-white/50 list-item list-disc pl-0.5">{li.replace("-", "").trim()}</div>
                            ))}
                          </div>
                        );
                      }
                      return <p key={pIdx}>{para}</p>;
                    })}
                  </div>
                </div>

                {/* FAQ grid system */}
                {selectedArticle.faqs && selectedArticle.faqs.length > 0 && (
                  <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-4 space-y-2.5">
                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">FAQ Accordion Structure (SEO Schema)</div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      {selectedArticle.faqs.map((faq, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-lg border border-white/5 bg-[#1f1e24] shadow-xs">
                          <p className="text-[11px] font-bold text-[#22c55e]">Q: {faq.question}</p>
                          <p className="text-[11px] text-white/50 mt-0.5">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to Actions & Strategic Placement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-4 space-y-2 animate-fadeIn">
                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Call-To-Action (CTA) Scripts</div>
                    <ul className="list-disc list-inside text-xs text-white/70 space-y-1.5 pl-1 leading-tight">
                      {selectedArticle.ctas?.map((cta, cIdx) => (
                        <li key={cIdx} className="text-[11px]">{cta}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-4 space-y-2 animate-fadeIn">
                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Strategic Placement Triggers</div>
                    <ul className="list-disc list-inside text-xs text-indigo-705/85 space-y-1.5 pl-1 leading-tight">
                      {selectedArticle.affiliatePlacements?.map((plc, pIdx) => (
                        <li key={pIdx} className="text-[11px]">{plc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
