import { ProjectionMonth, ModelState, Scenario } from './types';
import { PRICING, HISTORICAL_DATA, COST_STRUCTURE } from './constants';
import { CHURN_ANNUAL_TO_MONTHLY, distributeClients, getSeasonalityMultiplier, applyVariance } from './helpers';

export function calculateProjections(state: ModelState, scenarioData: Scenario): ProjectionMonth[] {
  const data: ProjectionMonth[] = [];
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

    const seasonalMultiplier = getSeasonalityMultiplier(month, state.enableSeasonality);
    const effectiveGrowthRate = 1 + ((scenarioData.organicGrowthRate - 1) * seasonalMultiplier);
    totalUsers = Math.round(totalUsers * effectiveGrowthRate);

    // Creative memberships
    const baseNewPro = totalUsers * scenarioData.proConversion * (1 / 12);
    const baseNewPlus = totalUsers * scenarioData.plusConversion * (1 / 12);

    const varianceSeed = `${state.selectedScenario}-memberships`;
    const newPro = Math.round(applyVariance(baseNewPro, state.variancePercent, state.enableVariance, varianceSeed, month * 2 + 0, state.diligenceMode));
    const newPlus = Math.round(applyVariance(baseNewPlus, state.variancePercent, state.enableVariance, varianceSeed, month * 2 + 1, state.diligenceMode));

    proPaid = Math.round((proPaid * (1 - monthlyChurnRate)) + newPro);
    plusPaid = Math.round((plusPaid * (1 - monthlyChurnRate)) + newPlus);
    const creativeMRR = (proPaid * PRICING.creative.pro) + (plusPaid * PRICING.creative.plus);

    // B2B SaaS
    const baseMonthlyLeads = scenarioData.monthlyLeads * seasonalMultiplier;
    const leadsSeed = `${state.selectedScenario}-leads`;
    const monthlyLeads = Math.round(applyVariance(baseMonthlyLeads, state.variancePercent, state.enableVariance, leadsSeed, month, state.diligenceMode));
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

    const b2bMRR = (starterClients * PRICING.b2b.starter) + (growthClients * PRICING.b2b.growth) + (scaleClients * PRICING.b2b.scale);

    // Marketplace
    const monthlyListings = Math.round(totalUsers * scenarioData.listingsPerUser);
    const listingsRevenue = monthlyListings * ((PRICING.marketplace.listingFee2Week + PRICING.marketplace.listingFee4Week) / 2);
    const listingsWithResponses = Math.round(monthlyListings * scenarioData.listingToProjectRate);
    const projectsOnPlatform = Math.round(listingsWithResponses * scenarioData.marketplaceCapture);
    const platformFees = projectsOnPlatform * scenarioData.avgProjectValue * PRICING.marketplace.platformFee;
    const creditsRevenue = scenarioData.creditsPurchasesPerMonth * PRICING.marketplace.commaCredits;

    // Revenue
    const recurringRevenue = creativeMRR + b2bMRR;
    const transactionRevenue = listingsRevenue + platformFees + creditsRevenue;
    const totalRevenue = recurringRevenue + transactionRevenue;

    // Costs
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

    const toolsCost = (baseToolsCost * Math.pow(scenarioData.toolsGrowthRate, yearsElapsed)) + COST_STRUCTURE.toolsAndInfra.annualSubs;

    let outsourced = COST_STRUCTURE.outsourced.base2025;
    if (month >= 12 && month < 24) outsourced = COST_STRUCTURE.outsourced.base2026;
    if (month >= 24) outsourced = COST_STRUCTURE.outsourced.base2027;

    const events = Math.min(5000, totalRevenue * 0.05);
    const totalCosts = totalSalaries + marketing + toolsCost + outsourced + events;

    // Cash flow
    const cashCollected = (recurringRevenue * COST_STRUCTURE.collectionRates.recurring) + (transactionRevenue * COST_STRUCTURE.collectionRates.transaction);
    const netCashFlow = cashCollected - totalCosts;
    const openingCash = month === 0 ? state.startingCash : data[month - 1].closingCash;

    const isFundingMonth = date.getFullYear() === raiseDate.getFullYear() && date.getMonth() === raiseDate.getMonth();
    const funding = isFundingMonth ? state.raiseAmount : 0;
    const closingCash = openingCash + netCashFlow + funding;

    // Unit economics
    const totalNewCustomers = newB2BClients + newPro + newPlus;
    const cac = totalNewCustomers > 0 ? (marketing + salesSalaries) / totalNewCustomers : 0;
    const b2bARPU = (starterClients + growthClients + scaleClients) > 0 ? b2bMRR / (starterClients + growthClients + scaleClients) : 0;
    const b2bLTV = b2bARPU > 0 && monthlyB2BChurnRate > 0 ? b2bARPU / monthlyB2BChurnRate : 0;
    const ltvCacRatio = cac > 0 ? b2bLTV / cac : 0;
    const paybackMonths = cac > 0 && b2bARPU > 0 ? cac / b2bARPU : 0;

    // Runway
    const avgBurn = month >= 3 ? (data.slice(month - 3, month).reduce((sum, m) => sum + Math.abs(Math.min(m.netCashFlow, 0)), 0) / 3) : Math.abs(Math.min(netCashFlow, 0));
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
        newPlusThisMonth: newPlus,
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
        growthUpsold,
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
        platformFeeRate: PRICING.marketplace.platformFee,
      },
      costBreakdown: {
        baseTeam: baseTeamSalaries,
        sales: salesSalaries,
        support: supportSalaries,
        marketing,
        tools: toolsCost,
        outsourced,
        events,
      },
    });
  }

  return data;
}
