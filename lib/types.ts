
export type Range = readonly [number, number];

export interface Feature {
    label: string;
    cost: Range;
    weeks: Range;
}

export interface Service {
  label: string;
  blurb: string;
  base: {
    cost: Range;
    weeks: Range;
  };
  features: Record<string, Feature>;
}

export const CATALOG = {
  ai: {
    label: "AI agents & automation",
    blurb: "Autonomous agents, LLM workflows, voice agents.",
    base: { cost: [120000, 250000], weeks: [3, 6] },
    features: {
      "ai.voice": {
        label: "AI voice agent",
        cost: [80000, 150000],
        weeks: [2, 4],
      },
      "ai.integration": {
        label: "CRM / SaaS integration",
        cost: [40000, 90000],
        weeks: [1, 3],
      },
      "ai.docs": {
        label: "Document & data-entry automation",
        cost: [50000, 100000],
        weeks: [2, 3],
      },
      "ai.rag": {
        label: "Knowledge base / RAG assistant",
        cost: [90000, 180000],
        weeks: [3, 5],
      },
    },
  },
  software: {
    label: "Web & mobile software",
    blurb: "Full-stack platforms, SaaS products, dashboards.",
    base: { cost: [150000, 350000], weeks: [4, 8] },
    features: {
      "software.auth": {
        label: "Authentication & user roles",
        cost: [25000, 50000],
        weeks: [1, 2],
      },
      "software.payments": {
        label: "Payments & billing",
        cost: [30000, 60000],
        weeks: [1, 3],
      },
      "software.admin": {
        label: "Admin dashboard & reporting",
        cost: [50000, 100000],
        weeks: [2, 4],
      },
      "software.mobile": {
        label: "Mobile app (iOS + Android)",
        cost: [150000, 300000],
        weeks: [5, 9],
      },
    },
  },
  cloud: {
    label: "Cloud & infrastructure",
    blurb: "AWS / Azure deployment, CI/CD, legacy migration.",
    base: { cost: [80000, 180000], weeks: [2, 5] },
    features: {
      "cloud.cicd": {
        label: "CI/CD pipelines",
        cost: [30000, 60000],
        weeks: [1, 2],
      },
      "cloud.migration": {
        label: "Legacy system migration",
        cost: [120000, 250000],
        weeks: [4, 8],
      },
      "cloud.security": {
        label: "Security audit & hardening",
        cost: [40000, 80000],
        weeks: [1, 3],
      },
    },
  },
  marketing: {
    label: "Technical SEO & growth",
    blurb: "SEO engineering, funnels, CRM automation.",
    base: { cost: [30000, 70000], weeks: [2, 4] },
    features: {
      "marketing.audit": {
        label: "Technical SEO audit",
        cost: [20000, 40000],
        weeks: [1, 2],
      },
      "marketing.funnel": {
        label: "Conversion-focused landing pages",
        cost: [40000, 90000],
        weeks: [2, 4],
      },
      "marketing.crm": {
        label: "CRM nurture automation",
        cost: [40000, 80000],
        weeks: [2, 3],
      },
    },
  },
} as const satisfies Record<string, Service>;

export const COMPLEXITY = {
    mvp: {
        label: 'MVP / proof of concept', 
        cost: 1.0,
        time: 1.0,
        hint: 'Core flow only, fastest route to validation.'
    },
    production: {
        label: 'Production-ready',
        cost: 1.5,
        time: 1.4,
        hint: 'Testing, monitoring, polish and docs',
    },
    enterprise: {
        label: 'Enterprise-grade',
        cost: 2.2,
        time: 1.9,
        hint: 'Compliance, scale, SSO and SLAs.',
    }
} as const;

export const TIMELINE = {
    flexible: {
        label: 'Flexible(3+ months)',
        cost: 0.95,
        time: 1.15,
    },
    standard: {
        label: 'Standard(6-12 weeks)',
        cost: 1.0,
        time: 1.0,
    },
    fast: {
        label: 'Fast-track (under 6 weeks)',
        cost: 1.25,
        time: 0.75,
    },
} as const;

export const LIMITS = {
  maxMessages: 24,
  maxChars: 1000,
  maxToolRounds: 3
} as const;

export type ServiceId = keyof typeof CATALOG;
export type ComplexityId = keyof typeof COMPLEXITY;
export type TimelineId = keyof typeof TIMELINE;
export type FeatureId = {
    [S in ServiceId]: keyof (typeof CATALOG)[S]['features'];
}[ServiceId];

export interface Selection {
    services: ServiceId[];
    features: FeatureId[];
    complexity: ComplexityId;
    timeline: TimelineId;
}

export interface Estimate {
    min: number;
    max: number;
    weeksMin: number;
    weeksMax: number;
    breakdown: {
        service: ServiceId;
        label: string;
        min: number;
        max: number
    }[];
}

export interface ContactInfo {
    name?: string;
    company?: string;
    message?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const SERVICE_IDS = Object.keys(CATALOG) as ServiceId[];

export const FEATURE_INDEX: Record<string, { service: ServiceId } & Feature> = {};
for (const s of SERVICE_IDS){
    for (const [id, f] of Object.entries<Feature>(CATALOG[s].features)){
        FEATURE_INDEX[id] = { service: s, ...f };
    }
}

export const featureLabel = (id: string): string => FEATURE_INDEX[id]?.label ?? id;

export const isService = (v: unknown): v is ServiceId => typeof v === 'string' && Object.hasOwn(CATALOG, v);
export const isFeature = (v: unknown): v is FeatureId => typeof v === 'string' && Object.hasOwn(FEATURE_INDEX, v);
export const isComplexity = (v: unknown): v is ComplexityId => typeof v === 'string' && Object.hasOwn(COMPLEXITY, v);
export const isTimeline = (v: unknown): v is TimelineId => typeof v === 'string' && Object.hasOwn(TIMELINE, v);

export const DEFAULT_SELECTION: Selection = {
  services: [],
  features: [],
  complexity: 'mvp',
  timeline: 'standard',
};