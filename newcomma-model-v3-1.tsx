import React, { useReducer, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from 'recharts';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const CHURN_ANNUAL_TO_MONTHLY = (annualRate) => annualRate / 12;

const distributeClients = (total, planMix) => {
  if (total === 0) return { starter: 0, growth: 0, scale: 0 };
  const keys = Object.keys(planMix);
  const result = {};
  let remaining = total;
  keys.forEach((key, index) => {
    if (index < keys.length - 1) {
      result[key] = Math.round(total * planMix[key]);
      remaining -= result[key];
    } else {
      result[key] = Math.max(0, remaining);
    }
  });
  return result;
};

// NEW: Seasonality multiplier
const getSeasonalityMultiplier = (month, enableSeasonality) => {
  if (!enableSeasonality) return 1.0;
  
  // B2B seasonality: Q4 strong, summer weak
  const seasonality = [
    0.85, // Jan - slow
    0.90, // Feb
    0.95, // Mar
    1.00, // Apr
    1.05, // May
    0.90, // Jun - summer slowdown
    0.80, // Jul - summer slowdown
    0.85, // Aug - summer slowdown
    1.00, // Sep - back to work
    1.10, // Oct - Q4 push
    1.15, // Nov - Q4 push
    1.25  // Dec - year-end deals
  ];
  
  return seasonality[month % 12];
};

// NEW: Add randomness/variance
const applyVariance = (value, variancePercent, enableVariance) => {
  if (!enableVariance) return value;
  const variance = value * (variancePercent / 100);
  const random = (Math.random() - 0.5) * 2; // -1 to 1
  return value + (variance * random);
};

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const HISTORICAL_DATA = {
  years: [
    { 
      year: 2021, 
      revenue: 409, 
      costs: 25985, 
      net: -25576, 
      funding: 0,
      salaries: 18500,
      marketing: 2800,
      tools: 3200,
      other: 1485
    },
    { 
      year: 2022, 
      revenue: 21416, 
      costs: 62450, 
      net: -41034, 
      funding: 30000,
      salaries: 42300,
      marketing: 8900,
      tools: 7250,
      other: 4000
    },
    { 
      year: 2023, 
      revenue: 16372, 
      costs: 133505, 
      net: -117133, 
      funding: 150000,
      salaries: 89400,
      marketing: 24800,
      tools: 12305,
      other: 7000
    },
    { 
      year: 2024, 
      revenue: 42508, 
      costs: 80934, 
      net: -38426, 
      funding: 0,
      salaries: 52800,
      marketing: 15234,
      tools: 9800,
      other: 3100
    },
    { 
      year: 2025, 
      revenue: 21249, 
      costs: 27733, 
      net: -6484, 
      funding: 0, 
      ytd: 10,
      salaries: 13790,
      marketing: 8943,
      tools: 3800,
      other: 1200
    }
  ],
  currentState: {
    totalUsers: 17528,
    totalFundingToDate: 264105,
    currentCash: 147.72,
    currentMonthlyBurn: 3962,
    activeProUsers: 0,
    activePlusUsers: 0,
    activeB2BClients: 0
  }
};

const CAP_TABLE = {
  sharesOutstanding: 4820332,
  optionPool: 406033,
  fullyDiluted: 5226365,
  totalInvested: 264105
};

const PRICING = {
  creative: { pro: 6, plus: 10 },
  b2b: { starter: 39, growth: 119, scale: 279 },
  marketplace: { 
    listingFee2Week: 60, 
    listingFee4Week: 100,
    platformFee: 0.125,
    commaCredits: 20
  }
};

const ARR_MULTIPLE_GUIDANCE = {
  saas: { low: 6, mid: 10, high: 15, description: "SaaS companies (recurring revenue)" },
  marketplace: { low: 2, mid: 4, high: 8, description: "Marketplace transaction revenue" },
  blended: { low: 5, mid: 8, high: 12, description: "Blended (SaaS + Marketplace)" },
  notes: "Multiples increase with: 100%+ growth, low churn, strong unit economics"
};

const COST_STRUCTURE = {
  toolsAndInfra: {
    base2025: 818,
    base2026: 1616,
    base2027: 3306,
    annualSubs: 213
  },
  outsourced: {
    base2025: 900,
    base2026: 1260,
    base2027: 1440
  },
  teamSalaries: {
    base2025: 1970,
    base2026: 15308,
    base2027: 17874,
    conservative: 1.0,
    base: 1.0,
    growth: 1.25
  },
  salesStaff: {
    salary: 2000,
    quota: 5000,
    leadsPerSalesPerson: 100
  },
  supportStaff: {
    salary: 1500,
    usersPerPerson: 2000
  },
  collectionRates: {
    recurring: 0.98,
    transaction: 0.90
  }
};

const defaultScenarios = {
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
    teamGrowthMultiplier: 1.0
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
    teamGrowthMultiplier: 1.0
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
    teamGrowthMultiplier: 1.25
  }
};

const initialState = {
  view: 'overview',
  currentDate: '2025-10-01',
  projectionMonths: 36,
  raiseAmount: 500000,
  raiseDate: '2025-11',
  arrMultiple: 8,
  selectedScenario: 'base',
  scenarios: defaultScenarios,
  exitMultiple: 12,
  exitYear: 5,
  showRunwayAlert: true,
  showRevenueBreakdown: true,
  startingCash: 147.72,
  enableSeasonality: false,
  enableVariance: false,
  variancePercent: 10,
  showActuals: false,
  actuals: {}
};

function modelReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload };
    case 'SET_RAISE_AMOUNT':
      return { ...state, raiseAmount: Math.max(0, action.payload) };
    case 'SET_RAISE_DATE':
      return { ...state, raiseDate: action.payload };
    case 'SET_ARR_MULTIPLE':
      return { ...state, arrMultiple: Math.max(0, action.payload) };
    case 'SET_EXIT_MULTIPLE':
      return { ...state, exitMultiple: Math.max(0, action.payload) };
    case 'SET_EXIT_YEAR':
      return { ...state, exitYear: Math.max(1, action.payload) };
    case 'SET_STARTING_CASH':
      return { ...state, startingCash: Math.max(0, action.payload) };
    case 'TOGGLE_REVENUE_BREAKDOWN':
      return { ...state, showRevenueBreakdown: !state.showRevenueBreakdown };
    case 'TOGGLE_SEASONALITY':
      return { ...state, enableSeasonality: !state.enableSeasonality };
    case 'TOGGLE_VARIANCE':
      return { ...state, enableVariance: !state.enableVariance };
    case 'SET_VARIANCE_PERCENT':
      return { ...state, variancePercent: Math.max(0, Math.min(100, action.payload)) };
    case 'TOGGLE_ACTUALS':
      return { ...state, showActuals: !state.showActuals };
    case 'UPDATE_SCENARIO':
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [action.key]: { ...state.scenarios[action.key], ...action.updates }
        }
      };
    default:
      return state;
  }
}

// ============================================================================
// ENHANCED PROJECTIONS FUNCTION
// ============================================================================

