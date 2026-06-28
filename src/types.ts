export interface SeedKeyword {
  id: string;
  keyword: string;
  createdAt: number;
  status: 'active' | 'paused';
  keywordCount: number;
  articleCount: number;
  revenue: number;
  intelligenceFusion?: {
    pinterestData: {
      url: string;
      title: string;
      pinCount: string;
      viralKeywords: string[];
      visualStyle: string;
    }[];
    serpData: {
      rankingTrends: string[];
      intentLevel: string;
      contentGaps: string[];
      variations: string[];
    };
    fusionReport: {
      viralAngles: string[];
      monetizablePatterns: string[];
      emotionalHooks: string[];
      affiliateOpportunities: string[];
    };
  };
}

export interface ExpandedKeyword {
  id: string;
  seedId: string;
  keyword: string;
  type: 'long-tail' | 'problem-based' | 'buyer-intent' | 'pinterest-search';
  searchVolume: number;
  cpc: number;
  difficulty: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface ContentCluster {
  id: string;
  keywordId: string;
  keyword: string;
  intent: string;
  clusterTitle: string;
  createdAt: number;
}

export interface Article {
  id: string;
  keywordId: string;
  keyword: string;
  title: string;
  metaDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
  ctas: string[];
  affiliatePlacements: string[];
  pinterestAngles: string[];
  offerId: string;
  status: 'draft' | 'queued' | 'published';
  clicks: number;
  conversions: number;
  revenue: number;
  epc: number;
  createdAt: number;
  lastRewrittenAt?: number;
  abTest?: {
    active: boolean;
    offers: {
      offerId: string;
      clicks: number;
      conversions: number;
      revenue: number;
      epc: number;
      flaggedForReview?: boolean;
    }[];
    winnerOfferId?: string;
  };
}

export interface Pin {
  id: string;
  articleId: string;
  title: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  targetUrl: string;
  clicks: number;
  published: boolean;
  publishedAt?: number;
}

export interface AffiliateOffer {
  id: string;
  name: string;
  network: 'MaxBounty' | 'ClickBank' | 'ShareASale' | 'SaaS';
  payout: number;
  epc: number;
  url: string;
  vertical: string;
}

export interface RevenueEvent {
  id: string;
  articleId: string;
  keyword: string;
  source: 'pinterest' | 'seo' | 'telegram';
  clicks: number;
  conversions: number;
  revenue: number;
  timestamp: number;
}

export interface RevenueStats {
  totalRevenue: number;
  totalClicks: number;
  totalConversions: number;
  recentClicks: number[];
  recentRevenue: number[];
  dates: string[];
  ceoDecisions?: CeoDecision[];
}

export interface RealtimeMetrics {
  articleId: string;
  title: string;
  clicks_last_5min: number;
  revenue_last_5min: number;
  epc_live: number;
  conversion_rate_live: number;
  traffic_source: string;
}

export interface CeoDecision {
  id: string;
  scale: string[];
  rewrite: string[];
  stop: string[];
  newKeywords: string[];
  actions: string[];
  createdAt: number;
}

export interface QueueItem {
  id: string;
  type: 'expand' | 'cluster' | 'article' | 'pins' | 'publish';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: any;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface LogMessage {
  id: string;
  timestamp: number;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
