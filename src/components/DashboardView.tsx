import React from "react";
import { ArrowUpRight, Flame, ShoppingCart, Activity, Download, FileText, Share2, Tag, SearchX } from "lucide-react";
import { Article, Pin, RevenueEvent, RevenueStats, SeedKeyword } from "../types";

interface DashboardViewProps {
  stats: RevenueStats;
  realtime: any[];
  events: RevenueEvent[];
  articles: Article[];
  seeds: SeedKeyword[];
  pins: Pin[];
  queueActiveCount: number;
  onRefresh: () => void;
  onProcessQueue: () => void;
  searchQuery?: string;
}

export default function DashboardView({
  stats,
  realtime,
  events,
  articles,
  seeds,
  pins,
  queueActiveCount,
  searchQuery = "",
}: DashboardViewProps) {
  const epc = stats.totalClicks > 0 ? (stats.totalRevenue / stats.totalClicks) : 0;

  const exportData = () => {
    const dataToExport = { stats, articles, seeds };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optiflow-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Revenue chart setup for Bar Chart
  const revenuePoints = stats.recentRevenue?.length > 0 ? stats.recentRevenue : [0, 0, 0, 0, 0, 0, 0];
  const maxRevenue = Math.max(...revenuePoints, 10);
  const chartHeight = 120;
  
  // Calculate percentage of mobile (we map this to SEO vs Pinterest traffic approx)
  const totalPinterest = events.filter(e => e.source === 'pinterest').length;
  const totalSeo = events.filter(e => e.source === 'seo').length;
  const combined = totalPinterest + totalSeo || 1;
  const greenPercentage = Math.round((totalPinterest / combined) * 100) || 45;

  // Search filtering logic
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filteredSeeds = isSearching ? seeds.filter(s => s.keyword.toLowerCase().includes(normalizedQuery)) : [];
  const filteredArticles = isSearching ? articles.filter(a => a.title.toLowerCase().includes(normalizedQuery) || a.keyword.toLowerCase().includes(normalizedQuery)) : [];
  const filteredPins = isSearching ? pins.filter(p => p.title.toLowerCase().includes(normalizedQuery) || (p.description && p.description.toLowerCase().includes(normalizedQuery))) : [];

  const hasSearchResults = filteredSeeds.length > 0 || filteredArticles.length > 0 || filteredPins.length > 0;

  if (isSearching) {
    return (
      <div className="space-y-6 animate-fadeIn" id="dashboard-view-root">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100 mb-6">Search Results for "{searchQuery}"</h2>
        
        {!hasSearchResults ? (
          <div className="bg-[#18181b] rounded-2xl p-12 flex flex-col items-center justify-center text-center border border-white/5">
            <div className="h-16 w-16 bg-[#27272a] rounded-full flex items-center justify-center mb-4">
              <SearchX className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-zinc-100 font-medium mb-2">No results found</h3>
            <p className="text-zinc-500 text-sm max-w-sm">We couldn't find any seeds, articles, or pins matching your search query.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredSeeds.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Tag className="w-4 h-4" /> Seeds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSeeds.map(seed => (
                    <div key={seed.id} className="bg-[#18181b] border border-white/5 p-4 rounded-xl shadow-sm">
                      <div className="font-semibold text-zinc-100 mb-1">{seed.keyword}</div>
                      <div className="text-xs text-zinc-500 font-mono">Keywords: {seed.keywordCount} • Articles: {seed.articleCount} • Rev: ${seed.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {filteredArticles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map(article => (
                    <div key={article.id} className="bg-[#18181b] border border-white/5 p-4 rounded-xl shadow-sm">
                      <div className="font-semibold text-zinc-100 mb-1 truncate">{article.title}</div>
                      <div className="text-xs text-zinc-500 truncate">{article.keyword}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredPins.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Share2 className="w-4 h-4" /> Pins</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPins.map(pin => (
                    <div key={pin.id} className="bg-[#18181b] border border-white/5 p-4 rounded-xl shadow-sm flex items-start gap-4">
                      {pin.mockImageUrl && (
                        <img src={pin.mockImageUrl} alt={pin.title} className="w-16 h-16 object-cover rounded-lg bg-[#27272a]" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-100 mb-1 truncate text-sm">{pin.title}</div>
                        <div className="text-xs text-zinc-500 font-mono capitalize">{pin.published ? "Published" : "Draft"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn" id="dashboard-view-root">
      
      <div className="flex justify-end">
        <button 
          onClick={exportData}
          className="flex items-center gap-2 bg-[#18181b] border border-white/5 hover:bg-[#27272a] text-zinc-300 text-xs px-4 py-2 rounded-full transition shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Overview & Product View) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Overview Card */}
          <div className="bg-[#18181b] rounded-2xl p-6 relative overflow-hidden border border-white/5">
             
             <div className="flex justify-between items-center mb-6 text-sm">
                <h2 className="text-zinc-100 font-medium tracking-tight">Overview</h2>
                <div className="bg-[#09090b] border border-white/5 text-zinc-400 px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 cursor-pointer hover:text-zinc-100 transition shadow-sm">
                  Last 7 days
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-[#09090b] rounded-xl p-5 shadow-sm border border-white/5">
                 <div className="flex items-center gap-2 text-zinc-500 text-[12px] mb-2 font-medium">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                   Yield Revenue
                 </div>
                 <div className="flex items-baseline gap-3">
                   <span className="text-3xl font-bold text-zinc-100 tracking-tight">${stats.totalRevenue.toFixed(0)}</span>
                   <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                     <ArrowUpRight className="h-3 w-3" />
                     +14.2%
                   </div>
                 </div>
               </div>

               <div className="bg-[#09090b] rounded-xl p-5 shadow-sm border border-white/5">
                 <div className="flex items-center gap-2 text-zinc-500 text-[12px] mb-2 font-medium">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3V3"></path><path d="M21 9l-9-9-4 4 9 9"></path><path d="M3 21l9-9 4 4-9 9"></path></svg>
                   Site Sessions
                 </div>
                 <div className="flex items-baseline gap-3">
                   <span className="text-3xl font-bold text-zinc-100 tracking-tight">{stats.totalClicks}k</span>
                   <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                     <ArrowUpRight className="h-3 w-3" />
                     +36.8%
                   </div>
                   <span className="text-zinc-600 text-[10px] ml-1">vs last month</span>
                 </div>
               </div>
             </div>

             <div className="mb-2">
               <h3 className="text-sm font-medium text-zinc-100">{stats.totalClicks || 0} new engagements today!</h3>
               <p className="text-xs text-zinc-500 mt-1">Review the latest analytics from your active campaigns.</p>
             </div>
             
             <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-3">
                  {stats.totalClicks > 0 ? (
                    <div className="w-10 h-10 rounded-full border-2 border-[#18181b] bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500 italic">No engagements yet</div>
                  )}
                </div>
                <button className="h-10 w-10 rounded-full bg-[#09090b] border border-white/5 flex items-center justify-center hover:bg-white/5 transition ml-2 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
             </div>
          </div>

          {/* Product View Barchart */}
          <div className="bg-[#18181b] rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-sm">
             <div className="flex justify-between items-center mb-8 text-sm">
                <h2 className="text-zinc-100 font-medium tracking-tight">Revenue view</h2>
                <div className="bg-[#09090b] border border-white/5 text-zinc-400 px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 cursor-pointer hover:text-zinc-100 transition shadow-sm">
                  Last 7 days
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
             </div>

             <div className="flex flex-col relative h-[180px]">
                <div className="absolute top-10 left-0">
                  <h3 className="text-3xl font-bold tracking-tight text-zinc-100">${(stats.totalRevenue > 0 ? stats.totalRevenue : 0).toFixed(2)}</h3>
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold w-fit mt-3">
                     <ArrowUpRight className="h-3 w-3" />
                     +{stats.totalRevenue > 0 ? '36.8' : '0.0'}% <span className="text-emerald-500/60 font-normal">vs last month</span>
                  </div>
                </div>

                {/* Right side bars */}
                <div className="absolute right-0 bottom-0 top-0 flex items-end gap-3 w-1/2 justify-end pt-8">
                  {revenuePoints.slice(-6).map((val, idx) => {
                    const isActive = idx === revenuePoints.slice(-6).length - 1 && val > 0; 
                    const height = maxRevenue === 0 ? 20 : (val / maxRevenue) * chartHeight;
                    const minHeight = Math.max(height, 20); // minimum visual height
                    const displayVal = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(1);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 group w-full">
                        {isActive && (
                           <div className="bg-[#09090b] text-xs text-zinc-100 px-2 py-0.5 rounded-full shadow-lg border border-white/10 relative -top-2">
                             ${displayVal}
                           </div>
                        )}
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-300 ${isActive ? 'bg-emerald-500' : 'bg-[#27272a]'}`} 
                          style={{ height: `${minHeight}px` }} 
                        />
                        <span className="text-[10px] text-zinc-500">{stats.dates?.[stats.dates.length - 6 + idx]?.split(' ')[1] || (idx + 14)}</span>
                      </div>
                    )
                  })}
                </div>
             </div>
          </div>
          
        </div>


        {/* Right Column (Devices & Popular Products) */}
        <div className="flex flex-col gap-6">
          
          {/* Devices Donut Chart */}
          <div className="bg-[#18181b] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/5" style={{ minHeight: '300px' }}>
            <h2 className="text-zinc-100 font-medium tracking-tight text-sm mb-6">Traffic Context</h2>
            
            <div className="relative flex-1 flex justify-center items-center my-6">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Background Ring */}
                <circle cx="96" cy="96" r="64" stroke="#09090b" strokeWidth="16" fill="transparent" />
                {/* Foreground Green Ring */}
                <circle 
                  cx="96" 
                  cy="96" 
                  r="64" 
                  stroke="#10b981" 
                  strokeWidth="16" 
                  fill="transparent" 
                  strokeDasharray={`${greenPercentage * 4.02} 402`} 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-3xl font-bold text-zinc-100 tracking-tight">{greenPercentage}%</span>
                 <span className="text-xs text-zinc-500 mt-1">Pinterest</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto px-4 text-xs font-mono">
               <div className="flex flex-col items-center gap-1 text-zinc-500 border-t-2 border-emerald-500 pt-2">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                 <span>{greenPercentage}%</span>
               </div>
               <div className="flex flex-col items-center gap-1 text-zinc-600 hover:text-zinc-400 transition">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                 <span>17.1%</span>
               </div>
               <div className="flex flex-col items-center gap-1 text-zinc-600 hover:text-zinc-400 transition">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                 <span>{100 - greenPercentage - 17.1}%</span>
               </div>
            </div>
          </div>

          {/* Popular Products List */}
          <div className="bg-[#18181b] rounded-2xl p-6 relative overflow-hidden flex-1 border border-white/5 shadow-sm">
             <h2 className="text-zinc-100 font-medium tracking-tight text-sm mb-6">Top performing articles</h2>
             
             <div className="space-y-4">
               {realtime.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-[#27272a]"></div>
                         <div>
                           <div className="h-3 w-24 bg-[#27272a] rounded animate-pulse mb-2"></div>
                           <div className="h-2 w-16 bg-[#27272a] rounded animate-pulse"></div>
                         </div>
                      </div>
                    </div>
                  ))
               ) : (
                 realtime.slice(0, 3).map((m, idx) => (
                   <div key={idx} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0 group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/5 bg-[#27272a]">
                           <img 
                             className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                             src={`https://images.unsplash.com/photo-${1614088019688 + idx}?w=100&h=100&fit=crop`} 
                             alt="article cover" 
                           />
                        </div>
                        <div className="min-w-0 pr-4">
                           <h4 className="text-xs font-semibold text-zinc-100 truncate max-w-[140px] leading-tight">{m.title}</h4>
                           <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{m.traffic_source} engine</p>
                        </div>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-zinc-100 tracking-wider">${(m.revenue_last_5min || 0).toFixed(2)}</p>
                        <p className="text-[9px] font-bold text-emerald-500 mt-1 pt-0.5 uppercase tracking-widest text-emerald-500/90">Active</p>
                     </div>
                   </div>
                 ))
               )}
             </div>

             <button className="w-full mt-6 py-2 border border-white/5 rounded-xl text-xs text-zinc-400 hover:text-zinc-100 hover:bg-[#27272a]/50 hover:border-white/10 transition font-medium backdrop-blur-sm shadow-sm">
               All articles
             </button>
          </div>

        </div>

      </div>

    </div>
  );
}