function calculateProjections(state, scenarioData) {
  const data = [];
  const start = new Date(state.currentDate);
  const raiseDate = new Date(state.raiseDate + '-01');
  
  const monthlyChurnRate = CHURN_ANNUAL_TO_MONTHLY(scenarioData.churnAnnual);
  const monthlyB2BChurnRate = CHURN_ANNUAL_TO_MONTHLY(scenarioData.b2bChurnAnnual);
  
  let totalUsers = HISTORICAL_DATA.currentState.totalUsers;
  let proPaid = HISTORICAL_DATA.currentState.activeProUsers || 0;
  let plusPaid = HISTORICAL_DATA.currentState.activePlusUsers || 0;
  let starterClients = 0;
  let growthClients = 0;
  let scaleClients = 0;
  
  for (let month = 0; month < state.projectionMonths; month++) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + month);
    
    // Apply seasonality to growth
    const seasonalMultiplier = getSeasonalityMultiplier(month, state.enableSeasonality);
    const effectiveGrowthRate = 1 + ((scenarioData.organicGrowthRate - 1) * seasonalMultiplier);
    
    totalUsers = Math.round(totalUsers * effectiveGrowthRate);
    
    // === CREATIVE MEMBERSHIPS ===
    const baseNewPro = totalUsers * scenarioData.proConversion * (1 / 12);
    const baseNewPlus = totalUsers * scenarioData.plusConversion * (1 / 12);
    
    const newPro = Math.round(applyVariance(baseNewPro, state.variancePercent, state.enableVariance));
    const newPlus = Math.round(applyVariance(baseNewPlus, state.variancePercent, state.enableVariance));
    
    proPaid = Math.round((proPaid * (1 - monthlyChurnRate)) + newPro);
    plusPaid = Math.round((plusPaid * (1 - monthlyChurnRate)) + newPlus);
    const creativeMRR = (proPaid * PRICING.creative.pro) + (plusPaid * PRICING.creative.plus);
    
    // === B2B SAAS ===
    const baseMonthlyLeads = scenarioData.monthlyLeads * seasonalMultiplier;
    const monthlyLeads = Math.round(applyVariance(baseMonthlyLeads, state.variancePercent, state.enableVariance));
    const demos = Math.round(monthlyLeads * scenarioData.leadToDemo);
    const newB2BClients = Math.round(demos * scenarioData.demoToPaid);
    
    const newClientsDistribution = distributeClients(newB2BClients, scenarioData.b2bPlanMix);
    const newStarter = newClientsDistribution.starter;
    const newGrowth = newClientsDistribution.growth;
    const newScale = newClientsDistribution.scale;
    
    const starterChurned = Math.round(starterClients * monthlyB2BChurnRate);
    const growthChurned = Math.round(growthClients * monthlyB2BChurnRate);
    const scaleChurned = Math.round(scaleClients * monthlyB2BChurnRate);
    
    const starterUpsold = Math.round(starterClients * scenarioData.b2bUpsellRate);
    const growthUpsold = Math.round(growthClients * scenarioData.b2bUpsellRate * 0.3);
    
    starterClients = Math.max(0, starterClients - starterChurned + newStarter - starterUpsold);
    growthClients = Math.max(0, growthClients - growthChurned + newGrowth + starterUpsold - growthUpsold);
    scaleClients = Math.max(0, scaleClients - scaleChurned + newScale + growthUpsold);
    
    const b2bMRR = (starterClients * PRICING.b2b.starter) + 
                   (growthClients * PRICING.b2b.growth) + 
                   (scaleClients * PRICING.b2b.scale);
    
    // === MARKETPLACE ===
    const monthlyListings = Math.round(totalUsers * scenarioData.listingsPerUser);
    const listingsRevenue = monthlyListings * ((PRICING.marketplace.listingFee2Week + PRICING.marketplace.listingFee4Week) / 2);
    const listingsWithResponses = Math.round(monthlyListings * scenarioData.listingToProjectRate);
    const projectsOnPlatform = Math.round(listingsWithResponses * scenarioData.marketplaceCapture);
    const platformFees = projectsOnPlatform * scenarioData.avgProjectValue * PRICING.marketplace.platformFee;
    const creditsRevenue = scenarioData.creditsPurchasesPerMonth * PRICING.marketplace.commaCredits;
    
    // === REVENUE ===
    const recurringRevenue = creativeMRR + b2bMRR;
    const transactionRevenue = listingsRevenue + platformFees + creditsRevenue;
    const totalRevenue = recurringRevenue + transactionRevenue;
    
    // === COSTS ===
    let baseTeamSalaries = scenarioData.baseTeamSalaries;
    if (month >= 12 && month < 24) {
      baseTeamSalaries = COST_STRUCTURE.teamSalaries.base2026 * scenarioData.teamGrowthMultiplier;
    } else if (month >= 24) {
      baseTeamSalaries = COST_STRUCTURE.teamSalaries.base2027 * scenarioData.teamGrowthMultiplier;
    }
    
    const requiredSalesCapacity = monthlyLeads / COST_STRUCTURE.salesStaff.leadsPerSalesPerson;
    const salesHeadcount = Math.max(0, Math.ceil(requiredSalesCapacity - 1));
    const salesSalaries = salesHeadcount * COST_STRUCTURE.salesStaff.salary;
    
    const supportHeadcount = Math.max(0, Math.floor(totalUsers / COST_STRUCTURE.supportStaff.usersPerPerson));
    const supportSalaries = supportHeadcount * COST_STRUCTURE.supportStaff.salary;
    
    const totalSalaries = baseTeamSalaries + salesSalaries + supportSalaries;
    const marketing = scenarioData.marketingBudget;
    
    const yearsElapsed = month / 12;
    let baseToolsCost = COST_STRUCTURE.toolsAndInfra.base2025;
    if (month >= 12 && month < 24) baseToolsCost = COST_STRUCTURE.toolsAndInfra.base2026;
    if (month >= 24) baseToolsCost = COST_STRUCTURE.toolsAndInfra.base2027;
    
    const toolsCost = (baseToolsCost * Math.pow(scenarioData.toolsGrowthRate, yearsElapsed)) + 
                      COST_STRUCTURE.toolsAndInfra.annualSubs;
    
    let outsourced = COST_STRUCTURE.outsourced.base2025;
    if (month >= 12 && month < 24) outsourced = COST_STRUCTURE.outsourced.base2026;
    if (month >= 24) outsourced = COST_STRUCTURE.outsourced.base2027;
    
    const events = Math.min(5000, totalRevenue * 0.05);
    const totalCosts = totalSalaries + marketing + toolsCost + outsourced + events;
    
    // === CASH FLOW ===
    const cashCollected = (recurringRevenue * COST_STRUCTURE.collectionRates.recurring) + 
                         (transactionRevenue * COST_STRUCTURE.collectionRates.transaction);
    const netCashFlow = cashCollected - totalCosts;
    const openingCash = month === 0 ? state.startingCash : data[month - 1].closingCash;
    
    const isFundingMonth = date.getFullYear() === raiseDate.getFullYear() && 
                          date.getMonth() === raiseDate.getMonth();
    const funding = isFundingMonth ? state.raiseAmount : 0;
    const closingCash = openingCash + netCashFlow + funding;
    
    // === UNIT ECONOMICS ===
    const totalNewCustomers = newB2BClients + newPro + newPlus;
    const cac = totalNewCustomers > 0 ? (marketing + salesSalaries) / totalNewCustomers : 0;
    const b2bARPU = (starterClients + growthClients + scaleClients) > 0 ? 
                    b2bMRR / (starterClients + growthClients + scaleClients) : 0;
    const b2bLTV = b2bARPU > 0 && monthlyB2BChurnRate > 0 ? b2bARPU / monthlyB2BChurnRate : 0;
    const ltvCacRatio = cac > 0 ? b2bLTV / cac : 0;
    const paybackMonths = cac > 0 && b2bARPU > 0 ? cac / b2bARPU : 0;
    
    // === RUNWAY ===
    const avgBurn = month >= 3 ? 
      (data.slice(month - 3, month).reduce((sum, m) => sum + Math.abs(Math.min(m.netCashFlow, 0)), 0) / 3) : 
      Math.abs(Math.min(netCashFlow, 0));
    const runway = avgBurn > 0 ? closingCash / avgBurn : (closingCash > 0 ? 999 : 0);
    
    data.push({
      month: month + 1,
      date: date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      totalRevenue,
      recurringRevenue,
      transactionRevenue,
      creativeMRR,
      b2bMRR,
      listingsRevenue,
      platformFees,
      creditsRevenue,
      totalCosts,
      salaries: totalSalaries,
      marketing,
      tools: toolsCost,
      outsourced,
      events,
      closingCash,
      netCashFlow,
      netIncome: totalRevenue - totalCosts,
      totalUsers,
      proPaid,
      plusPaid,
      starterClients,
      growthClients,
      scaleClients,
      totalB2BClients: starterClients + growthClients + scaleClients,
      monthlyListings,
      projectsOnPlatform,
      monthlyLeads,
      demos,
      newB2BClients,
      cac,
      b2bLTV,
      ltvCacRatio,
      paybackMonths,
      runway,
      funding,
      salesHeadcount,
      supportHeadcount,
      seasonalMultiplier,
      creativeBreakdown: {
        totalUsers,
        proConvRate: scenarioData.proConversion,
        plusConvRate: scenarioData.plusConversion,
        proPaid,
        plusPaid,
        proPrice: PRICING.creative.pro,
        plusPrice: PRICING.creative.plus,
        monthlyChurnRate,
        newProThisMonth: newPro,
        newPlusThisMonth: newPlus
      },
      b2bBreakdown: {
        monthlyLeads,
        leadToDemo: scenarioData.leadToDemo,
        demos,
        demoToPaid: scenarioData.demoToPaid,
        newClients: newB2BClients,
        starterClients,
        growthClients,
        scaleClients,
        starterPrice: PRICING.b2b.starter,
        growthPrice: PRICING.b2b.growth,
        scalePrice: PRICING.b2b.scale,
        monthlyChurnRate: monthlyB2BChurnRate,
        starterChurned,
        growthChurned,
        scaleChurned,
        starterUpsold,
        growthUpsold
      },
      marketplaceBreakdown: {
        totalUsers,
        listingsPerUser: scenarioData.listingsPerUser,
        monthlyListings,
        avgListingFee: (PRICING.marketplace.listingFee2Week + PRICING.marketplace.listingFee4Week) / 2,
        listingToProjectRate: scenarioData.listingToProjectRate,
        listingsWithResponses,
        captureRate: scenarioData.marketplaceCapture,
        projectsOnPlatform,
        avgProjectValue: scenarioData.avgProjectValue,
        platformFeeRate: PRICING.marketplace.platformFee
      },
      costBreakdown: {
        baseTeam: baseTeamSalaries,
        sales: salesSalaries,
        support: supportSalaries,
        marketing,
        tools: toolsCost,
        outsourced,
        events
      }
    });
  }
  
  return data;
}

