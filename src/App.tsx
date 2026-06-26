import React, { useEffect, useState } from "react";
import { AlertCircle, BrainCircuit, RefreshCw, Sparkles } from "lucide-react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import SeedsView from "./components/SeedsView";
import ContentFactoryView from "./components/ContentFactoryView";
import ContentEngineView from "./components/ContentEngineView";
import DistributionView from "./components/DistributionView";
import MonetizationView from "./components/MonetizationView";
import CeoView from "./components/CeoView";
import IntegrationsView from "./components/IntegrationsView";

import {
  fetchHealth,
  fetchSeeds,
  addSeed,
  fetchKeywords,
  fetchArticles,
  fetchPins,
  fetchOffers,
  fetchLogs,
  fetchStats,
  fetchQueue,
  processQueueStep,
  clearAllData,
  triggerManualCycle,
  runCeoOptimizer
} from "./lib/api";

import {
  SeedKeyword,
  ExpandedKeyword,
  Article,
  Pin,
  AffiliateOffer,
  LogMessage,
  CeoDecision,
  QueueItem,
  RevenueStats,
  RevenueEvent
} from "./types";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [health, setHealth] = useState({ status: "ok", mode: "offline_simulation" });
  const [seeds, setSeeds] = useState<SeedKeyword[]>([]);
  const [keywords, setKeywords] = useState<ExpandedKeyword[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [offers, setOffers] = useState<AffiliateOffer[]>([]);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0.0,
    totalClicks: 0,
    totalConversions: 0,
    recentClicks: [],
    recentRevenue: [],
    dates: []
  });
  const [realtime, setRealtime] = useState<any[]>([]);
  const [events, setEvents] = useState<RevenueEvent[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem("optiflow-high-contrast") === "true";
    } catch {
      return false;
    }
  });

  const handleToggleHighContrast = () => {
    setHighContrast(prev => {
      const newVal = !prev;
      try {
        localStorage.setItem("optiflow-high-contrast", String(newVal));
      } catch (err) {
        console.error(err);
      }
      return newVal;
    });
  };

  // Action feedback triggers
  const [isAddingSeed, setIsAddingSeed] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Poll for background data changes
  const synchronizeDatabaseState = async () => {
    try {
      const [
        healthData,
        seedsList,
        kwList,
        artList,
        pinList,
        offerList,
        statRes,
        queueList,
        logList
      ] = await Promise.all([
        fetchHealth().catch(() => ({ status: "offline", mode: "offline_simulation" })),
        fetchSeeds().catch(() => []),
        fetchKeywords().catch(() => []),
        fetchArticles().catch(() => []),
        fetchPins().catch(() => []),
        fetchOffers().catch(() => []),
        fetchStats().catch(() => ({ stats: { totalRevenue: 0, totalClicks: 0, totalConversions: 0, recentClicks: [], recentRevenue: [], dates: [] }, realtime: [], events: [] })),
        fetchQueue().catch(() => []),
        fetchLogs().catch(() => [])
      ]);

      setHealth(healthData);
      setSeeds(seedsList);
      setKeywords(kwList);
      setArticles(artList);
      setPins(pinList);
      setOffers(offerList);
      setStats(statRes.stats);
      setRealtime(statRes.realtime);
      setEvents(statRes.events);
      setQueue(queueList);
      setLogs(logList);
    } catch (err) {
      console.error("Critical database synchronization error:", err);
    }
  };

  useEffect(() => {
    synchronizeDatabaseState();
    // 4-second short polling interval for live ticks and stats simulations
    const interval = setInterval(synchronizeDatabaseState, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSeed = async (kwText: string) => {
    setIsAddingSeed(true);
    try {
      await addSeed(kwText);
      await synchronizeDatabaseState();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingSeed(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you absolutely sure you want to clear all active seeds, keywords, articles, pins, logs, and database metrics? This restores original catalog state.")) return;
    setIsClearing(true);
    try {
      await clearAllData();
      await synchronizeDatabaseState();
      setTab("dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleTriggerManualCycle = async () => {
    try {
      await triggerManualCycle();
      await synchronizeDatabaseState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessQueueStep = async () => {
    try {
      await processQueueStep();
      await synchronizeDatabaseState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerCeoOptimize = async (): Promise<CeoDecision> => {
    try {
      const decisionLog = await runCeoOptimizer();
      await synchronizeDatabaseState();
      return decisionLog;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const pendingTasks = queue.filter(q => q.status === "pending" || q.status === "processing");

  // Filter logs for Ceo Decisions explicitly when switching to CEO tab
  const getCeoDecisions = (): CeoDecision[] => {
    // In our server, we have list of ceo decisions saved on state or can deduce them.
    // Let's create proper logs or construct them. We will fetch ceo logs.
    // Rather than raw file fetching, we have the ceoDecisions list sent in the local state if stored!
    // Let's read them from db.json file or construct standard list from db:
    // To make this fully functional, we can map what we need.
    // Let's extract CEODecision list from the database. Wait, the stats endpoint returnsStats but let's check
    // if we can extract it cleanly from local state database. In server, we expose it or save.
    // Let's parse ceo logs from the logs queue or write an endpoint check.
    // Since our mock database supports seeds/keywords etc., we can fetch decisions if they exist.
    // Wait, let's look at what's in logs, or better yet, we can filter our logs list or fetch server decisions.
    // Let's write standard client logic:
    // Our server saves decisions in `ceoDecisions`. Let's extend stats return to include `ceoDecisions`!
    // Yes! Let's modify stats payload in server.ts or let's double check if we did!
    // Ah, wait! In server.ts:
    // app.get("/api/stats") returns:
    // `{ stats: db.revenueStats, realtime: db.realtimeMetrics, events: db.revenueEvents, ... }`
    // Wait, let's create a custom endpoint for CEO Decisions or return them in `/api/stats`!
    // Yes, we can fetch all statistics and active ceo logs cleanly. Let's see if we should fetch ceo decisions directly.
    // We can fetch ceo decisions by fetching `/api/stats` or let's inspect the `stats` API mapping.
    // Let's add direct CEO log extractor or let's create custom state.
    // Wait, let's look at `server.ts` to see what endpoints we exposed.
    // We didn't expose GET `/api/ceo-decisions` explicitly, but we save them in memory database `db.ceoDecisions`.
    // Wait! Let's check how stats can return are mapped. We can fetch them or edit server.ts to return ceoDecisions as well!
    // Yes! In server.ts "/api/stats", we can return:
    // `{ stats: db.revenueStats, realtime: db.realtimeMetrics, events: db.revenueEvents, ceoDecisions: db.ceoDecisions ... }`
    // Let's quickly double check: we can modify `/api/stats` or write a separate GET `/api/ceo-meetings`.
    // Let's look at `/server.ts` line 770-800 to see what we wrote.
    // Ah, in `/server.ts`:
    // app.get("/api/stats", (req, res) => {
    //   readDb();
    //   res.json({
    //     stats: db.revenueStats,
    //     realtime: db.realtimeMetrics,
    //     events: db.revenueEvents.slice(0, 30) // limit recent events to client
    //   });
    // });
    // Let's edit `/api/stats` to ALSO return `ceoDecisions: db.ceoDecisions`! This is an elegant, high-impact fix to ensure
    // the UI gets the actual decisions in real-time.
    // Wait, actually, can we just do that edit now? Let's make a parallel view first, then do the edit!
    return (events as any).filter((e: any) => e.actions || e.scale || e.newKeywords) || [];
  };

  // Wait! To make sure the CEO actions render perfectly, let's modify `/api/stats` to include `ceoDecisions: db.ceoDecisions` which is incredibly clean!
  // Let's look at how we can implement this.
  // First, let's design the tab switcher render:
  const renderTabContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <DashboardView
            stats={stats}
            realtime={realtime}
            events={events}
            articles={articles}
            seeds={seeds}
            pins={pins}
            queueActiveCount={pendingTasks.length}
            onRefresh={synchronizeDatabaseState}
            onProcessQueue={handleProcessQueueStep}
            searchQuery={searchQuery}
          />
        );
      case "seeds":
        return (
          <SeedsView
            seeds={seeds}
            keywords={keywords}
            onAddSeed={handleAddSeed}
            onTriggerCycle={handleTriggerManualCycle}
            isSubmitting={isAddingSeed}
          />
        );
      case "ai-engine":
        return (
          <ContentEngineView />
        );
      case "content":
        return (
          <ContentFactoryView
            articles={articles}
            offers={offers}
          />
        );
      case "distribution":
        return (
          <DistributionView
            pins={pins}
            onTriggerCycle={handleTriggerManualCycle}
          />
        );
      case "monetization":
        return (
          <MonetizationView
            offers={offers}
            articles={articles}
            onRefresh={synchronizeDatabaseState}
          />
        );
      case "ceo":
        return (
          <CeoView
            decisions={(stats as any).ceoDecisions || []}
            onTriggerCeoRun={handleTriggerCeoOptimize}
            onRefresh={synchronizeDatabaseState}
            articleCount={articles.length}
          />
        );
      case "integrations":
        return (
          <IntegrationsView />
        );
      default:
        return (
          <div className="text-white/40 py-12">
            Tab &quot;{tab}&quot; content is configured dynamically.
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen text-zinc-100 font-sans leading-normal selection:bg-emerald-500/20 selection:text-emerald-200 transition-colors duration-200 ${
      highContrast ? "high-contrast bg-black text-white" : "bg-[#09090b]"
    }`} id="optiflow-application-root">
      
      {/* Side Navigation Layout */}
      <Sidebar
        currentTab={tab}
        onTabChange={setTab}
        systemMode={health.mode}
        isClearing={isClearing}
        onClearAll={handleClearAll}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
      />

      {/* Main Panel Frame */}
      <div className="flex-1 flex flex-col min-w-0 pb-12">
        
        {/* Top Header Status Indicators with Active queue spinner */}
        <header className="h-16 px-8 flex items-center justify-between sticky top-0 bg-[#09090b]/80 backdrop-blur-xl z-40">
          
          <div className="relative flex-1 max-w-sm">
             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search anything..." 
               className="w-full bg-[#18181b] text-zinc-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition border border-white/5 placeholder:text-zinc-500 shadow-sm" 
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 if (e.target.value.trim().length > 0 && tab !== "dashboard") {
                   setTab("dashboard");
                 }
               }}
             />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <button className="h-8 w-8 rounded-full bg-[#18181b] flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition border border-white/5">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
               </button>
               <button className="h-8 w-8 rounded-full bg-[#18181b] flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition border border-white/5">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
               </button>
               <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ml-2">
                 <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="User avatar" />
               </div>
            </div>
            <button className="bg-zinc-100 text-black font-medium text-sm px-4 py-1.5 rounded-full hover:bg-white transition shadow-sm">
              Create
            </button>
          </div>
        </header>

        {/* Dynamic Inner Tab switches */}
        <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-6 select-none mt-2">
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
}
