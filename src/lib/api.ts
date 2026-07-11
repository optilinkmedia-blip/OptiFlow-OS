import { SeedKeyword, ExpandedKeyword, Article, Pin, AffiliateOffer, LogMessage, CeoDecision, QueueItem } from "../types";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request to ${url} failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function fetchHealth(): Promise<{ status: string; mode: string }> {
  return getJson<{ status: string; mode: string }>("/api/health");
}

export async function fetchSeoConfig(): Promise<{ siteTitle: string; siteDescription: string }> {
  return getJson<{ siteTitle: string; siteDescription: string }>("/api/seo");
}

export async function updateSeoConfig(config: { siteTitle: string; siteDescription: string }): Promise<void> {
  const res = await fetch("/api/seo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update SEO config");
  }
}

export async function generateSeoConfig(): Promise<{ siteTitle: string; siteDescription: string }> {
  const res = await fetch("/api/seo/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate SEO config with AI");
  }
  return res.json();
}

export async function fetchSeeds(): Promise<SeedKeyword[]> {
  return getJson<SeedKeyword[]>("/api/seeds");
}

export async function addSeed(keyword: string): Promise<SeedKeyword> {
  const res = await fetch("/api/seeds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to add seed keyword");
  }
  return res.json();
}

export async function fetchKeywords(): Promise<ExpandedKeyword[]> {
  return getJson<ExpandedKeyword[]>("/api/keywords");
}

export async function fetchArticles(): Promise<Article[]> {
  return getJson<Article[]>("/api/articles");
}

export async function fetchPins(): Promise<Pin[]> {
  return getJson<Pin[]>("/api/pins");
}

export async function fetchOffers(): Promise<AffiliateOffer[]> {
  return getJson<AffiliateOffer[]>("/api/offers");
}

export async function addOffer(offer: Omit<AffiliateOffer, "id">): Promise<AffiliateOffer> {
  const res = await fetch("/api/offers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offer),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to add affiliate offer");
  }
  return res.json();
}

export async function fetchLogs(): Promise<LogMessage[]> {
  return getJson<LogMessage[]>("/api/logs");
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
  return getJson<any>("/api/stats");
}

export async function fetchQueue(): Promise<QueueItem[]> {
  return getJson<QueueItem[]>("/api/queue");
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
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to execute AI CEO Optimizer");
  }
  return res.json();
}

export async function fetchIntegrations(): Promise<any[]> {
  return getJson<any[]>("/api/integrations");
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
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update integration");
  }
  return res.json();
}

export async function testIntegration(
  id: string,
  apiKey: string,
  additionalConfig?: Record<string, string>
): Promise<{ success: boolean; error?: string; status: string; transient?: boolean }> {
  const res = await fetch("/api/integrations/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, apiKey, additionalConfig })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to test integration");
  }
  return res.json();
}
