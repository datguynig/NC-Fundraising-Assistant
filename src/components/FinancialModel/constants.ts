import { Scenario, ScenarioKey } from './types';

// Static configuration, scenario, and pricing data

export const CURRENCY = 'GBP';

export const DEFAULT_PROJECTION_MONTHS = 36;
export const M12_INDEX = 11; // Month 12 (0-based)
export const M36_INDEX = 35; // Month 36 (0-based)

export const DEFAULT_CURRENT_DATE = '2025-10-01';
export const DEFAULT_RAISE_DATE = '2025-11';
export const DEFAULT_ARR_MULTIPLE = 8;
export const DEFAULT_SELECTED_SCENARIO: ScenarioKey = 'base';

export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export const HISTORICAL_DATA = {
  years: [
    { year: 2021, revenue: 409, costs: 25985, net: -25576, funding: 0, salaries: 18500, marketing: 2800, tools: 3200, other: 1485 },
    { year: 2022, revenue: 21416, costs: 62450, net: -41034, funding: 30000, salaries: 42300, marketing: 8900, tools: 7250, other: 4000 },
    { year: 2023, revenue: 16372, costs: 133505, net: -117133, funding: 150000, salaries: 89400, marketing: 24800, tools: 12305, other: 7000 },
    { year: 2024, revenue: 42508, costs: 80934, net: -38426, funding: 0, salaries: 52800, marketing: 15234, tools: 9800, other: 3100 },
    { year: 2025, revenue: 21249, costs: 27733, net: -6484, funding: 0, ytd: 10, salaries: 13790, marketing: 8943, tools: 3800, other: 1200 },
  ],
  currentState: {
    totalUsers: 17528,
    totalFundingToDate: 264105,
    currentCash: 147.72,
    currentMonthlyBurn: 3962,
    activeProUsers: 0,
    activePlusUsers: 0,
    activeB2BClients: 0,
  },
} as const;

export const CAP_TABLE = {
  sharesOutstanding: 4820332,
  optionPool: 406033,
  fullyDiluted: 5226365,
  totalInvested: 264105,
} as const;

export const PRICING = {
  creative: { pro: 6, plus: 10 },
  b2b: { starter: 39, growth: 119, scale: 279 },
  marketplace: { listingFee2Week: 60, listingFee4Week: 100, platformFee: 0.125, commaCredits: 20 },
} as const;

export const ARR_MULTIPLE_GUIDANCE = {
  saas: { low: 6, mid: 10, high: 15, description: 'SaaS companies (recurring revenue)' },
  marketplace: { low: 2, mid: 4, high: 8, description: 'Marketplace transaction revenue' },
  blended: { low: 5, mid: 8, high: 12, description: 'Blended (SaaS + Marketplace)' },
  notes: 'Multiples increase with: 100%+ growth, low churn, strong unit economics',
} as const;

export const COST_STRUCTURE = {
  toolsAndInfra: { base2025: 818, base2026: 1616, base2027: 3306, annualSubs: 213 },
  outsourced: { base2025: 900, base2026: 1260, base2027: 1440 },
  teamSalaries: { base2025: 1970, base2026: 15308, base2027: 17874, conservative: 1.0, base: 1.0, growth: 1.25 },
  salesStaff: { salary: 2000, quota: 5000, leadsPerSalesPerson: 100 },
  supportStaff: { salary: 1500, usersPerPerson: 2000 },
  collectionRates: { recurring: 0.98, transaction: 0.90 },
} as const;

export const DEFAULT_SCENARIOS: Record<ScenarioKey, Scenario> = {
  worst: {
    name: 'Conservative',
    monthlyLeads: 50,
    leadToDemo: 0.05,
    demoToPaid: 0.10,
    b2bLeadConversion: 0.02,
    b2bPlanMix: { starter: 0.70, growth: 0.25, scale: 0.05 },
    b2bChurnAnnual: 0.25,
    b2bUpsellRate: 0.01,
    organicGrowthRate: 1.015,
    proConversion: 0.02,
    plusConversion: 0.008,
    churnAnnual: 0.15,
    listingsPerUser: 0.0006,
    listingToProjectRate: 0.40,
    marketplaceCapture: 0.25,
    avgProjectValue: 1500,
    creditsPurchasesPerMonth: 15,
    marketingBudget: 290,
    baseTeamSalaries: 1970,
    toolsGrowthRate: 1.0,
    teamGrowthMultiplier: 1.0,
  },
  base: {
    name: 'Base Case',
    monthlyLeads: 200,
    leadToDemo: 0.15,
    demoToPaid: 0.25,
    b2bLeadConversion: 0.0375,
    b2bPlanMix: { starter: 0.50, growth: 0.40, scale: 0.10 },
    b2bChurnAnnual: 0.15,
    b2bUpsellRate: 0.03,
    organicGrowthRate: 1.03,
    proConversion: 0.035,
    plusConversion: 0.015,
    churnAnnual: 0.10,
    listingsPerUser: 0.0022,
    listingToProjectRate: 0.50,
    marketplaceCapture: 0.50,
    avgProjectValue: 2500,
    creditsPurchasesPerMonth: 60,
    marketingBudget: 1520,
    baseTeamSalaries: 1970,
    toolsGrowthRate: 1.10,
    teamGrowthMultiplier: 1.0,
  },
  best: {
    name: 'Growth Case',
    monthlyLeads: 500,
    leadToDemo: 0.25,
    demoToPaid: 0.40,
    b2bLeadConversion: 0.10,
    b2bPlanMix: { starter: 0.20, growth: 0.50, scale: 0.30 },
    b2bChurnAnnual: 0.08,
    b2bUpsellRate: 0.05,
    organicGrowthRate: 1.05,
    proConversion: 0.05,
    plusConversion: 0.025,
    churnAnnual: 0.06,
    listingsPerUser: 0.0068,
    listingToProjectRate: 0.65,
    marketplaceCapture: 0.70,
    avgProjectValue: 3500,
    creditsPurchasesPerMonth: 150,
    marketingBudget: 4160,
    baseTeamSalaries: 1970,
    toolsGrowthRate: 1.15,
    teamGrowthMultiplier: 1.25,
  },
};

export const SCENARIO_KEYS: ScenarioKey[] = ['worst', 'base', 'best'];