function generateMonthOptions(startDate, months) {
  const options = [];
  const start = new Date(startDate);
  for (let i = 0; i < months; i++) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + i);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}

const NewCommaFinancialModel = () => {
  const [state, dispatch] = useReducer(modelReducer, initialState);
  
  const allProjections = useMemo(() => ({
    worst: calculateProjections(state, state.scenarios.worst),
    base: calculateProjections(state, state.scenarios.base),
    best: calculateProjections(state, state.scenarios.best)
  }), [state.raiseAmount, state.raiseDate, state.scenarios, state.startingCash, state.enableSeasonality, state.enableVariance, state.variancePercent]);
  
  const currentProjection = allProjections[state.selectedScenario];
  
  const valuationMetrics = useMemo(() => {
    const last = currentProjection[currentProjection.length - 1];
    const arr = last.recurringRevenue * 12;
    
    const preMoney = arr * state.arrMultiple;
    const postMoney = preMoney + state.raiseAmount;
    const newShares = (state.raiseAmount / postMoney) * CAP_TABLE.fullyDiluted;
    const founderDilution = ((newShares / (CAP_TABLE.fullyDiluted + newShares)) * 100);
    
    const revenueBreakdown = {
      creative: last.creativeMRR * 12,
      b2b: last.b2bMRR * 12,
      listings: last.listingsRevenue * 12,
      platform: last.platformFees * 12,
      credits: last.creditsRevenue * 12
    };
    
    return { arr, preMoney, postMoney, founderDilution, newShares, endingCash: last.closingCash, revenueBreakdown };
  }, [currentProjection, state.raiseAmount, state.arrMultiple]);
  
  const investorROI = useMemo(() => {
    const investmentAmount = state.raiseAmount;
    const equityOwned = valuationMetrics.founderDilution / 100;
    
    const currentProjectionYears = state.projectionMonths / 12;
    const totalYearsToExit = state.exitYear;
    const additionalGrowthYears = Math.max(0, totalYearsToExit - currentProjectionYears);
    
    let futureARR;
    if (totalYearsToExit <= currentProjectionYears) {
      const exitMonthIndex = Math.floor(totalYearsToExit * 12) - 1;
      futureARR = currentProjection[exitMonthIndex].recurringRevenue * 12;
    } else {
      const lastProjectionARR = valuationMetrics.arr;
      const currentScenario = state.scenarios[state.selectedScenario];
      const additionalMonths = additionalGrowthYears * 12;
      futureARR = lastProjectionARR * Math.pow(currentScenario.organicGrowthRate, additionalMonths);
    }
    
    const exitValuation = futureARR * state.exitMultiple;
    const investorPayout = exitValuation * equityOwned;
    const multipleReturn = investmentAmount > 0 ? investorPayout / investmentAmount : 0;
    
    return { futureARR, exitValuation, investorPayout, multipleReturn, equityOwned, totalYearsToExit };
  }, [valuationMetrics, state.exitMultiple, state.exitYear, state.scenarios, state.selectedScenario, state.raiseAmount, currentProjection, state.projectionMonths]);
  
  const runwayStatus = useMemo(() => {
    const cashDepleted = currentProjection.findIndex(m => m.closingCash <= 0);
    const minRunway = Math.min(...currentProjection.map(m => m.runway));
    return { cashDepleted, minRunway };
  }, [currentProjection]);
  
  const monthOptions = useMemo(() => generateMonthOptions(state.currentDate, state.projectionMonths), [state.currentDate, state.projectionMonths]);
  
  const fmt = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  const pct = (v) => `${(v * 100).toFixed(1)}%`;
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">NewComma Financial Model v3.1</h1>
          <p className="text-gray-600">✅ Enhanced: Complete revenue breakdown, seasonality, variance, editable starting cash</p>
        </div>

        {state.startingCash < 1000 && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900">Cash Position: {fmt(state.startingCash)}</h3>
                <p className="text-amber-700">Low cash by design — seed round injection needed. Plan your raise below to extend runway.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">Edit Starting Cash:</label>
                <input
                  type="number"
                  value={state.startingCash}
                  onChange={(e) => dispatch({ type: 'SET_STARTING_CASH', payload: parseFloat(e.target.value) || 0 })}
                  className="w-32 px-3 py-2 border-2 border-amber-500 rounded-lg font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {runwayStatus.cashDepleted > 0 && runwayStatus.cashDepleted < 12 && state.showRunwayAlert && (
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-900">Cash Runway Alert</h3>
                <p className="text-red-700">Cash depletes in month {runwayStatus.cashDepleted}. Minimum runway: {runwayStatus.minRunway.toFixed(1)} months.</p>
              </div>
            </div>
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'raise' })} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
              Plan Raise
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex flex-wrap gap-2">
          {['overview', 'revenue', 'expenses', 'unit-economics', 'raise', 'analysis', 'scenarios', 'settings'].map(view => (
            <button
              key={view}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
              className={`flex-1 min-w-[90px] px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                state.view === view ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {view.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Active Scenario</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(state.scenarios).map(key => (
              <button
                key={key}
                onClick={() => dispatch({ type: 'SET_SCENARIO', payload: key })}
                className={`px-4 py-3 rounded-lg font-medium border-2 ${
                  state.selectedScenario === key
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-yellow-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {state.scenarios[key].name}
              </button>
            ))}
          </div>
        </div>

        {state.view === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Year 3 ARR</div>
                <div className="text-2xl font-bold text-blue-700">{fmt(valuationMetrics.arr)}</div>
                <div className="text-xs text-gray-500 mt-1">Recurring revenue</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Starting Cash</div>
                <div className="text-2xl font-bold text-green-700">{fmt(state.startingCash)}</div>
                <div className="text-xs text-gray-500 mt-1">15 Oct 2025 (editable)</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">LTV:CAC</div>
                <div className="text-2xl font-bold text-purple-700">{currentProjection[11]?.ltvCacRatio.toFixed(1)}x</div>
                <div className="text-xs text-gray-500 mt-1">Month 12 avg</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Runway</div>
                <div className="text-2xl font-bold text-orange-700">{runwayStatus.minRunway.toFixed(0)}mo</div>
                <div className="text-xs text-gray-500 mt-1">Minimum</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Revenue Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={currentProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend />
                    <Area type="monotone" dataKey="recurringRevenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Recurring" />
                    <Area type="monotone" dataKey="transactionRevenue" stackId="1" stroke="#10b981" fill="#10b981" name="Transaction" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Cash Runway</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={currentProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                    <YAxis yAxisId="left" style={{ fontSize: '11px' }} />
                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="closingCash" fill="#10b981" name="Cash Balance" />
                    <Line yAxisId="right" type="monotone" dataKey="runway" stroke="#ef4444" strokeWidth={2} name="Runway (months)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {state.enableSeasonality && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">🌊 Seasonality Enabled</h3>
                <p className="text-sm text-blue-800">Revenue shows realistic seasonal patterns: Q4 strong (Nov-Dec), summer slow (Jun-Aug)</p>
              </div>
            )}
          </div>
        )}

        {state.view === 'revenue' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Revenue Analysis</h2>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_REVENUE_BREAKDOWN' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                {state.showRevenueBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">Revenue Streams Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={currentProjection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                  <YAxis style={{ fontSize: '11px' }} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="b2bMRR" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="B2B SaaS" />
                  <Area type="monotone" dataKey="creativeMRR" stackId="1" stroke="#10b981" fill="#10b981" name="Creative Memberships" />
                  <Area type="monotone" dataKey="platformFees" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Platform Fees" />
                  <Area type="monotone" dataKey="listingsRevenue" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Listing Fees" />
                  <Area type="monotone" dataKey="creditsRevenue" stackId="1" stroke="#ef4444" fill="#ef4444" name="Credits" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {state.showRevenueBreakdown && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                  📊 Complete Revenue Breakdown: How We Get to {fmt(currentProjection[35]?.totalRevenue)}/mo
                </h3>
                <p className="text-gray-700 mb-6">
                  Our revenue model has three distinct engines. Here's the complete mathematical breakdown of how each revenue stream works:
                </p>
                
                <div className="space-y-8">
                  {/* CREATIVE MEMBERSHIPS - DETAILED */}
                  <div className="bg-white rounded-lg p-6 border-2 border-green-300">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl">💳</span>
                      <h4 className="font-bold text-green-900 text-xl">1. Creative Memberships</h4>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <div className="text-sm font-semibold text-green-900 mb-2">Month 36 Result:</div>
                      <div className="text-3xl font-bold text-green-700">{fmt(currentProjection[35]?.creativeMRR)}/month</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {currentProjection[35]?.proPaid} Pro members + {currentProjection[35]?.plusPaid} Plus members
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 1: User Base Growth</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Starting users (Oct 2025):</span>
                            <span className="font-mono font-bold">{HISTORICAL_DATA.currentState.totalUsers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly growth rate:</span>
                            <span className="font-mono font-bold">{((state.scenarios[state.selectedScenario].organicGrowthRate - 1) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">users × 1.03 each month</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Month 36 user base:</span>
                            <span className="font-mono font-bold text-green-700">{currentProjection[35]?.totalUsers.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 2: Pro Tier Conversions</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual conversion rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].proConversion)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly conversion:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].proConversion / 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">{currentProjection[35]?.totalUsers.toLocaleString()} × {(state.scenarios[state.selectedScenario].proConversion / 12 * 100).toFixed(2)}% = {Math.round(currentProjection[35]?.totalUsers * state.scenarios[state.selectedScenario].proConversion / 12)} new/mo</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Active Pro members:</span>
                            <span className="font-mono font-bold text-green-700">{currentProjection[35]?.proPaid}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 3: Plus Tier Conversions</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual conversion rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].plusConversion)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly conversion:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].plusConversion / 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">{currentProjection[35]?.totalUsers.toLocaleString()} × {(state.scenarios[state.selectedScenario].plusConversion / 12 * 100).toFixed(2)}% = {Math.round(currentProjection[35]?.totalUsers * state.scenarios[state.selectedScenario].plusConversion / 12)} new/mo</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Active Plus members:</span>
                            <span className="font-mono font-bold text-green-700">{currentProjection[35]?.plusPaid}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 4: Churn Impact</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual churn rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].churnAnnual)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly churn rate:</span>
                            <span className="font-mono font-bold">{pct(CHURN_ANNUAL_TO_MONTHLY(state.scenarios[state.selectedScenario].churnAnnual))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">retained = previous × (1 - {(CHURN_ANNUAL_TO_MONTHLY(state.scenarios[state.selectedScenario].churnAnnual) * 100).toFixed(2)}%)</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Net monthly change:</span>
                            <span className="font-mono font-bold text-green-700">+{currentProjection[35]?.creativeBreakdown.newProThisMonth + currentProjection[35]?.creativeBreakdown.newPlusThisMonth} members</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 5: Revenue Calculation</h5>
                        <div className="bg-green-100 p-4 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Pro Revenue:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.proPaid} × £{PRICING.creative.pro} = {fmt(currentProjection[35]?.proPaid * PRICING.creative.pro)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Plus Revenue:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.plusPaid} × £{PRICING.creative.plus} = {fmt(currentProjection[35]?.plusPaid * PRICING.creative.plus)}</span>
                          </div>
                          <div className="flex justify-between border-t-2 border-green-400 pt-2 mt-2">
                            <span className="text-gray-900 font-bold">Total Creative MRR:</span>
                            <span className="font-mono font-bold text-green-700 text-lg">{fmt(currentProjection[35]?.creativeMRR)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B2B SAAS - DETAILED */}
                  <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl">🏢</span>
                      <h4 className="font-bold text-blue-900 text-xl">2. B2B SaaS (Detailed Funnel)</h4>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="text-sm font-semibold text-blue-900 mb-2">Month 36 Result:</div>
                      <div className="text-3xl font-bold text-blue-700">{fmt(currentProjection[35]?.b2bMRR)}/month</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {currentProjection[35]?.totalB2BClients} total clients across 3 tiers
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 1: Marketing Investment → Leads</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly marketing spend:</span>
                            <span className="font-mono font-bold">{fmt(state.scenarios[state.selectedScenario].marketingBudget)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Target monthly leads:</span>
                            <span className="font-mono font-bold">{state.scenarios[state.selectedScenario].monthlyLeads}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per lead:</span>
                            <span className="font-mono font-bold">{fmt(state.scenarios[state.selectedScenario].marketingBudget / state.scenarios[state.selectedScenario].monthlyLeads)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Channels:</span>
                            <span className="text-xs">LinkedIn Ads, Meta Ads, Content, Events</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 2: Leads → Demos</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly leads:</span>
                            <span className="font-mono font-bold">{state.scenarios[state.selectedScenario].monthlyLeads}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Demo booking rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].leadToDemo)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">{state.scenarios[state.selectedScenario].monthlyLeads} × {pct(state.scenarios[state.selectedScenario].leadToDemo)} = {Math.round(state.scenarios[state.selectedScenario].monthlyLeads * state.scenarios[state.selectedScenario].leadToDemo)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Monthly demos:</span>
                            <span className="font-mono font-bold text-blue-700">{currentProjection[35]?.demos}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 3: Demos → Paid Clients</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly demos:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.demos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Close rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].demoToPaid)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overall conversion:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].b2bLeadConversion)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">New clients/month:</span>
                            <span className="font-mono font-bold text-blue-700">{currentProjection[35]?.newB2BClients}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 4: Plan Distribution</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="text-xs text-gray-600 mb-2">New clients are distributed across tiers:</div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Starter ({pct(state.scenarios[state.selectedScenario].b2bPlanMix.starter)}):</span>
                            <span className="font-mono font-bold">{Math.round(currentProjection[35]?.newB2BClients * state.scenarios[state.selectedScenario].b2bPlanMix.starter)} clients</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Growth ({pct(state.scenarios[state.selectedScenario].b2bPlanMix.growth)}):</span>
                            <span className="font-mono font-bold">{Math.round(currentProjection[35]?.newB2BClients * state.scenarios[state.selectedScenario].b2bPlanMix.growth)} clients</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scale ({pct(state.scenarios[state.selectedScenario].b2bPlanMix.scale)}):</span>
                            <span className="font-mono font-bold">{Math.round(currentProjection[35]?.newB2BClients * state.scenarios[state.selectedScenario].b2bPlanMix.scale)} clients</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 5: Churn & Upsells</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly churn rate:</span>
                            <span className="font-mono font-bold">{pct(CHURN_ANNUAL_TO_MONTHLY(state.scenarios[state.selectedScenario].b2bChurnAnnual))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly upsell rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].b2bUpsellRate)}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            Each month: Some clients churn, some upgrade tiers
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Step 6: Revenue Calculation</h5>
                        <div className="bg-blue-100 p-4 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Starter Revenue:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.starterClients} × £{PRICING.b2b.starter} = {fmt(currentProjection[35]?.starterClients * PRICING.b2b.starter)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Growth Revenue:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.growthClients} × £{PRICING.b2b.growth} = {fmt(currentProjection[35]?.growthClients * PRICING.b2b.growth)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Scale Revenue:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.scaleClients} × £{PRICING.b2b.scale} = {fmt(currentProjection[35]?.scaleClients * PRICING.b2b.scale)}</span>
                          </div>
                          <div className="flex justify-between border-t-2 border-blue-400 pt-2 mt-2">
                            <span className="text-gray-900 font-bold">Total B2B MRR:</span>
                            <span className="font-mono font-bold text-blue-700 text-lg">{fmt(currentProjection[35]?.b2bMRR)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MARKETPLACE - DETAILED */}
                  <div className="bg-white rounded-lg p-6 border-2 border-orange-300">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl">🛍️</span>
                      <h4 className="font-bold text-orange-900 text-xl">3. Marketplace (Three Revenue Streams)</h4>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <div className="text-sm font-semibold text-orange-900 mb-2">Month 36 Result:</div>
                      <div className="text-3xl font-bold text-orange-700">
                        {fmt(currentProjection[35]?.listingsRevenue + currentProjection[35]?.platformFees + currentProjection[35]?.creditsRevenue)}/month
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Listing fees + Platform fees + Comma Credits
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Stream 1: Listing Fees</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total users:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.totalUsers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly listing rate:</span>
                            <span className="font-mono font-bold">{pct(state.scenarios[state.selectedScenario].listingsPerUser)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">{currentProjection[35]?.totalUsers.toLocaleString()} × {pct(state.scenarios[state.selectedScenario].listingsPerUser)} = {currentProjection[35]?.monthlyListings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average fee:</span>
                            <span className="font-mono font-bold">£{((PRICING.marketplace.listingFee2Week + PRICING.marketplace.listingFee4Week) / 2).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Listing fee revenue:</span>
                            <span className="font-mono font-bold text-orange-700">{fmt(currentProjection[35]?.listingsRevenue)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Stream 2: Platform Fees (12.5%)</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="text-xs text-gray-600 mb-2">Multi-step conversion funnel:</div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">1. Listings posted:</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.monthlyListings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">2. Get responses ({pct(state.scenarios[state.selectedScenario].listingToProjectRate)}):</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.marketplaceBreakdown.listingsWithResponses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">3. Transact on-platform ({pct(state.scenarios[state.selectedScenario].marketplaceCapture)}):</span>
                            <span className="font-mono font-bold">{currentProjection[35]?.projectsOnPlatform}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average project value:</span>
                            <span className="font-mono font-bold">{fmt(state.scenarios[state.selectedScenario].avgProjectValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Platform fee rate:</span>
                            <span className="font-mono font-bold">12.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">{currentProjection[35]?.projectsOnPlatform} × £{state.scenarios[state.selectedScenario].avgProjectValue.toLocaleString()} × 12.5%</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Platform fee revenue:</span>
                            <span className="font-mono font-bold text-orange-700">{fmt(currentProjection[35]?.platformFees)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Stream 3: Comma Credits</h5>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly purchases:</span>
                            <span className="font-mono font-bold">{state.scenarios[state.selectedScenario].creditsPurchasesPerMonth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price per pack:</span>
                            <span className="font-mono font-bold">£{PRICING.marketplace.commaCredits}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Formula:</span>
                            <span className="font-mono text-xs">{state.scenarios[state.selectedScenario].creditsPurchasesPerMonth} × £{PRICING.marketplace.commaCredits}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700 font-semibold">Credits revenue:</span>
                            <span className="font-mono font-bold text-orange-700">{fmt(currentProjection[35]?.creditsRevenue)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Total Marketplace Revenue</h5>
                        <div className="bg-orange-100 p-4 rounded text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Listing Fees:</span>
                            <span className="font-mono font-bold">{fmt(currentProjection[35]?.listingsRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Platform Fees (12.5%):</span>
                            <span className="font-mono font-bold">{fmt(currentProjection[35]?.platformFees)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Comma Credits:</span>
                            <span className="font-mono font-bold">{fmt(currentProjection[35]?.creditsRevenue)}</span>
                          </div>
                          <div className="flex justify-between border-t-2 border-orange-400 pt-2 mt-2">
                            <span className="text-gray-900 font-bold">Total Marketplace:</span>
                            <span className="font-mono font-bold text-orange-700 text-lg">
                              {fmt(currentProjection[35]?.listingsRevenue + currentProjection[35]?.platformFees + currentProjection[35]?.creditsRevenue)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL REVENUE SUMMARY */}
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-400 rounded-xl p-6">
                    <h4 className="font-bold text-purple-900 text-xl mb-4">📊 Total Revenue Summary (Month 36)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-semibold">Creative Memberships:</span>
                        <span className="font-mono font-bold text-green-700">{fmt(currentProjection[35]?.creativeMRR)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-semibold">B2B SaaS:</span>
                        <span className="font-mono font-bold text-blue-700">{fmt(currentProjection[35]?.b2bMRR)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-semibold">Marketplace:</span>
                        <span className="font-mono font-bold text-orange-700">
                          {fmt(currentProjection[35]?.listingsRevenue + currentProjection[35]?.platformFees + currentProjection[35]?.creditsRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-purple-200 p-4 rounded-lg border-2 border-purple-400">
                        <span className="font-bold text-lg">TOTAL MONTHLY REVENUE:</span>
                        <span className="font-mono font-bold text-purple-900 text-2xl">{fmt(currentProjection[35]?.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-purple-300 p-4 rounded-lg border-2 border-purple-500">
                        <span className="font-bold text-lg">ANNUAL RUN RATE:</span>
                        <span className="font-mono font-bold text-purple-900 text-2xl">{fmt(currentProjection[35]?.totalRevenue * 12)}</span>
                      </div>
                    </div>
                  </div>

                  {/* KEY ASSUMPTIONS */}
                  <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 text-xl mb-4">🎯 Key Assumptions ({state.scenarios[state.selectedScenario].name})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-600">User Growth</div>
                        <div className="font-bold text-lg">{((state.scenarios[state.selectedScenario].organicGrowthRate - 1) * 100).toFixed(1)}% MoM</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-600">B2B Conversion</div>
                        <div className="font-bold text-lg">{pct(state.scenarios[state.selectedScenario].b2bLeadConversion)}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-600">Creative Churn</div>
                        <div className="font-bold text-lg">{pct(state.scenarios[state.selectedScenario].churnAnnual)} annual</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-600">B2B Churn</div>
                        <div className="font-bold text-lg">{pct(state.scenarios[state.selectedScenario].b2bChurnAnnual)} annual</div>
                      </div>
                    </div>
                  </div>

                  {/* RISK FACTORS */}
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
                    <h4 className="font-bold text-amber-900 text-xl mb-4">⚠️ Risk Factors & Mitigations</h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-amber-300">
                        <div className="font-semibold text-amber-900 mb-2">Revenue Risk: Conversion Rates Lower Than Expected</div>
                        <div className="text-sm text-gray-700 mb-2">
                          If B2B conversion drops to 2% (vs 3.75% modeled), monthly revenue would be ~{fmt(currentProjection[11]?.b2bMRR * 0.53)}/mo instead of {fmt(currentProjection[11]?.b2bMRR)}/mo
                        </div>
                        <div className="text-sm font-semibold text-gray-900">Mitigation:</div>
                        <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
                          <li>Currently testing messaging with 50+ leads/month</li>
                          <li>Have Conservative scenario at 2% for downside planning</li>
                          <li>Can pivot to founder-led sales if needed</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-amber-300">
                        <div className="font-semibold text-amber-900 mb-2">Churn Risk: Retention Worse Than Modeled</div>
                        <div className="text-sm text-gray-700 mb-2">
                          If churn reaches 25% annual (vs 15% modeled), LTV drops from £{currentProjection[11]?.b2bLTV.toFixed(0)} to £{(currentProjection[11]?.b2bLTV * 0.6).toFixed(0)}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">Mitigation:</div>
                        <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
                          <li>Quarterly customer success check-ins</li>
                          <li>Upsell path keeps customers engaged</li>
                          <li>Product stickiness through team building features</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-amber-300">
                        <div className="font-semibold text-amber-900 mb-2">Market Risk: Seasonality Impact</div>
                        <div className="text-sm text-gray-700 mb-2">
                          B2B buying freezes in summer (Jun-Aug) and over holidays. Could see 20-30% drop in those months.
                        </div>
                        <div className="text-sm font-semibold text-gray-900">Mitigation:</div>
                        <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
                          <li>Enable seasonality toggle to model this (see Settings tab)</li>
                          <li>Plan Q4 push to offset summer slowdown</li>
                          <li>Maintain 6mo+ runway buffer</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-amber-300">
                        <div className="font-semibold text-amber-900 mb-2">Execution Risk: Marketplace Liquidity</div>
                        <div className="text-sm text-gray-700 mb-2">
                          Two-sided marketplace requires critical mass. If listing→project rate drops to 30% (vs 50%), marketplace revenue drops 40%.
                        </div>
                        <div className="text-sm font-semibold text-gray-900">Mitigation:</div>
                        <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
                          <li>Start with 17.5k creatives (supply advantage)</li>
                          <li>B2B clients bring demand side</li>
                          <li>Phygital events create offline liquidity</li>
                          <li>Marketplace is 30% of revenue, not make-or-break</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* WHAT COULD GO WRONG / RIGHT */}
                  <div className="bg-gradient-to-r from-red-50 to-green-50 border-2 border-gray-400 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 text-xl mb-4">🎭 What Could Go Wrong vs Right</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-red-900 mb-3">😰 Downside Scenarios</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="bg-white p-3 rounded border-l-4 border-red-500">
                            <strong>Marketing doesn't scale:</strong> CPL rises to £40+ (vs £16), cutting leads by 60%
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-red-500">
                            <strong>Churn spikes:</strong> Annual churn hits 30%, destroying unit economics
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-red-500">
                            <strong>Competitive pressure:</strong> Well-funded competitor enters, forces price cuts
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-red-500">
                            <strong>Team challenges:</strong> Key engineering hire quits, delays features 6 months
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-red-500">
                            <strong>Economic downturn:</strong> B2B budgets freeze, elongating sales cycle
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-900 mb-3">🚀 Upside Scenarios</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="bg-white p-3 rounded border-l-4 border-green-500">
                            <strong>Viral growth:</strong> User growth hits 7% MoM (vs 3%), doubling timeline
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-green-500">
                            <strong>Enterprise traction:</strong> Land 3 Fortune 500 clients at £5k+/mo each
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-green-500">
                            <strong>Marketplace breaks out:</strong> Network effects kick in, capture rate hits 80%
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-green-500">
                            <strong>Product-led growth:</strong> Self-serve Starter tier drives 3x more leads
                          </li>
                          <li className="bg-white p-3 rounded border-l-4 border-green-500">
                            <strong>Strategic partnership:</strong> Adobe/Figma integration drives 10k+ users/month
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {state.view === 'expenses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">Cost Structure Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentProjection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                  <YAxis style={{ fontSize: '11px' }} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="salaries" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Salaries" />
                  <Area type="monotone" dataKey="marketing" stackId="1" stroke="#10b981" fill="#10b981" name="Marketing" />
                  <Area type="monotone" dataKey="tools" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Tools" />
                  <Area type="monotone" dataKey="outsourced" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Outsourced" />
                  <Area type="monotone" dataKey="events" stackId="1" stroke="#ec4899" fill="#ec4899" name="Events" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-4 text-xl">💡 Scenario Cost Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['worst', 'base', 'best'].map(key => {
                  const scenario = state.scenarios[key];
                  const projection = allProjections[key];
                  return (
                    <div key={key} className="bg-white rounded-lg p-4 border-2 border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">{scenario.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>Marketing:</span>
                          <span className="font-bold">{fmt(scenario.marketingBudget)}/mo</span>
                        </div>
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>Leads:</span>
                          <span className="font-bold">{scenario.monthlyLeads}/mo</span>
                        </div>
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>Sales Team:</span>
                          <span className="font-bold">{projection[11]?.salesHeadcount} people</span>
                        </div>
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>Tools Growth:</span>
                          <span className="font-bold">{((scenario.toolsGrowthRate - 1) * 100).toFixed(0)}% annual</span>
                        </div>
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>Team Multiplier:</span>
                          <span className="font-bold">{scenario.teamGrowthMultiplier}x</span>
                        </div>
                        <div className="flex justify-between p-3 bg-blue-600 text-white rounded-lg font-bold mt-2">
                          <span>Month 12 Costs:</span>
                          <span>{fmt(projection[11]?.totalCosts)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historical Cost Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">📜 Historical Cost Analysis</h3>
              <p className="text-gray-600 mb-4 text-sm">Understanding our actual spend patterns informs future projections</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-3">Year</th>
                      <th className="text-right py-2 px-3">Salaries</th>
                      <th className="text-right py-2 px-3">Marketing</th>
                      <th className="text-right py-2 px-3">Tools</th>
                      <th className="text-right py-2 px-3">Other</th>
                      <th className="text-right py-2 px-3 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HISTORICAL_DATA.years.map(year => (
                      <tr key={year.year} className="border-b border-gray-200">
                        <td className="py-2 px-3 font-medium">{year.year}</td>
                        <td className="text-right py-2 px-3">{fmt(year.salaries)}</td>
                        <td className="text-right py-2 px-3">{fmt(year.marketing)}</td>
                        <td className="text-right py-2 px-3">{fmt(year.tools)}</td>
                        <td className="text-right py-2 px-3">{fmt(year.other)}</td>
                        <td className="text-right py-2 px-3 font-bold">{fmt(year.costs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                <strong>Key Insight:</strong> Salaries consistently 50-70% of total costs. Marketing efficiency improved from 2023 (high burn) to 2024. Tools costs growing at ~10% annually.
              </div>
            </div>
          </div>
        )}

        {state.view === 'unit-economics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Blended CAC</div>
                <div className="text-2xl font-bold text-blue-700">{fmt(currentProjection[11]?.cac || 0)}</div>
                <div className="text-xs text-gray-500 mt-1">Customer acquisition cost</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">B2B LTV</div>
                <div className="text-2xl font-bold text-green-700">{fmt(currentProjection[11]?.b2bLTV || 0)}</div>
                <div className="text-xs text-gray-500 mt-1">Lifetime value</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">LTV:CAC Ratio</div>
                <div className="text-2xl font-bold text-purple-700">{currentProjection[11]?.ltvCacRatio.toFixed(1)}x</div>
                <div className="text-xs text-gray-500 mt-1">Target: >3x ✅</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">CAC Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={currentProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Line type="monotone" dataKey="cac" stroke="#3b82f6" strokeWidth={2} name="CAC" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Payback Period</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={currentProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="paybackMonths" stroke="#10b981" strokeWidth={2} name="Payback (months)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-4 text-xl">📊 Healthy SaaS Benchmarks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 mb-2">LTV:CAC Ratio</div>
                  <div className="text-2xl font-bold text-green-700">{currentProjection[11]?.ltvCacRatio.toFixed(1)}x</div>
                  <div className="text-xs text-gray-600 mt-2">Target: 3-5x ✅</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 mb-2">CAC Payback</div>
                  <div className="text-2xl font-bold text-green-700">{currentProjection[11]?.paybackMonths.toFixed(0)}mo</div>
                  <div className="text-xs text-gray-600 mt-2">Target: &lt;18mo ✅</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 mb-2">Annual Churn</div>
                  <div className="text-2xl font-bold text-green-700">{(state.scenarios[state.selectedScenario].b2bChurnAnnual * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-600 mt-2">Target: &lt;20% ✅</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.view === 'raise' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-green-900 mb-6">💰 Fundraising Calculator</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">Raise Amount (£)</label>
                  <input
                    type="number"
                    value={state.raiseAmount}
                    onChange={(e) => dispatch({ type: 'SET_RAISE_AMOUNT', payload: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">Raise Date</label>
                  <select
                    value={state.raiseDate}
                    onChange={(e) => dispatch({ type: 'SET_RAISE_DATE', payload: e.target.value })}
                    className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg"
                  >
                    {monthOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">ARR Multiple</label>
                  <input
                    type="number"
                    step="0.5"
                    value={state.arrMultiple}
                    onChange={(e) => dispatch({ type: 'SET_ARR_MULTIPLE', payload: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-900 mb-2">📚 ARR Multiple Guidance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-gray-900">{ARR_MULTIPLE_GUIDANCE.saas.description}</div>
                    <div className="text-gray-600 mt-1">{ARR_MULTIPLE_GUIDANCE.saas.low}x - {ARR_MULTIPLE_GUIDANCE.saas.high}x (typically {ARR_MULTIPLE_GUIDANCE.saas.mid}x)</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-gray-900">{ARR_MULTIPLE_GUIDANCE.marketplace.description}</div>
                    <div className="text-gray-600 mt-1">{ARR_MULTIPLE_GUIDANCE.marketplace.low}x - {ARR_MULTIPLE_GUIDANCE.marketplace.high}x (typically {ARR_MULTIPLE_GUIDANCE.marketplace.mid}x)</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-gray-900">{ARR_MULTIPLE_GUIDANCE.blended.description}</div>
                    <div className="text-gray-600 mt-1">{ARR_MULTIPLE_GUIDANCE.blended.low}x - {ARR_MULTIPLE_GUIDANCE.blended.high}x (typically {ARR_MULTIPLE_GUIDANCE.blended.mid}x)</div>
                  </div>
                </div>
                <p className="text-xs text-amber-800 mt-3">{ARR_MULTIPLE_GUIDANCE.notes}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border-2 border-green-200">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Pre-Money</div>
                  <div className="text-2xl font-bold text-green-700">{fmt(valuationMetrics.preMoney)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Post-Money</div>
                  <div className="text-2xl font-bold text-green-700">{fmt(valuationMetrics.postMoney)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">New Shares</div>
                  <div className="text-2xl font-bold text-blue-700">{Math.round(valuationMetrics.newShares).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Dilution</div>
                  <div className="text-2xl font-bold text-orange-700">{valuationMetrics.founderDilution.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 mb-4 text-xl">📈 Investor ROI Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">Exit Multiple (ARR × ?)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={state.exitMultiple}
                    onChange={(e) => dispatch({ type: 'SET_EXIT_MULTIPLE', payload: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 text-xl font-bold border-2 border-purple-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">Exit Year (from today)</label>
                  <input
                    type="number"
                    value={state.exitYear}
                    onChange={(e) => dispatch({ type: 'SET_EXIT_YEAR', payload: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 text-xl font-bold border-2 border-purple-300 rounded-lg"
                  />
                  <p className="text-xs text-purple-700 mt-1">Years from October 2025</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Exit Year</div>
                  <div className="text-xl font-bold text-purple-700">{investorROI.totalYearsToExit}y</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">ARR at Exit</div>
                  <div className="text-xl font-bold text-purple-700">{fmt(investorROI.futureARR)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Exit Valuation</div>
                  <div className="text-xl font-bold text-purple-700">{fmt(investorROI.exitValuation)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Investor Payout</div>
                  <div className="text-xl font-bold text-green-700">{fmt(investorROI.investorPayout)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Return</div>
                  <div className="text-3xl font-bold text-green-700">{investorROI.multipleReturn.toFixed(1)}x</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-100 rounded-lg text-sm">
                <strong>Calculation:</strong> Projects ARR growth from end of 3-year projection ({fmt(valuationMetrics.arr)}) 
                to year {investorROI.totalYearsToExit} at {((state.scenarios[state.selectedScenario].organicGrowthRate - 1) * 100).toFixed(1)}% MoM growth.
              </div>
            </div>
          </div>
        )}

        {state.view === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">📊 Scenario Analysis</h2>
              <p className="text-gray-700 mb-6">Compare all three scenarios side-by-side to understand range of outcomes</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-indigo-300">
                      <th className="text-left py-3 px-4">Metric</th>
                      <th className="text-right py-3 px-4 text-red-700">Conservative</th>
                      <th className="text-right py-3 px-4 text-blue-700">Base Case</th>
                      <th className="text-right py-3 px-4 text-green-700">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="py-2 px-4 font-medium" colSpan={4}>Year 3 Results</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">Total ARR</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.worst[35].totalRevenue * 12)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.base[35].totalRevenue * 12)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.best[35].totalRevenue * 12)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">Total Users</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.worst[35].totalUsers.toLocaleString()}</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.base[35].totalUsers.toLocaleString()}</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.best[35].totalUsers.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">B2B Clients</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.worst[35].totalB2BClients}</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.base[35].totalB2BClients}</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.best[35].totalB2BClients}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">Ending Cash</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.worst[35].closingCash)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.base[35].closingCash)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.best[35].closingCash)}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="py-2 px-4 font-medium" colSpan={4}>Month 12 Unit Economics</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">LTV:CAC</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.worst[11].ltvCacRatio.toFixed(1)}x</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.base[11].ltvCacRatio.toFixed(1)}x</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.best[11].ltvCacRatio.toFixed(1)}x</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">CAC Payback</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.worst[11].paybackMonths.toFixed(0)}mo</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.base[11].paybackMonths.toFixed(0)}mo</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.best[11].paybackMonths.toFixed(0)}mo</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="py-2 px-4 font-medium" colSpan={4}>Cost Structure (Month 12)</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">Marketing</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(state.scenarios.worst.marketingBudget)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(state.scenarios.base.marketingBudget)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(state.scenarios.best.marketingBudget)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">Sales Headcount</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.worst[11].salesHeadcount}</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.base[11].salesHeadcount}</td>
                      <td className="text-right py-2 px-4 font-mono">{allProjections.best[11].salesHeadcount}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4">Total Costs</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.worst[11].totalCosts)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.base[11].totalCosts)}</td>
                      <td className="text-right py-2 px-4 font-mono">{fmt(allProjections.best[11].totalCosts)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">📈 Scenario Comparison Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                  <YAxis style={{ fontSize: '11px' }} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Legend />
                  <Line data={allProjections.worst} type="monotone" dataKey="totalRevenue" stroke="#ef4444" strokeWidth={2} name="Conservative" />
                  <Line data={allProjections.base} type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={2} name="Base Case" />
                  <Line data={allProjections.best} type="monotone" dataKey="totalRevenue" stroke="#10b981" strokeWidth={2} name="Growth" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {state.enableSeasonality && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">🌊 Seasonality Impact</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={currentProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                    <YAxis yAxisId="left" style={{ fontSize: '11px' }} />
                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                    <Line yAxisId="right" type="monotone" dataKey="seasonalMultiplier" stroke="#f59e0b" strokeWidth={2} name="Seasonal Multiplier" />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-3">
                  Seasonality adds realistic fluctuations: Q4 boost (Nov-Dec), summer slowdown (Jun-Aug)
                </p>
              </div>
            )}
          </div>
        )}

        {state.view === 'scenarios' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-xl">Edit Scenario Assumptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.keys(state.scenarios).map(key => {
                const s = state.scenarios[key];
                return (
                  <div key={key} className="border-2 border-gray-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">{s.name}</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="block text-xs font-medium mb-1">Monthly Leads</label>
                        <input
                          type="number"
                          value={s.monthlyLeads}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_SCENARIO',
                            key,
                            updates: { monthlyLeads: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Lead → Demo (%)</label>
                        <input
                          type="number"
                          value={(s.leadToDemo * 100).toFixed(0)}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_SCENARIO',
                            key,
                            updates: { leadToDemo: parseFloat(e.target.value) / 100 }
                          })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Demo → Paid (%)</label>
                        <input
                          type="number"
                          value={(s.demoToPaid * 100).toFixed(0)}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_SCENARIO',
                            key,
                            updates: { demoToPaid: parseFloat(e.target.value) / 100 }
                          })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Marketing Budget (£)</label>
                        <input
                          type="number"
                          value={s.marketingBudget}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_SCENARIO',
                            key,
                            updates: { marketingBudget: parseFloat(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {state.view === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">⚙️ Model Settings</h3>
              
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Starting Cash Position</h4>
                      <p className="text-sm text-gray-600">Set your actual current cash balance</p>
                    </div>
                    <div className="w-48">
                      <input
                        type="number"
                        value={state.startingCash}
                        onChange={(e) => dispatch({ type: 'SET_STARTING_CASH', payload: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Enable Seasonality</h4>
                      <p className="text-sm text-gray-600">Add realistic seasonal patterns to growth (Q4 strong, summer weak)</p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_SEASONALITY' })}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        state.enableSeasonality 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {state.enableSeasonality ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {state.enableSeasonality && (
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <strong>Active:</strong> Revenue multipliers: Jan 85%, Jun-Aug 80-90%, Nov-Dec 115-125%
                    </div>
                  )}
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Enable Variance/Randomness</h4>
                      <p className="text-sm text-gray-600">Add realistic month-to-month variability</p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_VARIANCE' })}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        state.enableVariance 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {state.enableVariance ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {state.enableVariance && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-2">Variance Amount (%)</label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={state.variancePercent}
                        onChange={(e) => dispatch({ type: 'SET_VARIANCE_PERCENT', payload: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Current: ±{state.variancePercent}% random variance each month
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">💡 About These Settings</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Starting Cash:</strong> Update this to match your actual bank balance for accurate runway calculations</li>
                    <li><strong>Seasonality:</strong> Models real-world patterns like Q4 enterprise budget spending and summer slowdowns</li>
                    <li><strong>Variance:</strong> Adds realistic month-to-month fluctuation - no business grows perfectly linearly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCommaFinancialModel;