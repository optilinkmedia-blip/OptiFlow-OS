import React from "react";
import { ArrowUpRight, Flame, ShoppingCart, Activity, Download, FileText, Share2, Tag, SearchX } from "lucide-react";
import { Article, Pin, RevenueEvent, RevenueStats, SeedKeyword } from "../types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function Sparkline({ data, color = "#10b981", height = 36 }: { data: number[], color?: string, height?: number }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min === 0 ? 1 : max - min;
  
  const width = 100;
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const gradId = `sparkline-grad-${color.replace('#', '')}`;

  return (
    <div className="relative" style={{ height: `${height}px`, width: `${width}px` }}>
      <svg className="overflow-visible" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaD}
          fill={`url(#${gradId})`}
          stroke="none"
        />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3}
          r="2"
          fill={color}
        />
      </svg>
    </div>
  );
}

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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-950/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-xs font-mono min-w-[160px] select-none pointer-events-none transition-all">
        <div className="border-b border-white/5 pb-1.5 mb-2">
          <p className="text-zinc-400 font-medium">{data.date}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Revenue
            </span>
            <span className="text-emerald-400 font-bold">${data.revenue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Clicks
            </span>
            <span className="text-sky-400 font-medium">{data.clicks}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

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

  // Format data for Recharts Line Chart
  const chartData = (stats.recentRevenue || []).map((revenue, index) => {
    const rawDate = stats.dates?.[index] || `Day ${index + 1}`;
    return {
      date: rawDate,
      revenue: parseFloat(revenue.toFixed(2)),
      clicks: stats.recentClicks?.[index] || 0,
    };
  });
  
  // Calculate percentage of mobile (we map this to SEO vs Pinterest traffic approx)
  const totalPinterest = events.filter(e => e.source === 'pinterest').length;
  const totalSeo = events.filter(e => e.source === 'seo').length;
  const combined = totalPinterest + totalSeo || 1;
  const greenPercentage = Math.round((totalPinterest / combined) * 100) || 45;

  // Search filtering logic
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const highlightText = (text: string, highlight: string) => {
    if (!text) return "";
    if (!highlight || highlight.trim() === "") return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi"));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className="bg-emerald-500/20 text-emerald-400 px-0.5 rounded font-semibold border border-emerald-500/30">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

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
                      <div className="font-semibold text-zinc-100 mb-1">{highlightText(seed.keyword, searchQuery)}</div>
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
                      <div className="font-semibold text-zinc-100 mb-1 truncate">{highlightText(article.title, searchQuery)}</div>
                      <div className="text-xs text-zinc-500 truncate">{highlightText(article.keyword, searchQuery)}</div>
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
                      {pin.imageUrl ? (
                        <img src={pin.imageUrl} alt={pin.title} className="w-16 h-16 object-cover rounded-lg bg-[#27272a]" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#27272a] flex items-center justify-center border border-white/5 text-xs text-zinc-500 text-center px-1">
                          No Image
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-100 mb-1 truncate text-sm">{highlightText(pin.title, searchQuery)}</div>
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

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <div className="bg-[#09090b] rounded-xl p-5 shadow-sm border border-white/5 flex items-center justify-between gap-4">
                 <div className="min-w-0 flex-1">
                   <div className="flex items-center gap-2 text-zinc-500 text-[12px] mb-2 font-medium">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                     Yield Revenue
                   </div>
                   <div className="flex items-baseline gap-2 flex-wrap">
                     <span className="text-3xl font-bold text-zinc-100 tracking-tight">${stats.totalRevenue.toFixed(0)}</span>
                     <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                       <ArrowUpRight className="h-3 w-3" />
                       +14.2%
                     </div>
                   </div>
                 </div>
                 <div className="shrink-0">
                   <Sparkline 
                     data={stats.recentRevenue?.length > 0 ? stats.recentRevenue : [100, 120, 115, 140, 135, 160, 180]} 
                     color="#10b981" 
                     height={32}
                   />
                 </div>
               </div>

               <div className="bg-[#09090b] rounded-xl p-5 shadow-sm border border-white/5 flex items-center justify-between gap-4">
                 <div className="min-w-0 flex-1">
                   <div className="flex items-center gap-2 text-zinc-500 text-[12px] mb-2 font-medium">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3V3"></path><path d="M21 9l-9-9-4 4 9 9"></path><path d="M3 21l9-9 4 4-9 9"></path></svg>
                     Site Sessions
                   </div>
                   <div className="flex items-baseline gap-2 flex-wrap">
                     <span className="text-3xl font-bold text-zinc-100 tracking-tight">{stats.totalClicks}k</span>
                     <div className="flex items-center gap-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                       <ArrowUpRight className="h-3 w-3" />
                       +36.8%
                     </div>
                   </div>
                 </div>
                 <div className="shrink-0">
                   <Sparkline 
                     data={stats.recentClicks?.length > 0 ? stats.recentClicks : [45, 52, 49, 60, 58, 68, 72]} 
                     color="#38bdf8" 
                     height={32}
                   />
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

          {/* Revenue view (Recharts Line Chart) */}
          <div className="bg-[#18181b] rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-sm">
             <div className="flex justify-between items-center mb-6 text-sm">
                <div>
                  <h2 className="text-zinc-100 font-medium tracking-tight">Revenue Trends</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Daily gross revenue and traffic trajectory.</p>
                </div>
                <div className="bg-[#09090b] border border-white/5 text-zinc-400 px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 cursor-pointer hover:text-zinc-100 transition shadow-sm">
                   Last 7 days
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="md:col-span-1">
                   <span className="text-xs text-zinc-500 block mb-1">Total Gross Revenue</span>
                   <h3 className="text-3xl font-bold tracking-tight text-zinc-100">${(stats.totalRevenue > 0 ? stats.totalRevenue : 0).toFixed(2)}</h3>
                   <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold w-fit mt-3">
                      <ArrowUpRight className="h-3 w-3" />
                      +{stats.totalRevenue > 0 ? '36.8' : '0.0'}% <span className="text-emerald-500/60 font-normal">vs last week</span>
                   </div>
                </div>

                <div className="md:col-span-3 h-[200px] w-full" id="revenue-line-chart-container">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                         <XAxis 
                            dataKey="date" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                         />
                         <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(v) => `$${v}`}
                         />
                         <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: "#27272a", strokeWidth: 1, strokeDasharray: "4 4" }}
                         />
                         <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            dot={{ r: 3, strokeWidth: 1, stroke: "#10b981", fill: "#18181b" }}
                            activeDot={{ r: 5, strokeWidth: 1, fill: "#10b981" }}
                         />
                      </LineChart>
                   </ResponsiveContainer>
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
