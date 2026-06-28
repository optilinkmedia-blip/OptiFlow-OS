import React, { useState, useEffect } from "react";
import { Link, Map, MessageSquare, Send, Share2, TrendingUp, Settings } from "lucide-react";
import { Pin } from "../types";
import { fetchIntegrations } from "../lib/api";

interface DistributionViewProps {
  pins: Pin[];
  onTriggerCycle: () => void;
}

export default function DistributionView({ pins, onTriggerCycle }: DistributionViewProps) {
  const [autoPost, setAutoPost] = useState(false);
  const [scraperStatus, setScraperStatus] = useState<string>("disconnected");

  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        const integrations = await fetchIntegrations();
        const scraper = integrations.find((i: any) => i.id === "pinterest_scraper5");
        if (scraper) {
          setScraperStatus(scraper.status);
        }
      } catch (err) {
        console.error("Failed to load scraper status:", err);
      }
    };
    loadIntegrations();
  }, []);

  const publishedPins = pins.filter(p => p.published);
  const totalClicks = pins.reduce((a, b) => a + (b.clicks || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn" id="distribution-view-root">
      
      {/* Header description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Distribution Sync (Layer 3)
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          The Traffic Syndication Engine drives immediate organic social viewers. In seconds, visual pin boards and Telegram bulletins are drafted and distributed.
        </p>
      </div>

      {/* Grid overview */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">SOCIALLY ENGAGED PINS</div>
          <div className="text-xl font-bold text-white/90 mt-0.5">{pins.length} crafted</div>
          <p className="text-[10px] text-white/40 mt-0.5">Active on public Pinterest Boards</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">TELEGRAM BULLETINS</div>
          <div className="text-xl font-bold text-white/90 mt-0.5">4 Channels Active</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Status: Syndicating hourly</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">SOCIAL TRAFFIC VOLUMES</div>
          <div className="text-xl font-bold text-white/90 mt-0.5">{totalClicks} clicks</div>
          <p className="text-[10px] text-[#22c55e] font-bold mt-0.5">Social click engagement rate 2.4%</p>
        </div>
      </div>

      {/* Content Columns: Pinterest Panels vs Telegram automation bulletin boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pinterest Graphics Board list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white/90">Programmatic Pinterest Board Syndicator</h2>
              <p className="text-xs text-white/40 mt-0.5">High-CTR pin graphics designed automatically matching campaign keywords</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoPost(!autoPost)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoPost ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoPost ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/90">Auto-post</span>
                  <span className={`text-[9px] font-mono ${scraperStatus === 'connected' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    Scraper: {scraperStatus}
                  </span>
                </div>
              </div>
              
              {pins.length > 0 && pins.some(p => !p.published) && (
                <button
                  onClick={onTriggerCycle}
                  className="text-xs text-[#22c55e] hover:text-[#22c55e] font-bold hover:underline cursor-pointer ml-2 border-l border-white/10 pl-4"
                >
                  Publish drafts live
                </button>
              )}
            </div>
          </div>

          {pins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-150 bg-[#2b2a31] rounded-xl">
              <Share2 className="h-8 w-8 text-white/30 mb-2" />
              <span className="text-xs text-white/40 font-mono">Pinterest assets empty</span>
              <p className="text-[10px] text-white/40 mt-0.5">Discovered seed keywords automatic generate Pinterest boards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pins.map((pin) => (
                <div key={pin.id} className="group relative overflow-hidden rounded-lg border border-white/5 bg-[#1f1e24] hover:border-[#22c55e]/20 hover:shadow-md transition duration-300 shadow-xs">
                  
                  {/* Mock Image Preview area overlay with gradients and text */}
                  <div className="relative h-40 w-full bg-[#35343d] overflow-hidden flex items-center justify-center border-b border-white/5">
                    {pin.imageUrl ? (
                      <img 
                        src={pin.imageUrl} 
                        alt="Pin mock" 
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-75"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 bg-[#27272a]">
                        Pending Image Generation
                      </div>
                    )}
                    
                    {/* Artistic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    
                    {/* Absolute layout badge */}
                    <span className={`absolute top-2.5 left-2.5 inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase ${
                      pin.published ? 'bg-[#22c55e]/10/90 text-white' : 'bg-amber-500/10/90 text-white'
                    }`}>
                      {pin.published ? 'published' : 'draft'}
                    </span>

                    {/* Overlay Text in Pinterest visual layout style */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-[9px] text-[#22c55e]/60 uppercase font-mono tracking-wider font-bold">Pinterest Target Angle</p>
                      <h4 className="text-xs font-bold text-white tracking-tight leading-tight line-clamp-2 mt-0.5 text-shadow-sm">
                        {pin.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body textual information */}
                   <div className="p-3.5 space-y-3">
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans line-clamp-2">
                      {pin.description}
                    </p>

                    <div className="rounded-lg border border-white/5 bg-[#2b2a31] p-2.5 space-y-1 flex flex-col">
                      <div className="text-[8px] uppercase tracking-wider font-mono text-white/40 font-bold">Creative Prompts Editor</div>
                      <p className="text-[10px] text-white/50 italic line-clamp-2 font-mono leading-tight">
                        &ldquo;{pin.imagePrompt}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-2.5">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <TrendingUp className="h-3.5 w-3.5 text-[#22c55e]/80" />
                        <span>CTR Clicks: <span className="text-white/70 font-bold">{pin.clicks || 0}</span></span>
                      </div>
                      
                      <a 
                        href={pin.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#22c55e] hover:text-[#22c55e] flex items-center gap-1 font-bold"
                      >
                        <Link className="h-3 w-3" />
                        Route Test
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Telegram Channels bullet boards list */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              <Send className="h-4 w-4 text-[#22c55e]" />
              Telegram syndication
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Automated broadcasting feeds pushing to monetized web channels</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[#22c55e]/10 text-emerald-400">
                    <Send className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-bold text-white/90">@CashFlowStudents</span>
                </div>
                <span className="text-[9px] text-emerald-600 bg-[#22c55e]/10 px-1.5 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                Broadcasting: Summarizing and pushing draft articles formatted with markdown tags and quick MaxBounty redirects hourly to 5,420 subscribers.
              </p>
              <div className="text-[9px] text-white/40 font-mono flex items-center justify-between">
                <span>Viewers: 1.2k avg</span>
                <span className="text-[#22c55e] font-semibold">CTR clicks: 124</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 space-y-3 shadow-sm font-sans text-white/50">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[#22c55e]/10 text-emerald-400">
                    <Send className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-bold text-white/90">@RemoteWork_Careers</span>
                </div>
                <span className="text-[9px] text-emerald-600 bg-[#22c55e]/10 px-1.5 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Relaying: Broadcasting curated career-centric articles directly. Integrates custom affiliate links targeting high EPC ScribeGenius SaaS network commissions.
              </p>
              <div className="text-[9px] text-white/40 font-mono flex items-center justify-between">
                <span>Viewers: 3,920 avg</span>
                <span className="text-[#22c55e] font-semibold">CTR clicks: 232</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4 space-y-3 shadow-sm font-sans text-white/50">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[#22c55e]/10 text-[#22c55e]">
                    <Send className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-bold text-white/90">@AI_Marketing_Blueprint</span>
                </div>
                <span className="text-[9px] text-emerald-600 bg-[#22c55e]/10 px-1.5 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Broadcasting: Auto-releasing reviews on digital tools and templates. Tracking conversions securely via server-side postbacks.
              </p>
              <div className="text-[9px] text-white/40 font-mono flex items-center justify-between">
                <span>Viewers: 1.8k avg</span>
                <span className="text-[#22c55e] font-semibold">CTR clicks: 76</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
