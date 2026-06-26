import React from "react";
import { Copy, Plus, Search, Sparkles, Sprout, TrendingUp, Activity, AlertTriangle, Compass, DollarSign, Flame, Globe, Heart, Award, ArrowRight } from "lucide-react";
import { PieChart, List, FileText, MessageSquare, Calendar, HelpCircle, Layers, LogOut, Settings, Bell, Circle, Plug, Contrast } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  systemMode: string;
  isClearing: boolean;
  onClearAll: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export default function Sidebar({ 
  currentTab, 
  onTabChange, 
  systemMode, 
  isClearing, 
  onClearAll,
  highContrast,
  onToggleHighContrast
}: SidebarProps) {
  const productLinks = [
    { id: "dashboard", label: "Overview", count: 0 },
    { id: "ai-engine", label: "AI Engine", count: 0 },
    { id: "seeds", label: "Drafts", count: 3 },
    { id: "content", label: "Released", count: 0 },
    { id: "distribution", label: "Comments", count: 0 },
    { id: "ceo", label: "Scheduled", count: 8, isGreen: true },
  ];

  return (
    <aside className="w-64 bg-[#09090b] border-r border-white/5 flex flex-col h-screen sticky top-0" id="sidebar-aside-panel">
      {/* Brand logic */}
      <div className="p-6">
        <div className="flex items-center gap-3 text-zinc-100 font-semibold tracking-tight" id="sidebar-logo-container">
          <BrandLogo size={36} className="shrink-0 transition-transform duration-300 hover:rotate-6" />
          <div className="flex flex-col">
            <span className="text-zinc-100 font-bold text-sm tracking-wide">OptiFlow OS</span>
            <span className="text-[10px] text-emerald-500 font-mono tracking-wider uppercase">Enterprise</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar-dark mt-2">
        {/* Dashboard top link */}
        <button
          onClick={() => onTabChange("dashboard")}
          className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition cursor-pointer font-medium ${
            currentTab === "dashboard" ? "bg-[#18181b] text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b]/50"
          }`}
        >
          <Layers className="h-4 w-4" />
          Dashboard
        </button>

        {/* Product subsection */}
        <div className="space-y-1 mt-6">
          <div className="px-3 flex items-center justify-between text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
            <span>Product</span>
          </div>
          
          <div className="space-y-0.5">
            {productLinks.map((link) => {
              const isActive = link.id === currentTab && link.id !== "dashboard";
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${
                    isActive ? "bg-[#18181b] text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b]/50"
                  }`}
                >
                  {link.label}
                  {link.count > 0 && (
                    <span
                      className={`flex h-4 px-1.5 items-center justify-center rounded-full text-[10px] font-bold ${
                        link.isGreen ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Customers subsection */}
        <div className="space-y-1 mt-6">
          <div className="px-3 flex items-center justify-between text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
            <span>Settings</span>
          </div>
          <button onClick={() => onTabChange("monetization")} className={`w-full px-3 flex items-center justify-between text-sm font-medium transition cursor-pointer py-2 focus:outline-none rounded-md ${
            currentTab === "monetization" ? "bg-[#18181b] text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b]/50"
          }`}>
            <div className="flex items-center gap-3">
               <PieChart className="h-4 w-4" />
               <span>Monetization</span>
            </div>
          </button>
          <button onClick={() => onTabChange("integrations")} className={`w-full px-3 flex items-center justify-between text-sm font-medium transition cursor-pointer py-2 focus:outline-none rounded-md ${
            currentTab === "integrations" ? "bg-[#18181b] text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b]/50"
          }`}>
            <div className="flex items-center gap-3">
               <Plug className="h-4 w-4" />
               <span>API Integrations</span>
            </div>
          </button>
        </div>

        {/* Shop */}
        <div className="space-y-1">
          <div className="px-3 rounded-md flex items-center gap-3 text-sm font-medium text-zinc-400 cursor-pointer hover:text-zinc-100 hover:bg-[#18181b]/50 py-2">
               <List className="h-4 w-4" />
               <span>Shop</span>
          </div>
        </div>

        {/* Income */}
        <div className="space-y-1">
          <div className="px-3 rounded-md flex items-center justify-between text-sm font-medium text-zinc-400 cursor-pointer hover:text-zinc-100 hover:bg-[#18181b]/50 py-2">
            <div className="flex items-center gap-3">
               <DollarSign className="h-4 w-4" />
               <span>Income</span>
            </div>
          </div>
        </div>
        
        {/* Promote */}
        <div className="space-y-1">
          <div className="px-3 rounded-md flex items-center gap-3 text-sm font-medium text-zinc-400 cursor-pointer hover:text-zinc-100 hover:bg-[#18181b]/50 py-2">
               <Activity className="h-4 w-4" />
               <span>Promote</span>
          </div>
        </div>

      </nav>

      <div className="p-4 flex flex-col gap-3 mt-auto border-t border-white/5 bg-[#09090b]" id="sidebar-footer">
         {/* Accessibility High-Contrast Toggle */}
         <div 
           onClick={onToggleHighContrast}
           className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 transition group"
           id="high-contrast-toggle-button"
         >
           <div className="flex items-center gap-2">
             <Contrast className="h-3.5 w-3.5 text-emerald-400 group-hover:text-emerald-300 transition" />
             <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition">High Contrast</span>
           </div>
           <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
             highContrast ? "bg-emerald-500" : "bg-zinc-700"
           }`}>
             <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-200 ${
               highContrast ? "translate-x-3" : "translate-x-0"
             }`} />
           </div>
         </div>

         <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b]/50 transition">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Feedback</span>
         </div>
      </div>
    </aside>
  );
}
