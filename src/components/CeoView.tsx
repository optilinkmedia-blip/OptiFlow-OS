import React, { useState } from "react";
import { BrainCircuit, CheckSquare, Flame, HelpCircle, History, RefreshCw, Smartphone, TrendingUp, AlertTriangle, PenTool, Rocket } from "lucide-react";
import { CeoDecision } from "../types";

interface CeoViewProps {
  decisions: CeoDecision[];
  onTriggerCeoRun: () => Promise<CeoDecision>;
  onRefresh: () => void;
  articleCount: number;
}

export default function CeoView({ decisions, onTriggerCeoRun, onRefresh, articleCount }: CeoViewProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTriggerAudit = async () => {
    if (articleCount === 0) {
      setErrorMsg("Cannot run optimizer yet: You must provide seeds and generate campaign articles first.");
      return;
    }
    
    setIsRunning(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await onTriggerCeoRun();
      setSuccessMsg(`AI CEO Run Completed! Generated ${result.actions?.length || 0} optimization directives.`);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute AI CEO Audit.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="ceo-view-root">
      
      {/* Header description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI CEO Optimization (Layer 5)
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          The Brain of OptiFlow. Every 24 hours, the AI CEO analyzes revenue stats, checks live EPCs across articles, adjusts low CPA funnels, stops ineffective pins, and launches high-upside keyword campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Active execution trigger */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-1 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-[#22c55e]" />
              Optimization Core
            </h2>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Deploy the AI CEO Agent to perform an instant yield audit on the campaign database. The server-side Gemini decision module checks multi-source conversions, flags weak CTR items, and deploys corrective updates.
            </p>
            
            <div className="rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-3 text-[11px] flex flex-col gap-1.5 font-sans">
              <p className="font-bold text-[#22c55e]">Optimization Autonomy:</p>
              <ul className="list-disc list-inside space-y-1 text-white/70 pl-1">
                <li>Swaps low conversion campaign links</li>
                <li>Launches new keywords automatically</li>
                <li>Rewrites meta descriptions and FAQs</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            {errorMsg && (
              <p className="text-xs text-rose-700 font-mono italic leading-tight p-2.5 rounded hover:bg-rose-500/10 border border-rose-500/20 bg-rose-500/10">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-xs text-emerald-700 font-mono italic leading-tight p-2.5 rounded hover:bg-[#22c55e]/10 border border-[#22c55e]/20 bg-[#22c55e]/10">{successMsg}</p>
            )}

            <button
              onClick={handleTriggerAudit}
              disabled={isRunning || articleCount === 0}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] hover:bg-[#22c55e]/80 disabled:bg-[#35343d] disabled:text-white/40 text-white px-4 py-2 text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-[#22c55e]" />
                  Analyzing Live Yields...
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 text-white" />
                  Deploy AI CEO Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit decisions logs stream */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 shadow-sm lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-white/40" />
            <h2 className="text-sm font-bold text-white/90">Yield Audit Actions Log</h2>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {decisions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-150 bg-[#2b2a31] rounded-xl text-white/40 font-mono">
                <span>Optimization database empty</span>
                <p className="text-[10px] text-white/40 mt-0.5 max-w-xs leading-normal font-sans">
                  Execute an AI CEO Audit to trigger the optimization loop and review tactical instructions.
                </p>
              </div>
            ) : (
              decisions.map((dec, idx) => (
                <div key={dec.id || idx} className="rounded-lg border border-white/5 bg-slate-5/30 p-4 space-y-3.5 animate-fadeIn">
                  
                  {/* Title Stamp */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-[#22c55e]/10 text-[9px] font-mono font-bold text-[#22c55e] border border-[#22c55e]/20">
                        AUD
                      </div>
                      <span className="text-[11px] font-bold text-white/70 font-sans">AI DECISION ACTION BLOCK</span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono">
                      {new Date(dec.createdAt).toLocaleDateString()} {new Date(dec.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Core Actions items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Winners to Scale vs Stops */}
                    <div className="space-y-3.5">
                      
                      {/* Scale */}
                      {dec.scale && dec.scale.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-600 inline-flex items-center gap-1 font-bold">
                            <TrendingUp className="h-3 w-3" />
                            SCALE WINNERS (Boost Traffic)
                          </span>
                          <div className="space-y-1">
                            {dec.scale.map((sc, scIdx) => (
                              <p key={scIdx} className="text-[11px] text-white/70 font-medium font-sans">
                                • {sc}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stops */}
                      {dec.stop && dec.stop.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-rose-400 font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> STOP OPERATION (Underperforming)
                          </span>
                          <div className="space-y-1">
                            {dec.stop.map((st, stIdx) => (
                              <p key={stIdx} className="text-[11px] text-white/70 font-medium font-sans">
                                • {st}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rewrites & Brand new keywords launched */}
                    <div className="space-y-3.5">
                      
                      {/* Rewrites */}
                      {dec.rewrite && dec.rewrite.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-amber-400 font-bold inline-flex items-center gap-1">
                            <PenTool className="h-3 w-3" /> REWRITE / CONVERT (Optimize CTR)
                          </span>
                          <div className="space-y-1">
                            {dec.rewrite.map((rw, rwIdx) => (
                              <p key={rwIdx} className="text-[11px] text-white/70 font-medium font-sans">
                                • {rw}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brand New Keywords */}
                      {dec.newKeywords && dec.newKeywords.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-[#22c55e] font-bold inline-flex items-center gap-1">
                            <Rocket className="h-3 w-3" /> AUTO-GENERATED KEYWORDS EXPANDED
                          </span>
                          <div className="space-y-1">
                            {dec.newKeywords.map((nk, nkIdx) => (
                              <p key={nkIdx} className="text-[11px] text-white/70 font-medium font-mono">
                                &gt; {nk}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Systemic tactical instructions list */}
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-white/40 font-bold flex items-center gap-1.5">
                      <CheckSquare className="h-3.5 w-3.5 text-[#22c55e]" />
                      Active Operational Directives (Automated hand-off)
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-white/70 space-y-1.5 pl-1 font-sans leading-relaxed">
                      {dec.actions?.map((act, actIdx) => (
                        <li key={actIdx} className="leading-relaxed">{act}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
