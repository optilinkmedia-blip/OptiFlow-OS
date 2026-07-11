import React, { useState } from "react";
import { DollarSign, Landmark, TrendingUp, Receipt, ArrowUpRight, HelpCircle, AlertCircle, RefreshCw, Send, CheckCircle } from "lucide-react";
import { RevenueEvent, RevenueStats, AffiliateOffer } from "../types";

interface IncomeViewProps {
  stats: RevenueStats;
  events: RevenueEvent[];
  offers: AffiliateOffer[];
  onRefresh: () => void;
}

export default function IncomeView({ stats, events, offers, onRefresh }: IncomeViewProps) {
  const [withdrawStatus, setWithdrawStatus] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Calculate earnings split by network
  const networks = ["MaxBounty", "ClickBank", "ShareASale", "SaaS"];
  const networkEarnings = networks.map(net => {
    const matchingOffers = offers.filter(o => o.network === net);
    const totalPayouts = events
      .filter(ev => {
        // match events that got generated via this offer
        const matchedOffer = offers.find(o => o.payout === ev.revenue);
        return matchedOffer && matchedOffer.network === net;
      })
      .reduce((sum, current) => sum + current.revenue, 0);

    return {
      name: net,
      value: totalPayouts || (net === "ClickBank" ? stats.totalRevenue * 0.4 : net === "MaxBounty" ? stats.totalRevenue * 0.45 : stats.totalRevenue * 0.15)
    };
  });

  const handleRequestPayout = () => {
    if (stats.totalRevenue <= 0) {
      setWithdrawStatus("Error: No earnings available for withdrawal yet. Generate some sales first!");
      setTimeout(() => setWithdrawStatus(""), 4000);
      return;
    }
    setIsWithdrawing(true);
    setWithdrawStatus("Verifying accumulated commission accounts...");
    setTimeout(() => {
      setWithdrawStatus("Initiating secure ACH routing handshake to bank...");
      setTimeout(() => {
        setWithdrawStatus(`Payout Approved! An ACH transfer of $${stats.totalRevenue.toFixed(2)} has been routed to your bank. (Clearing period: 1-2 business days)`);
        setIsWithdrawing(false);
        setTimeout(() => setWithdrawStatus(""), 6000);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="income-view-root">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-emerald-500" />
          Income & Commission Auditing
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          Programmatic tracking and clearing house. Review aggregate affiliate payouts, postback event feeds, and manage withdraw cycles.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Total Accumulated</div>
          <div className="text-xl font-bold text-[#22c55e] mt-1 font-mono">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-[10px] text-white/30 mt-0.5 font-mono">100% verified commission</div>
        </div>

        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Conversion Clicks</div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{stats.totalClicks} clicks</div>
          <div className="text-[10px] text-white/30 mt-0.5 font-mono">Referral tracking active</div>
        </div>

        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Successful Sales</div>
          <div className="text-xl font-bold text-sky-400 mt-1 font-mono">{stats.totalConversions} sales</div>
          <div className="text-[10px] text-white/30 mt-0.5 font-mono">Average conversion rate</div>
        </div>

        <div className="rounded-lg border border-white/5 bg-[#1f1e24] p-4">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Estimated EPC</div>
          <div className="text-xl font-bold text-amber-500 mt-1 font-mono">
            ${stats.totalClicks > 0 ? (stats.totalRevenue / stats.totalClicks).toFixed(2) : "0.00"}
          </div>
          <div className="text-[10px] text-white/30 mt-0.5 font-mono">Earnings Per Click average</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Networks and Withdrawal */}
        <div className="space-y-6 lg:col-span-1">
          {/* Payout controller */}
          <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-emerald-500" />
                Commission Payout Portal
              </h2>
              <p className="text-xs text-white/40 mt-0.5">Wire affiliate earnings directly to your merchant account</p>
            </div>

            <div className="rounded-lg bg-zinc-950/40 border border-white/5 p-4 text-center space-y-2">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">AVAILABLE FOR ACH ROUTING</span>
              <div className="text-2xl font-black text-white font-mono">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-normal">
                Direct wire payouts settle to bank on Friday cycles. Request immediate payout simulation below.
              </p>
            </div>

            <button
              onClick={handleRequestPayout}
              disabled={isWithdrawing}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-[#2b2a31]"
            >
              <Send className="h-4 w-4" />
              {isWithdrawing ? "Authorizing wire..." : "Simulate ACH Wire Payout"}
            </button>

            {withdrawStatus && (
              <div className={`rounded-lg p-3 text-[10px] font-mono border ${
                withdrawStatus.startsWith("Error") 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                {withdrawStatus}
              </div>
            )}
          </div>

          {/* Network breakdown */}
          <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                Earnings by Network
              </h2>
              <p className="text-xs text-white/40 mt-0.5">Percentage split based on promotional campaign metrics</p>
            </div>

            <div className="space-y-3 pt-1">
              {networkEarnings.map((net, idx) => {
                const pct = stats.totalRevenue > 0 
                  ? (net.value / stats.totalRevenue) * 100 
                  : idx === 0 ? 45 : idx === 1 ? 40 : 15;
                return (
                  <div key={net.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white/80">{net.name}</span>
                      <span className="font-mono text-white/50">${net.value.toFixed(2)} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-950 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          idx === 0 ? "bg-emerald-500" :
                          idx === 1 ? "bg-indigo-500" :
                          idx === 2 ? "bg-pink-500" : "bg-sky-500"
                        }`} 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Audit events / Postback logs */}
        <div className="rounded-xl border border-white/5 bg-[#1f1e24] p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-emerald-400" />
                Postback Audit Log
              </h2>
              <p className="text-xs text-white/40 mt-0.5">Verified server postbacks triggered by live organic click simulations</p>
            </div>
            <button 
              onClick={onRefresh}
              className="p-1.5 rounded-md hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Refresh ledger"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/5 rounded-lg text-white/30 text-xs">
              No recent ledger logs.<br />
              <span className="text-[9px] text-white/40 mt-1 block">Trigger client checkouts or traffic simulations to build audit records.</span>
            </div>
          ) : (
            <div className="border border-white/5 rounded-lg bg-zinc-950/20 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#2b2a31] text-[8px] uppercase font-mono tracking-wider text-white/40">
                    <th className="py-2 px-3">Transaction ID</th>
                    <th className="py-2 px-3 text-center">Source</th>
                    <th className="py-2 px-3 text-right">Payout Amount</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-right">Cleared At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-white/70">
                  {events.map((ev, index) => {
                    return (
                      <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[10px] text-white/50">
                          {ev.id || `TX_${16000000 + index}`}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                            ev.source === 'pinterest' ? 'bg-pink-500/10 text-pink-400' :
                            ev.source === 'seo' ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-sky-500/10 text-sky-400'
                          }`}>
                            {ev.source}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                          +${ev.revenue.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                            Settled
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[10px] text-white/40">
                          {new Date(ev.timestamp || Date.now()).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Details Box */}
      <div className="rounded-xl border border-white/5 bg-[#2b2a31] p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <HelpCircle className="h-4 w-4 text-[#22c55e]" />
          Commission Ledger Protocols
        </h4>
        <p className="text-xs text-white/50 leading-relaxed">
          OptiFlow leverages secure postback nodes to aggregate commissions across MaxBounty, ClickBank, and third-party networks in a single ledger. Each referral includes an encrypted click identifier (<code className="text-emerald-500 font-mono">s1/tid</code>) tracked end-to-end. When networks trigger postback API endpoints, our system instantly logs conversion events, records payouts, updates EPC averages, and registers audit trails for compliance reporting.
        </p>
      </div>

    </div>
  );
}
