import { SeedKeyword, ExpandedKeyword, Article, Pin, AffiliateOffer, LogMessage, CeoDecision, QueueItem } from "../types";

export async function fetchHealth(): Promise<{ status: string; mode: string }> {
  const res = await fetch("/api/health");
  return res.json();
}

export async function fetchSeeds(): Promise<SeedKeyword[]> {
  const res = await fetch("/api/seeds");
  return res.json();
}

export async function addSeed(keyword: string): Promise<SeedKeyword> {
  const res = await fetch("/api/seeds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add seed keyword");
  }
  return res.json();
}

export async function fetchKeywords(): Promise<ExpandedKeyword[]> {
  const res = await fetch("/api/keywords");
  return res.json();
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch("/api/articles");
  return res.json();
}

export async function fetchPins(): Promise<Pin[]> {
  const res = await fetch("/api/pins");
  return res.json();
}

export async function fetchOffers(): Promise<AffiliateOffer[]> {
  const res = await fetch("/api/offers");
  return res.json();
}

export async function addOffer(offer: Omit<AffiliateOffer, "id">): Promise<AffiliateOffer> {
  const res = await fetch("/api/offers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offer),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add affiliate offer");
  }
  return res.json();
}

export async function fetchLogs(): Promise<LogMessage[]> {
  const res = await fetch("/api/logs");
  return res.json();
}

export async function fetchStats(): Promise<{
  stats: {
    totalRevenue: number;
    totalClicks: number;
    totalConversions: number;
    recentClicks: number[];
    recentRevenue: number[];
    dates: string[];
    ceoDecisions?: CeoDecision[];
  };
  realtime: any[];
  events: any[];
}> {
  const res = await fetch("/api/stats");
  return res.json();
}

export async function fetchQueue(): Promise<QueueItem[]> {
  const res = await fetch("/api/queue");
  return res.json();
}

export async function processQueueStep(): Promise<{ status: string; message?: string; item?: QueueItem }> {
  const res = await fetch("/api/queue/process", { method: "POST" });
  return res.json();
}

export async function clearAllData(): Promise<{ success: boolean }> {
  const res = await fetch("/api/queue/clear", { method: "POST" });
  return res.json();
}

export async function triggerManualCycle(): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/trigger-cycle", { method: "POST" });
  return res.json();
}

export async function runCeoOptimizer(): Promise<CeoDecision> {
  const res = await fetch("/api/ceo-run", { method: "POST" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to execute AI CEO Optimizer");
  }
  return res.json();
}

export async function fetchIntegrations(): Promise<any[]> {
  const res = await fetch("/api/integrations");
  return res.json();
}

export async function updateIntegration(
  id: string,
  apiKey: string,
  additionalConfig?: Record<string, string>
): Promise<{ success: boolean; integration: any }> {
  const res = await fetch("/api/integrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, apiKey, additionalConfig })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update integration");
  }
  return res.json();
}

export async function testIntegration(
  id: string,
  apiKey: string,
  additionalConfig?: Record<string, string>
): Promise<{ success: boolean; error?: string; status: string }> {
  const res = await fetch("/api/integrations/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, apiKey, additionalConfig })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to test integration");
  }
  return res.json();
}
