import React, { useState } from "react";
import { Search, Globe, BrainCircuit, FileText, CheckCircle2, Link2, Wand2, Sparkles, AlertCircle, Settings2, BarChart3, Edit3, Target, Crosshair, Eye, RefreshCw } from "lucide-react";

type FlowStep = "INPUT" | "INTENT" | "SERP" | "OUTLINE" | "WRITING" | "OPTIMIZATION" | "PUBLISH";

export default function ContentEngineView() {
  const [step, setStep] = useState<FlowStep>("INPUT");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("General");
  const [intent, setIntent] = useState("Informational");
  const [contentType, setContentType] = useState("SEO Blog Post");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleStartPipeline = () => {
    if (!keyword) return;
    setIsProcessing(true);
    setLogs([]);
    setStep("INTENT");
    addLog("Initializing Intent Analyzer Agent...");
    
    setTimeout(() => {
      addLog("Intent detected: Informational / Awareness stage.");
      setStep("SERP");
      addLog("Initializing SERP Intelligence Agent...");
      
      setTimeout(() => {
        addLog("Scraped top 10 results. Extracted 42 entities & 15 content gaps.");
        setStep("OUTLINE");
        addLog("Initializing Outline Generation Agent...");
        
        setTimeout(() => {
          addLog("SEO Architect structure finalized (H1, 6x H2, 4x H3, FAQ).");
          setIsProcessing(false);
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const handleWriteArticle = () => {
    setIsProcessing(true);
    setStep("WRITING");
    addLog("Initializing Long-Form Writing Agent (Claude Layer)...");
    
    setTimeout(() => {
      addLog("Draft complete. Word count: 2,450.");
      setStep("OPTIMIZATION");
      addLog("Initializing SEO Optimizer, Internal Linking, and Monetization Agents...");
      
      setTimeout(() => {
        addLog("Optimization complete. 6 internal links injected. 2 affiliate blocks added.");
        setIsProcessing(false);
      }, 2500);
    }, 3000);
  };

  const handlePublish = () => {
    setStep("PUBLISH");
  };

  const handleReset = () => {
    setStep("INPUT");
    setKeyword("");
    setLogs([]);
  };

  const steps: FlowStep[] = ["INPUT", "INTENT", "SERP", "OUTLINE", "WRITING", "OPTIMIZATION", "PUBLISH"];

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-emerald-500" />
          AI Content Intelligence Engine
        </h1>
        <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
          Multi-agent autonomous SEO content factory. Transforms single keywords into deeply researched, structured, and publish-ready articles using specialized GPT-5 & Claude-class agents.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6 overflow-x-auto hide-scrollbar">
        {steps.map((s, idx) => {
          const isActive = step === s;
          const isPassed = steps.indexOf(step) > idx;
          return (
            <div key={s} className="flex items-center gap-2 shrink-0 pr-2">
              <div className={`h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' : isPassed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-[#18181b] text-zinc-500'}`}>
                {isPassed ? <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5" /> : idx + 1}
              </div>
              <span className={`text-[9px] md:text-[10px] font-mono tracking-wider ${isActive ? 'text-emerald-500 font-bold' : isPassed ? 'text-zinc-300' : 'text-zinc-500'}`}>{s}</span>
              {idx < steps.length - 1 && <div className={`w-4 md:w-8 h-px ${isPassed ? 'bg-emerald-500/30' : 'bg-white/5'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          
          {step === "INPUT" && (
            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 space-y-5 animate-fadeIn shadow-sm">
              <div>
                <h2 className="text-sm font-bold text-zinc-100">Seed Configuration</h2>
                <p className="text-xs text-zinc-500 mt-1">Configure the core keyword and let the multi-agent pipeline take over.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5 block">Primary Keyword</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type="text" 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. 'best standing desks 2026'"
                      className="w-full bg-[#09090b] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5 block">Target Audience</label>
                    <select 
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full bg-[#09090b] border border-white/5 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition shadow-sm"
                    >
                      <option>General</option>
                      <option>Beginners</option>
                      <option>Professionals</option>
                      <option>Enthusiasts</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5 block">Content Type</label>
                    <select 
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full bg-[#09090b] border border-white/5 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition shadow-sm"
                    >
                      <option>SEO Blog Post</option>
                      <option>Affiliate Review</option>
                      <option>Product Comparison</option>
                      <option>Informational</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={handleStartPipeline}
                  disabled={!keyword || isProcessing}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Globe className="h-4 w-4" />
                  <span>Initialize AI Orchestration</span>
                </button>
              </div>
            </div>
          )}

          {["INTENT", "SERP"].includes(step) && (
             <div className="bg-[#18181b] border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)] animate-fadeIn">
                <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                <h2 className="text-lg font-bold text-zinc-100 mb-2">
                   {step === "INTENT" ? "Intent Analyzer Agent Active" : "SERP Intelligence Agent Active"}
                </h2>
                <p className="text-xs text-zinc-500 max-w-md">
                   {step === "INTENT" 
                     ? "Classifying search intent, inferring user stage, and defining optimal content type." 
                     : "Scraping top 10 Google results. Extracting headings, entities, and content gaps."}
                </p>
             </div>
          )}

          {step === "OUTLINE" && (
            <div className="space-y-6 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1f1e24] border border-[#22c55e]/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Target className="h-16 w-16" />
                    </div>
                    <div className="text-[10px] font-mono text-[#22c55e] mb-1 font-bold">INTENT & SERP DATA</div>
                    <h3 className="text-lg font-bold text-white/90 mb-2">Informational / Awareness</h3>
                    <ul className="text-xs text-white/60 space-y-1.5 list-disc list-inside">
                      <li>Average Top 10 Word Count: 2,450</li>
                      <li>Dominant Entities: Ergonomics, Posture</li>
                      <li>Content Gaps: Video embeds, FAQ Schema</li>
                    </ul>
                  </div>

                  <div className="bg-[#1f1e24] border border-white/5 rounded-xl p-5">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase mb-3 font-bold">Optimized Titles</div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/50 bg-emerald-500/5 cursor-pointer shadow-sm">
                        <input type="radio" name="title" defaultChecked className="accent-emerald-500" />
                        <div>
                           <div className="text-xs font-bold text-zinc-100">The Ultimate Guide to {keyword}</div>
                           <div className="text-[9px] text-emerald-500 mt-0.5">CTR Optimized • 58 Chars</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-[#09090b] cursor-pointer hover:border-white/10 transition shadow-sm">
                        <input type="radio" name="title" className="accent-emerald-500" />
                        <div>
                           <div className="text-xs font-bold text-zinc-100">Top 10 {keyword} for {audience}</div>
                           <div className="text-[9px] text-zinc-500 mt-0.5">Listicle Format • 52 Chars</div>
                        </div>
                      </label>
                    </div>
                  </div>
               </div>

               <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold">SEO Architect Outline</div>
                    <button className="text-[10px] text-zinc-500 hover:text-zinc-100 flex items-center gap-1 transition"><Edit3 className="h-3 w-3"/> Edit Outline</button>
                  </div>
                  <div className="space-y-2 border-l border-white/10 ml-2 pl-4">
                    <div className="relative">
                       <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-[#18181b]" />
                       <h4 className="text-xs font-bold text-zinc-100">H2: Introduction to {keyword}</h4>
                       <p className="text-[10px] text-zinc-500 mt-0.5">Hook generation, intent matching, thesis statement.</p>
                    </div>
                    <div className="relative pt-3">
                       <div className="absolute -left-[21px] top-4.5 h-2 w-2 rounded-full bg-zinc-700 ring-4 ring-[#18181b]" />
                       <h4 className="text-xs font-bold text-zinc-100">H2: Key Factors to Consider</h4>
                       <div className="pl-3 mt-1.5 space-y-1">
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2"><span className="text-emerald-500">-</span> H3: Price vs Value</div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2"><span className="text-emerald-500">-</span> H3: Durability & Materials</div>
                       </div>
                    </div>
                    <div className="relative pt-3">
                       <div className="absolute -left-[21px] top-4.5 h-2 w-2 rounded-full bg-zinc-700 ring-4 ring-[#18181b]" />
                       <h4 className="text-xs font-bold text-zinc-100">H2: Top Recommendations</h4>
                       <p className="text-[10px] text-zinc-500 mt-0.5">Affiliate blocks + Pros/Cons tables.</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-3">
                     <button onClick={handleReset} className="px-4 py-2 bg-[#09090b] text-zinc-400 text-xs font-bold rounded-xl hover:bg-white/5 transition shadow-sm">
                       Cancel
                     </button>
                     <button onClick={handleWriteArticle} className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition flex items-center gap-2 shadow-sm">
                       <Wand2 className="h-3.5 w-3.5" />
                       Invoke Writing Agents
                     </button>
                  </div>
               </div>
            </div>
          )}

          {["WRITING", "OPTIMIZATION"].includes(step) && (
             <div className="bg-[#18181b] border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)] animate-fadeIn">
                <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                <h2 className="text-lg font-bold text-zinc-100 mb-2">
                   {step === "WRITING" ? "Long-Form Writing Agent (Claude)" : "Optimization & Linking Agents"}
                </h2>
                <p className="text-xs text-zinc-500 max-w-md">
                   {step === "WRITING" 
                     ? "Writing high-quality, human-like prose following the SEO architecture." 
                     : "Improving keyword distribution, injecting internal links, and placing monetization CTA blocks."}
                </p>
             </div>
          )}

          {step === "PUBLISH" && (
             <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#18181b] border border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)]">
                   <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-emerald-500" />
                   </div>
                   <h2 className="text-xl font-bold text-zinc-100 mb-2">Content Pipeline Complete</h2>
                   <p className="text-sm text-zinc-500 max-w-md mb-6">
                     The article has been written, optimized, interlinked, and successfully pushed via CMS API.
                   </p>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                      <div className="bg-[#09090b] border border-white/5 rounded-xl p-3 text-left shadow-sm">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Word Count</div>
                         <div className="text-sm font-bold text-zinc-100 mt-0.5">2,845</div>
                      </div>
                      <div className="bg-[#09090b] border border-white/5 rounded-xl p-3 text-left shadow-sm">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Internal Links</div>
                         <div className="text-sm font-bold text-zinc-100 mt-0.5">6 Injected</div>
                      </div>
                      <div className="bg-[#09090b] border border-white/5 rounded-xl p-3 text-left shadow-sm">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Readability</div>
                         <div className="text-sm font-bold text-emerald-500 mt-0.5">Grade 8</div>
                      </div>
                      <div className="bg-[#09090b] border border-white/5 rounded-xl p-3 text-left shadow-sm">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Monetization</div>
                         <div className="text-sm font-bold text-zinc-100 mt-0.5">3 CTA Blocks</div>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button className="px-6 py-2.5 bg-[#09090b] border border-white/5 text-zinc-100 text-xs font-bold rounded-xl hover:bg-white/10 transition flex items-center gap-2 shadow-sm">
                        <Eye className="h-4 w-4" /> View Live Article
                      </button>
                      <button onClick={handleReset} className="px-6 py-2.5 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition flex items-center gap-2 shadow-sm">
                        <RefreshCw className="h-4 w-4" /> Process Next Seed
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Right Sidebar: Agent Activity Log */}
        <div className="lg:col-span-1">
           <div className="bg-[#18181b] border border-white/5 rounded-2xl h-full flex flex-col overflow-hidden shadow-sm">
              <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#09090b]/50">
                 <BarChart3 className="h-4 w-4 text-emerald-500" />
                 <h3 className="text-xs font-bold text-zinc-100 font-mono">AGENT_LOG</h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#09090b]/20 text-[10px] font-mono">
                 {logs.length === 0 ? (
                   <div className="text-zinc-600 italic">Awaiting pipeline initialization...</div>
                 ) : (
                   logs.map((log, i) => (
                     <div key={i} className="text-zinc-400 leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                       {log}
                     </div>
                   ))
                 )}
                 {isProcessing && (
                   <div className="flex items-center gap-2 text-emerald-500 animate-pulse mt-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Agent active...</span>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
