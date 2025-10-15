// Types for the modular Financial Model

export type ViewKey =
  | 'overview'
  | 'revenue'
  | 'expenses'
  | 'unit-economics'
  | 'raise'
  | 'analysis'
  | 'scenarios'
  | 'settings';

export type ScenarioKey = 'worst' | 'base' | 'best';

export interface PlanMix {
  starter: number;
  growth: number;
  scale: number;
}

export interface Scenario {
  name: string;
  monthlyLeads: number;
  leadToDemo: number; // fraction 0..1
  demoToPaid: number; // fraction 0..1
  b2bLeadConversion: number; // overall fraction 0..1
  b2bPlanMix: PlanMix; // distribution across starter/growth/scale
  b2bChurnAnnual: number; // annual fraction
  b2bUpsellRate: number; // monthly fraction
  organicGrowthRate: number; // monthly multiplier, e.g. 1.03
  proConversion: number; // annual fraction 0..1
  plusConversion: number; // annual fraction 0..1
  churnAnnual: number; // annual fraction 0..1
  listingsPerUser: number; // monthly listings per user
  listingToProjectRate: number; // fraction 0..1
  marketplaceCapture: number; // fraction 0..1
  avgProjectValue: number; // currency
  creditsPurchasesPerMonth: number; // count
  marketingBudget: number; // currency per month
  baseTeamSalaries: number; // currency per month
  toolsGrowthRate: number; // annual growth multiplier, e.g. 1.10
  teamGrowthMultiplier: number; // multiplier for later years
}

export interface ModelState {
  view: ViewKey;
  currentDate: string; // ISO date (YYYY-MM-DD)
  projectionMonths: number; // typically 36
  raiseAmount: number;
  raiseDate: string; // YYYY-MM
  arrMultiple: number;
  selectedScenario: ScenarioKey;
  scenarios: Record<ScenarioKey, Scenario>;
  exitMultiple: number;
  exitYear: number; // years from current date
  showRunwayAlert: boolean;
  showRevenueBreakdown: boolean;
  startingCash: number;
  enableSeasonality: boolean;
  enableVariance: boolean;
  variancePercent: number; // 0..100
  diligenceMode: boolean; // if true, suppress randomness
  showActuals: boolean;
  actuals: Record<string, unknown>;
}

export interface CreativeBreakdown {
  totalUsers: number;
  proConvRate: number;
  plusConvRate: number;
  proPaid: number;
  plusPaid: number;
  proPrice: number;
  plusPrice: number;
  monthlyChurnRate: number;
  newProThisMonth: number;
  newPlusThisMonth: number;
}

export interface B2BBreakdown {
  monthlyLeads: number;
  leadToDemo: number;
  demos: number;
  demoToPaid: number;
  newClients: number;
  starterClients: number;
  growthClients: number;
  scaleClients: number;
  starterPrice: number;
  growthPrice: number;
  scalePrice: number;
  monthlyChurnRate: number;
  starterChurned: number;
  growthChurned: number;
  scaleChurned: number;
  starterUpsold: number;
  growthUpsold: number;
}

export interface MarketplaceBreakdown {
  totalUsers: number;
  listingsPerUser: number;
  monthlyListings: number;
  avgListingFee: number;
  listingToProjectRate: number;
  listingsWithResponses: number;
  captureRate: number;
  projectsOnPlatform: number;
  avgProjectValue: number;
  platformFeeRate: number;
}

export interface CostBreakdown {
  baseTeam: number;
  sales: number;
  support: number;
  marketing: number;
  tools: number;
  outsourced: number;
  events: number;
}

export interface ProjectionMonth {
  month: number;
  date: string; // e.g. 'Oct 25'
  totalRevenue: number;
  recurringRevenue: number;
  transactionRevenue: number;
  creativeMRR: number;
  b2bMRR: number;
  listingsRevenue: number;
  platformFees: number;
  creditsRevenue: number;
  totalCosts: number;
  salaries: number;
  marketing: number;
  tools: number;
  outsourced: number;
  events: number;
  closingCash: number;
  netCashFlow: number;
  netIncome: number;
  totalUsers: number;
  proPaid: number;
  plusPaid: number;
  starterClients: number;
  growthClients: number;
  scaleClients: number;
  totalB2BClients: number;
  monthlyListings: number;
  projectsOnPlatform: number;
  monthlyLeads: number;
  demos: number;
  newB2BClients: number;
  cac: number;
  b2bLTV: number;
  ltvCacRatio: number;
  paybackMonths: number;
  runway: number;
  funding: number;
  salesHeadcount: number;
  supportHeadcount: number;
  seasonalMultiplier: number;
  creativeBreakdown: CreativeBreakdown;
  b2bBreakdown: B2BBreakdown;
  marketplaceBreakdown: MarketplaceBreakdown;
  costBreakdown: CostBreakdown;
}

export type AllProjections = Record<ScenarioKey, ProjectionMonth[]>;

export interface ValuationMetrics {
  arr: number;
  preMoney: number;
  postMoney: number;
  newShares: number;
  founderDilution: number; // percent 0..100
  endingCash: number;
  revenueBreakdown: {
    creative: number;
    b2b: number;
    listings: number;
    platform: number;
    credits: number;
  };
}

export interface InvestorROI {
  futureARR: number;
  exitValuation: number;
  investorPayout: number;
  multipleReturn: number;
  equityOwned: number; // 0..1
  totalYearsToExit: number;
}

export interface RunwayStatus {
  cashDepleted: number; // month index where cash <= 0, or -1 if never
  minRunway: number; // months
}

export interface MonthOption {
  value: string; // YYYY-MM
  label: string; // e.g. 'Oct 2025'
}

export type Action =
  | { type: 'SET_VIEW'; payload: ViewKey }
  | { type: 'SET_SCENARIO'; payload: ScenarioKey }
  | { type: 'SET_RAISE_AMOUNT'; payload: number }
  | { type: 'SET_RAISE_DATE'; payload: string }
  | { type: 'SET_ARR_MULTIPLE'; payload: number }
  | { type: 'SET_EXIT_MULTIPLE'; payload: number }
  | { type: 'SET_EXIT_YEAR'; payload: number }
  | { type: 'SET_STARTING_CASH'; payload: number }
  | { type: 'TOGGLE_REVENUE_BREAKDOWN' }
  | { type: 'TOGGLE_SEASONALITY' }
  | { type: 'TOGGLE_VARIANCE' }
  | { type: 'SET_VARIANCE_PERCENT'; payload: number }
  | { type: 'TOGGLE_DILIGENCE_MODE' }
  | { type: 'TOGGLE_ACTUALS' }
  | { type: 'UPDATE_SCENARIO'; key: ScenarioKey; updates: Partial<Scenario> };
