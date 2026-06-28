import React from "react";
import { ArrowRight, BrainCircuit, Globe, LineChart, Sparkles, Zap, Network, Bot, Activity } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export default function LandingPageView({ onEnterApp }: LandingPageViewProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100 flex flex-col relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <BrandLogo size={32} />
          <span className="font-bold text-xl tracking-tight text-white">Optiflow</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-zinc-400 hover:text-white transition">Platform</a>
          <a href="#how-it-works" className="text-zinc-400 hover:text-white transition">How it Works</a>
          <button 
            onClick={onEnterApp}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition font-semibold flex items-center gap-2 backdrop-blur-md border border-white/10"
          >
            Launch Console <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 max-w-5xl mx-auto relative z-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-black to-black blur-3xl opacity-50"></div>
        
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[3rem] p-12 md:p-20 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[3rem] pointer-events-none"></div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter leading-[1.05] mb-8 relative z-10">
            The Autonomous <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Growth Engine</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed relative z-10">
            Deploy AI agents to research keywords, write SEO-optimized articles, distribute to Pinterest, and run A/B tests for affiliate monetization — all while you sleep.
          </p>
          
          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={onEnterApp}
              className="bg-emerald-500 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-400 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Enter Dashboard <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Abstract dashboard mockup preview */}
        <div className="mt-20 w-full max-w-4xl relative group cursor-pointer" onClick={onEnterApp}>
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative rounded-2xl bg-[#09090b] border border-white/10 p-2 shadow-2xl overflow-hidden aspect-[16/9] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#121214]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="mx-auto bg-black/50 text-zinc-500 text-xs px-3 py-1 rounded-md border border-white/5 flex items-center gap-2">
                <Globe size={12} /> optiflow.ai/dashboard
              </div>
            </div>
            <div className="flex-1 p-6 flex gap-6 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_14px]">
              <div className="w-1/4 flex flex-col gap-3">
                <div className="h-8 bg-white/5 rounded-md w-full animate-pulse"></div>
                <div className="h-8 bg-white/5 rounded-md w-3/4 animate-pulse delay-75"></div>
                <div className="h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-md w-5/6"></div>
                <div className="h-8 bg-white/5 rounded-md w-full animate-pulse delay-150"></div>
              </div>
              <div className="w-3/4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="h-4 bg-white/10 rounded-sm w-1/4"></div>
                  <div className="h-full w-full rounded-md border border-white/5 bg-gradient-to-b from-white/5 to-transparent flex items-end p-2 gap-2">
                    {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 border-y border-white/5 bg-[#09090b]/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white mb-2">10x</div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Content Output</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white mb-2">24/7</div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Autonomous Operation</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-400 mb-2">Auto</div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">A/B Testing</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">Zero</div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Manual Posting</div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 relative z-10">
        <div className="absolute inset-0 bg-[#09090b]"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Complete Automation Stack</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">From seed keyword to revenue event, Optiflow handles every step of the programmatic SEO lifecycle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Feature 1 - Large spanning col */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#121214] to-[#09090b] border border-white/10 p-10 rounded-[2rem] hover:border-emerald-500/30 transition-colors group flex flex-col justify-between overflow-hidden relative">
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <Network size={240} className="text-emerald-500 translate-x-1/4 translate-y-1/4" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">AI Research & Writing</h3>
                <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                  Automatically expand seed keywords into long-tail clusters. The AI writes full-length, SEO-optimized articles tailored to user intent.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-[#121214] to-[#09090b] border border-white/10 p-10 rounded-[2rem] hover:border-cyan-500/30 transition-colors group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <Globe size={180} className="text-cyan-500 translate-x-1/4 -translate-y-1/4" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Auto-Distribution</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Connect social accounts. Optiflow generates highly clickable pins to drive organic traffic back to your content.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-[#121214] to-[#09090b] border border-white/10 p-10 rounded-[2rem] hover:border-purple-500/30 transition-colors group flex flex-col justify-between relative overflow-hidden">
               <div className="absolute left-0 bottom-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <Activity size={180} className="text-purple-500 -translate-x-1/4 translate-y-1/4" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <LineChart size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Dynamic Monetization</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Analyze EPC in real-time, swapping affiliate offers to maximize revenue dynamically.
                </p>
              </div>
            </div>

            {/* Feature 4 - Large spanning col */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#121214] to-[#09090b] border border-white/10 p-10 rounded-[2rem] hover:border-yellow-500/30 transition-colors group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-all duration-700 pointer-events-none">
                <div className="flex items-center justify-center p-6 bg-black rounded-full border border-white/10 shadow-2xl">
                  <Bot size={64} className="text-yellow-500 animate-bounce" />
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                <Bot size={28} />
              </div>
              <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold text-white mb-3">Autonomous CEO Agent</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  The central AI brain continuously monitors performance across all channels, reallocating resources to winning campaigns without human intervention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black blur-2xl -z-10"></div>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to scale your publishing?</h2>
          <button 
            onClick={onEnterApp}
            className="bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:bg-zinc-200 transition-all hover:scale-105 shadow-xl flex items-center gap-3 mx-auto"
          >
            Start Building Autonomous Streams <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5 text-center text-zinc-500 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BrandLogo size={24} />
          <span className="font-bold text-white">Optiflow</span>
        </div>
        <p>© {new Date().getFullYear()} Optiflow AI. Built for the modern publisher.</p>
      </footer>
    </div>
  );
}
