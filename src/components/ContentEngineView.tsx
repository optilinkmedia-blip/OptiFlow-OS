import React, { useState, useRef, useEffect } from "react";
import { 
  Search, Globe, BrainCircuit, FileText, CheckCircle2, Link2, Wand2, Sparkles, 
  AlertCircle, Settings2, BarChart3, Edit3, Target, Crosshair, Eye, RefreshCw,
  MessageSquare, Mic, Upload, Image, Video, Send, Settings, Cpu, Layers,
  HelpCircle, Activity, Download, ArrowRight, Play, Square, Headphones, FileAudio, 
  Sparkle
} from "lucide-react";

type FlowStep = "INPUT" | "INTENT" | "SERP" | "OUTLINE" | "WRITING" | "OPTIMIZATION" | "PUBLISH";
type StudioTab = "CHAT" | "IMAGES" | "VIDEO" | "MULTIMODAL";

export default function ContentEngineView() {
  // Top-level tab state: PIPELINE (Autonomous SEO Writer) vs STUDIO (Gemini Media & Chat Studio)
  const [activeWorkspace, setActiveWorkspace] = useState<"pipeline" | "studio">("studio");
  
  // Pipeline (SEO Writer) states
  const [step, setStep] = useState<FlowStep>("INPUT");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("General");
  const [intent, setIntent] = useState("Informational");
  const [contentType, setContentType] = useState("SEO Blog Post");
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Studio (Gemini Studio) states
  const [studioTab, setStudioTab] = useState<StudioTab>("CHAT");

  // Feature 10 & 8: Chatbot states
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; thinking?: string }>>([
    { 
      role: 'assistant', 
      content: 'Hello! I am your OptiFlow Gemini Creative Assistant. I am configured with multi-turn conversation memory. I can help you draft high-intent SEO content, synthesize concepts with deep reasoning, generate image assets, and transcribe voice files. How can we optimize your digital brand today?' 
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash");
  const [chatbotRole, setChatbotRole] = useState("SEO Specialist & Content Strategist");
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Feature 6 & 7: Image Generator states
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState("1:1");
  const [imageQuality, setImageQuality] = useState("general"); // general vs studio
  const [imageSize, setImageSize] = useState("1K"); // 1K, 2K, 4K
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Feature 9: Veo Video states
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9"); // 16:9 vs 9:16
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Feature 2, 3 & 5: Multimodal & Audio states
  const [multimodalMode, setMultimodalMode] = useState<"image" | "video" | "audio">("image");
  const [multimodalPrompt, setMultimodalPrompt] = useState("");
  const [isAnalyzingMedia, setIsAnalyzingMedia] = useState(false);
  const [mediaAnalysisOutput, setMediaAnalysisOutput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    base64: string;
    mimeType: string;
    name: string;
  } | null>(null);

  // Mic Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  // Audio Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // Pipeline methods
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

  // Chatbot submission (Handles Thinking mode + Low Latency & normal models)
  const handleSendChatMessage = async () => {
    if (!userInput.trim() || isChatLoading) return;
    
    const userMsg = userInput.trim();
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
          model: thinkingEnabled ? "gemini-3.1-pro-preview" : selectedModel,
          systemInstruction: `You are an AI assistant specialized as a: ${chatbotRole}. Provide objective, direct, and high-performance responses.`,
          thinkingEnabled: thinkingEnabled
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: data.text,
            thinking: data.isMock ? undefined : (thinkingEnabled ? "Thought deep reasoning logs verified." : undefined)
          }
        ]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || "Failed to process chat response."}` }]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error: Failed to connect with server-side Gemini gateway." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Image Generation (With Aspect Ratio & Resolutions)
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl("");

    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          aspectRatio: imageAspectRatio,
          quality: imageQuality,
          size: imageQuality === "studio" ? imageSize : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        alert("Image generation failed: " + (data.error || "Internal error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during image generation.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Veo Video Generation (16:9 or 9:16)
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl("");

    try {
      const res = await fetch("/api/gemini/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt.trim(),
          aspectRatio: videoAspectRatio
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.isMock) {
          setGeneratedVideoUrl(data.videoUrl);
        } else if (data.operationName) {
          // Poll the video status
          pollVideoStatus(data.operationName);
        }
      } else {
        alert("Video generation failed: " + (data.error || "Internal error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating video generation.");
    } finally {
      if (!generatedVideoUrl) {
        // If not mock, keep spinner until polling succeeds
        setIsGeneratingVideo(false);
      }
    }
  };

  const pollVideoStatus = async (operationName: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) { // Limit to 2.5 minutes
        clearInterval(interval);
        setIsGeneratingVideo(false);
        alert("Video generation timed out on background polling.");
        return;
      }

      try {
        const res = await fetch("/api/gemini/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName })
        });
        const data = await res.json();
        if (data.done) {
          clearInterval(interval);
          // Video is ready, download or fetch
          const downloadRes = await fetch("/api/gemini/video-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName })
          });
          const blob = await downloadRes.blob();
          const videoUrl = URL.createObjectURL(blob);
          setGeneratedVideoUrl(videoUrl);
          setIsGeneratingVideo(false);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
  };

  // Multimodal File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setUploadedFile({
        base64,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // Multimodal Analysis API call (Image, Video, Audio)
  const handleAnalyzeMedia = async () => {
    if (!uploadedFile) return;
    setIsAnalyzingMedia(true);
    setMediaAnalysisOutput("");

    try {
      const res = await fetch("/api/gemini/multimodal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: uploadedFile.base64,
          fileType: uploadedFile.mimeType,
          prompt: multimodalPrompt || (multimodalMode === "audio" ? "Transcribe this audio precisely." : "Analyze this content in detail."),
          mode: multimodalMode
        })
      });
      const data = await res.json();
      if (data.success) {
        setMediaAnalysisOutput(data.text);
      } else {
        setMediaAnalysisOutput(`Analysis failed: ${data.error || "Internal model failure"}`);
      }
    } catch (err: any) {
      console.error(err);
      setMediaAnalysisOutput("Error connecting to server-side multimodal processor.");
    } finally {
      setIsAnalyzingMedia(false);
    }
  };

  // Microphone Audio Recording
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setUploadedFile({
            base64,
            mimeType: 'audio/wav',
            name: `voice-note-${new Date().toISOString().slice(0,10)}.wav`
          });
          setMultimodalMode("audio");
          setMultimodalPrompt("Transcribe this microphone recording.");
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop stream
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed:", err);
      alert("Microphone permission denied or device not found.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const steps: FlowStep[] = ["INPUT", "INTENT", "SERP", "OUTLINE", "WRITING", "OPTIMIZATION", "PUBLISH"];

  return (
    <div className="space-y-6 animate-fadeIn pb-20 text-zinc-100" id="content-engine-container">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-emerald-500 animate-pulse" />
            AI Content Intelligence Hub
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
            Orchestrate autonomous agent content pipelines or deploy studio-grade Gemini multi-turn, multimodal, and Veo video generators.
          </p>
        </div>

        {/* Cohesive Workspace Selector */}
        <div className="flex items-center bg-[#18181b] border border-white/10 rounded-xl p-1 shrink-0 shadow-inner">
          <button
            onClick={() => setActiveWorkspace("pipeline")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer ${
              activeWorkspace === "pipeline" 
                ? "bg-emerald-500 text-black shadow-md font-bold" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            SEO Pipeline
          </button>
          <button
            onClick={() => setActiveWorkspace("studio")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 relative cursor-pointer ${
              activeWorkspace === "studio" 
                ? "bg-[#27272a] text-emerald-400 border border-emerald-500/30 shadow-md font-bold" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkle className="h-3.5 w-3.5 text-emerald-400" />
            Gemini Media Studio
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>

      {/* ======================= SEO PIPELINE WORKSPACE ======================= */}
      {activeWorkspace === "pipeline" && (
        <div className="space-y-6">
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
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
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
                          <input type="radio" name="title" defaultChecked className="accent-emerald-500 animate-pulse" />
                          <div>
                            <div className="text-xs font-bold text-zinc-100">The Ultimate Guide to {keyword}</div>
                            <div className="text-[9px] text-emerald-500 mt-0.5">CTR Optimized • 58 Chars</div>
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
                      </div>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-3">
                      <button onClick={handleReset} className="px-4 py-2 bg-[#09090b] text-zinc-400 text-xs font-bold rounded-xl hover:bg-white/5 transition shadow-sm cursor-pointer">
                        Cancel
                      </button>
                      <button onClick={handleWriteArticle} className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition flex items-center gap-2 shadow-sm cursor-pointer">
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
                    {step === "WRITING" ? "Long-Form Writing Agent" : "Optimization & Linking Agents"}
                  </h2>
                </div>
              )}

              {step === "PUBLISH" && (
                <div className="bg-[#18181b] border border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)]">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-emerald-500 animate-bounce" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-2">Content Pipeline Complete</h2>
                  <p className="text-sm text-zinc-500 max-w-md mb-6">The article has been written, optimized, and successfully pushed via CMS.</p>
                  <button onClick={handleReset} className="px-6 py-2.5 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition flex items-center gap-2 cursor-pointer shadow-sm">
                    <RefreshCw className="h-4 w-4" /> Process Next Seed
                  </button>
                </div>
              )}
            </div>

            {/* Pipeline logs */}
            <div className="lg:col-span-1">
              <div className="bg-[#18181b] border border-white/5 rounded-2xl h-full flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#09090b]/50">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-zinc-100 font-mono">AGENT_LOG</h3>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#09090b]/20 text-[10px] font-mono min-h-[250px]">
                  {logs.length === 0 ? (
                    <div className="text-zinc-600 italic">Awaiting pipeline initialization...</div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="text-zinc-400 leading-relaxed border-l-2 border-emerald-500/30 pl-2">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= GEMINI CREATIVE STUDIO WORKSPACE ======================= */}
      {activeWorkspace === "studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn" id="gemini-creative-studio">
          
          {/* Left panel: Mode select sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 space-y-2 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase px-2 mb-2 block">Studio Engines</span>
              
              <button
                onClick={() => setStudioTab("CHAT")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  studioTab === "CHAT" 
                    ? "bg-[#27272a] text-emerald-400 border border-emerald-500/10 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Multi-turn Chatbot</span>
              </button>

              <button
                onClick={() => setStudioTab("IMAGES")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  studioTab === "IMAGES" 
                    ? "bg-[#27272a] text-emerald-400 border border-emerald-500/10 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Image className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Image Asset Lab</span>
              </button>

              <button
                onClick={() => setStudioTab("VIDEO")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  studioTab === "VIDEO" 
                    ? "bg-[#27272a] text-emerald-400 border border-emerald-500/10 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Video className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Veo Video Generator</span>
              </button>

              <button
                onClick={() => setStudioTab("MULTIMODAL")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  studioTab === "MULTIMODAL" 
                    ? "bg-[#27272a] text-emerald-400 border border-emerald-500/10 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Headphones className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Multimodal Insights</span>
              </button>
            </div>

            {/* Model capabilities display block */}
            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 space-y-3.5 text-xs shadow-sm">
              <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase block">System Specifications</span>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-zinc-500">Fast Tier</span>
                  <span className="text-emerald-400 font-semibold">gemini-3.1-flash-lite</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-zinc-500">General Engine</span>
                  <span className="text-indigo-400 font-semibold">gemini-3.5-flash</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-zinc-500">Reasoning Engine</span>
                  <span className="text-purple-400 font-semibold">gemini-3.1-pro-preview</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-zinc-500">Video Engine</span>
                  <span className="text-amber-500 font-semibold">veo-3.1-fast-generate</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 mt-1.5">
                <div className="flex gap-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-[10px] text-zinc-400 leading-normal">
                  <Settings className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Configure your persistent API key in <strong>Settings &gt; Secrets</strong> for enterprise throughput limits.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Active Workspace content */}
          <div className="lg:col-span-9 bg-[#18181b] border border-white/5 rounded-2xl p-6 min-h-[550px] flex flex-col justify-between shadow-sm">
            
            {/* ================================== TAB 1: AI MULTI-TURN CHATBOT ================================== */}
            {studioTab === "CHAT" && (
              <div className="flex flex-col flex-1 justify-between gap-4 h-full">
                {/* Chat Config / System Instruction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-white/5">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Agent Character Persona (System Instruction)</label>
                    <input 
                      type="text" 
                      value={chatbotRole}
                      onChange={(e) => setChatbotRole(e.target.value)}
                      placeholder="e.g. 'Expert Copywriter', 'Financial Analyst'"
                      className="w-full bg-[#09090b] border border-white/5 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/30 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Intelligence Layer Selection</label>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={thinkingEnabled}
                      className="w-full bg-[#09090b] border border-white/5 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/30 font-semibold disabled:opacity-50"
                    >
                      <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency)</option>
                      <option value="gemini-3.5-flash">gemini-3.5-flash (Balanced / General)</option>
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks)</option>
                    </select>
                  </div>
                </div>

                {/* Scrollable Message Thread */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px] max-h-[400px] custom-scrollbar-dark py-2">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-3 text-xs leading-relaxed max-w-full ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role !== 'user' && (
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                          G
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                        msg.role === 'user' 
                          ? 'bg-[#27272a] border-zinc-700 text-zinc-100 rounded-br-none' 
                          : 'bg-[#09090b] border-white/5 text-zinc-300 rounded-bl-none'
                      }`}>
                        {/* Thinking mode reasoning indicator block */}
                        {msg.thinking && (
                          <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-mono text-emerald-400">
                            <Cpu className="h-3 w-3 text-emerald-400 animate-spin" />
                            <span>System reasoning trace complete using ThinkingLevel.HIGH</span>
                          </div>
                        )}
                        <p className="whitespace-pre-line text-xs font-normal leading-relaxed">{msg.content}</p>
                      </div>

                      {msg.role === 'user' && (
                        <div className="h-7 w-7 rounded-lg bg-zinc-700 flex items-center justify-center font-bold text-zinc-200 shrink-0">
                          U
                        </div>
                      )}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-3 text-xs justify-start items-center">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                        G
                      </div>
                      <div className="bg-[#09090b] border border-white/5 text-zinc-500 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                        <span className="font-mono text-[10px]">Gemini is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input row + High Thinking Switch */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#09090b]/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`h-4 w-4 ${thinkingEnabled ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                      <span className="text-[10px] font-bold tracking-wider font-mono uppercase text-zinc-400">Enable High Thinking Mode</span>
                      <span className="text-[9px] text-zinc-500 bg-[#27272a] px-1.5 py-0.5 rounded font-semibold font-mono">gemini-3.1-pro-preview</span>
                    </div>
                    
                    {/* Toggle */}
                    <button 
                      onClick={() => setThinkingEnabled(!thinkingEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        thinkingEnabled ? "bg-emerald-500" : "bg-zinc-800"
                      }`}
                    >
                      <div className={`bg-[#09090b] w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        thinkingEnabled ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                      placeholder={thinkingEnabled ? "Ask a complex reasoning or programming query..." : "Ask Gemini anything..."}
                      className="flex-1 bg-[#09090b] border border-white/5 rounded-xl py-2.5 px-4 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 font-medium"
                    />
                    <button 
                      onClick={handleSendChatMessage}
                      disabled={!userInput.trim() || isChatLoading}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================== TAB 2: IMAGE GENERATION WITH ASPECT RATIOS ================================== */}
            {studioTab === "IMAGES" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <Image className="h-4 w-4 text-emerald-400 animate-pulse" />
                      Imagen 3 Asset Generator
                    </h2>
                    <p className="text-[11px] text-zinc-500 mt-1">Generate social media visual drafts, pins, or website headers with absolute layout aspect ratio controls.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Prompt input */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Image Prompt</label>
                      <textarea
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Describe your creative vision in detail... e.g., 'Modern glass architecture office overlooking mountains, dark emerald color grading, minimalist design, ultra realistic 8k'"
                        className="w-full bg-[#09090b] border border-white/5 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 font-medium min-h-[70px] resize-none"
                      />
                    </div>

                    {/* Aspect ratios selector (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, and 21:9) */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Aspect Ratio Affordance</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setImageAspectRatio(ratio)}
                            className={`py-2 px-1 rounded-lg border text-[10px] font-mono font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                              imageAspectRatio === ratio 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500" 
                                : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                            }`}
                          >
                            <span className="text-[9px] font-mono">{ratio}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality toggles & Size selection (1K, 2K, 4K) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Image Engine Grade</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setImageQuality("general")}
                            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                              imageQuality === "general" 
                                ? "bg-[#27272a] text-zinc-100 border-zinc-700" 
                                : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                            }`}
                          >
                            General (gemini-3.1-flash-image)
                          </button>
                          <button
                            onClick={() => setImageQuality("studio")}
                            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                              imageQuality === "studio" 
                                ? "bg-[#27272a] text-emerald-400 border-emerald-500/30" 
                                : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                            }`}
                          >
                            Studio (gemini-3-pro-image)
                          </button>
                        </div>
                      </div>

                      {/* Size selection (1K, 2K, 4K) - Hidden or disabled if not studio */}
                      <div className={`transition-all duration-300 ${imageQuality === "studio" ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Resolution Standard Size</label>
                        <div className="flex gap-2">
                          {["1K", "2K", "4K"].map((size) => (
                            <button
                              key={size}
                              onClick={() => setImageSize(size)}
                              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                imageSize === size 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500" 
                                  : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                              }`}
                            >
                              {size} HD
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Output Panel & Submit */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 border-t border-white/5 items-center">
                  <div className="md:col-span-8 flex flex-col items-center justify-center bg-[#09090b] rounded-2xl border border-white/5 min-h-[220px] relative overflow-hidden p-4">
                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center text-center gap-3">
                        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
                        <span className="text-[11px] font-mono text-zinc-500">Compiling Imagen nodes...</span>
                      </div>
                    ) : generatedImageUrl ? (
                      <div className="w-full h-full flex flex-col items-center relative group">
                        <img 
                          src={generatedImageUrl} 
                          alt="AI Generated Asset" 
                          referrerPolicy="no-referrer"
                          className="max-h-[250px] object-contain rounded-xl border border-white/10"
                        />
                        <a 
                          href={generatedImageUrl} 
                          download="gemini-studio-asset.jpg"
                          className="absolute bottom-3 right-3 p-2 bg-black/80 hover:bg-black rounded-lg border border-white/10 text-emerald-400 text-xs flex items-center gap-1.5 transition shadow-md"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                      </div>
                    ) : (
                      <div className="text-center text-zinc-600 p-6 flex flex-col items-center gap-2">
                        <Image className="h-10 w-10 text-zinc-800" />
                        <span className="text-xs">Generated asset preview will display here.</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4">
                    <button
                      onClick={handleGenerateImage}
                      disabled={!imagePrompt.trim() || isGeneratingImage}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Visual Asset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================== TAB 3: VEO VIDEO GENERATOR ================================== */}
            {studioTab === "VIDEO" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <Video className="h-4 w-4 text-emerald-400 animate-pulse" />
                      Veo 3.1 Fast Video Engine
                    </h2>
                    <p className="text-[11px] text-zinc-500 mt-1">Create cinematic video footage up to 5 seconds long from single-sentence natural language descriptions.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Prompt input */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Video Scenic Prompt</label>
                      <textarea
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        placeholder="Describe camera movement, lighting, and action... e.g. 'Slow pan over a futuristic glowing city with flying drone couriers, cinematic sunset, realistic reflections, 4k'"
                        className="w-full bg-[#09090b] border border-white/5 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 font-medium min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Aspect ratios (16:9 or 9:16) */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Aspect Ratio Selection</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setVideoAspectRatio("16:9")}
                          className={`flex-1 py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            videoAspectRatio === "16:9" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500" 
                              : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <Eye className="h-4 w-4 shrink-0" />
                          <span>16:9 Landscape (Desktop/Widescreen)</span>
                        </button>
                        <button
                          onClick={() => setVideoAspectRatio("9:16")}
                          className={`flex-1 py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            videoAspectRatio === "9:16" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500" 
                              : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <Video className="h-4 w-4 shrink-0" />
                          <span>9:16 Portrait (Mobile Stories/Pins)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video output panel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 border-t border-white/5 items-center">
                  <div className="md:col-span-8 flex flex-col items-center justify-center bg-[#09090b] rounded-2xl border border-white/5 min-h-[220px] max-h-[280px] relative overflow-hidden p-2">
                    {isGeneratingVideo ? (
                      <div className="flex flex-col items-center text-center gap-3">
                        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
                        <span className="text-[11px] font-mono text-zinc-500">Processing Veo 3 Video Operation (Poller active)...</span>
                      </div>
                    ) : generatedVideoUrl ? (
                      <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden relative">
                        <video 
                          src={generatedVideoUrl} 
                          controls 
                          autoPlay 
                          loop 
                          className="max-h-[250px] object-contain w-full"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-zinc-600 p-6 flex flex-col items-center gap-2">
                        <Video className="h-10 w-10 text-zinc-800" />
                        <span className="text-xs">Veo rendering player will display here.</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4">
                    <button
                      onClick={handleGenerateVideo}
                      disabled={!videoPrompt.trim() || isGeneratingVideo}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Veo 3 Video</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================== TAB 4: MULTIMODAL HUB & AUDIO TRANSCRIPTION ================================== */}
            {studioTab === "MULTIMODAL" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-emerald-400 animate-pulse" />
                      Multimodal Insights & Voice Transcription
                    </h2>
                    <p className="text-[11px] text-zinc-500 mt-1">Transcribe voice files instantly using gemini-3.5-flash speech-to-text, or leverage gemini-3.1-pro-preview to extract insights from photos and videos.</p>
                  </div>

                  {/* Mode select & file drag-drop */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Controls */}
                    <div className="md:col-span-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Analysis Target</label>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { id: "image", label: "Image Understanding (gemini-3.1-pro-preview)" },
                            { id: "video", label: "Video Analysis (gemini-3.1-pro-preview)" },
                            { id: "audio", label: "Audio Transcription (gemini-3.5-flash)" }
                          ].map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setMultimodalMode(m.id as any);
                                setUploadedFile(null);
                                setMediaAnalysisOutput("");
                              }}
                              className={`w-full py-2 px-3 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                                multimodalMode === m.id 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500" 
                                  : "bg-[#09090b] text-zinc-500 border-white/5 hover:border-white/10"
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Microphone Recording (Only relevant if audio mode is selected) */}
                      {multimodalMode === "audio" && (
                        <div className="bg-[#09090b] rounded-xl border border-white/5 p-4 space-y-3">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Microphone Recorder</label>
                          <div className="flex items-center gap-3">
                            {isRecording ? (
                              <button 
                                onClick={stopRecording}
                                className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse cursor-pointer shadow"
                              >
                                <Square className="h-4 w-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={startRecording}
                                className="h-10 w-10 rounded-full bg-emerald-500 text-black flex items-center justify-center cursor-pointer shadow"
                              >
                                <Mic className="h-4.5 w-4.5" />
                              </button>
                            )}
                            <div>
                              <div className="text-xs font-bold text-zinc-200">
                                {isRecording ? "Listening..." : "Click to Record Voice"}
                              </div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">
                                {isRecording ? `Recording ${formatTime(recordingSeconds)}` : "Supported by native microphone inputs"}
                              </div>
                            </div>
                          </div>
                          {isRecording && (
                            <div className="flex gap-1 justify-center py-2">
                              {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="w-1 bg-emerald-500 rounded animate-bounce" style={{ height: `${Math.random()*20 + 8}px`, animationDelay: `${i*0.1}s` }} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Manual File input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Upload Source File</label>
                        <label className="w-full flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-white/20 bg-[#09090b] rounded-xl p-4 text-center cursor-pointer transition">
                          <Upload className="h-5 w-5 text-zinc-500 mb-1" />
                          <span className="text-[11px] font-semibold text-zinc-400">
                            {uploadedFile ? uploadedFile.name : "Choose File"}
                          </span>
                          <span className="text-[9px] text-zinc-600 mt-0.5">
                            {multimodalMode === "image" ? "PNG, JPEG" : multimodalMode === "video" ? "MP4, WEBM" : "WAV, MP3, M4A"}
                          </span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept={multimodalMode === "image" ? "image/*" : multimodalMode === "video" ? "video/*" : "audio/*"}
                            onChange={handleFileChange} 
                          />
                        </label>
                      </div>
                    </div>

                    {/* Prompts & Response */}
                    <div className="md:col-span-7 flex flex-col justify-between gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold">Analysis / Transcribe Prompt</label>
                        <input
                          type="text"
                          value={multimodalPrompt}
                          onChange={(e) => setMultimodalPrompt(e.target.value)}
                          placeholder={multimodalMode === "audio" ? "Transcribe this audio precisely..." : "e.g. 'Identify layout structure and suggest 3 improvements.'"}
                          className="w-full bg-[#09090b] border border-white/5 rounded-xl py-2.5 px-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 font-medium"
                        />
                      </div>

                      {/* Display panel */}
                      <div className="flex-1 bg-[#09090b] rounded-xl border border-white/5 p-4 min-h-[170px] max-h-[220px] overflow-y-auto custom-scrollbar-dark">
                        {isAnalyzingMedia ? (
                          <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                            <RefreshCw className="h-5 w-5 text-emerald-500 animate-spin" />
                            <span className="text-[10px] font-mono text-zinc-500">Extracting nodes using Google GenAI SDK...</span>
                          </div>
                        ) : mediaAnalysisOutput ? (
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">RESULTS</span>
                            <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-line font-medium">{mediaAnalysisOutput}</p>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-center text-zinc-600 text-[11px]">
                            Upload media and click Analyze to view insights here.
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleAnalyzeMedia}
                        disabled={!uploadedFile || isAnalyzingMedia}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Analyze & Process Media</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            </div>
          </div>
        )}

    </div>
  );
}
