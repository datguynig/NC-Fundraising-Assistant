import React, { useMemo, useReducer } from 'react';
import { modelReducer, initialState } from './modelReducer';
import { AllProjections, InvestorROI, ModelState, ValuationMetrics } from './types';
import { calculateProjections } from './modelLogic';
import { CAP_TABLE } from './constants';
import { fmt, generateMonthOptions } from './helpers';

import OverviewView from './views/OverviewView';
import RevenueView from './views/RevenueView';
import ExpensesView from './views/ExpensesView';
import UnitEconomicsView from './views/UnitEconomicsView';
import RaiseView from './views/RaiseView';
import AnalysisView from './views/AnalysisView';
import ScenariosView from './views/ScenariosView';
import SettingsView from './views/SettingsView';

export default function FinancialModel() {
  const [state, dispatch] = useReducer(modelReducer, initialState);

  const allProjections: AllProjections = useMemo(() => ({
    worst: calculateProjections(state, state.scenarios.worst),
    base: calculateProjections(state, state.scenarios.base),
    best: calculateProjections(state, state.scenarios.best),
  }), [state.raiseAmount, state.raiseDate, state.scenarios, state.startingCash, state.enableSeasonality, state.enableVariance, state.variancePercent]);

  const currentProjection = allProjections[state.selectedScenario];

  const valuationMetrics: ValuationMetrics = useMemo(() => {
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
      credits: last.creditsRevenue * 12,
    };

    return { arr, preMoney, postMoney, founderDilution, newShares, endingCash: last.closingCash, revenueBreakdown };
  }, [currentProjection, state.raiseAmount, state.arrMultiple]);

  const investorROI: InvestorROI = useMemo(() => {
    const investmentAmount = state.raiseAmount;
    const equityOwned = valuationMetrics.founderDilution / 100;

    const currentProjectionYears = state.projectionMonths / 12;
    const totalYearsToExit = state.exitYear;
    const additionalGrowthYears = Math.max(0, totalYearsToExit - currentProjectionYears);

    let futureARR: number;
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

  const viewTabs: Array<{ key: ModelState['view']; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'unit-economics', label: 'Unit Economics' },
    { key: 'raise', label: 'Raise' },
    { key: 'analysis', label: 'Analysis' },
    { key: 'scenarios', label: 'Scenarios' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">NewComma Financial Model v3.1</h1>
          <p className="text-gray-600">Enhanced: modularized, type-safe, same business logic</p>
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
                <input type="number" value={state.startingCash} onChange={(e) => dispatch({ type: 'SET_STARTING_CASH', payload: Number(e.target.value) || 0 })} className="w-32 px-3 py-2 border-2 border-amber-500 rounded-lg font-bold" />
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
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'raise' })} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">Plan Raise</button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex flex-wrap gap-2">
          {viewTabs.map(v => (
            <button key={v.key} onClick={() => dispatch({ type: 'SET_VIEW', payload: v.key })} className={`flex-1 min-w-[90px] px-3 py-2 rounded-lg font-medium text-sm transition-all ${state.view === v.key ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              {v.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Active Scenario</label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(state.scenarios) as Array<keyof typeof state.scenarios>).map(key => (
              <button key={key} onClick={() => dispatch({ type: 'SET_SCENARIO', payload: key })} className={`px-4 py-3 rounded-lg font-medium border-2 ${state.selectedScenario === key ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-yellow-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                {state.scenarios[key].name}
              </button>
            ))}
          </div>
        </div>

        {state.view === 'overview' && (
          <OverviewView state={state} dispatch={dispatch} currentProjection={currentProjection} valuationMetrics={valuationMetrics} runwayStatus={runwayStatus} />
        )}

        {state.view === 'revenue' && (
          <RevenueView currentProjection={currentProjection} showBreakdown={state.showRevenueBreakdown} onToggleBreakdown={() => dispatch({ type: 'TOGGLE_REVENUE_BREAKDOWN' })} />
        )}

        {state.view === 'expenses' && (
          <ExpensesView currentProjection={currentProjection} />
        )}

        {state.view === 'unit-economics' && (
          <UnitEconomicsView currentProjection={currentProjection} />
        )}

        {state.view === 'raise' && (
          <RaiseView valuationMetrics={valuationMetrics} investorROI={investorROI} raiseAmount={state.raiseAmount} arrMultiple={state.arrMultiple} raiseDate={state.raiseDate} exitMultiple={state.exitMultiple} exitYear={state.exitYear} monthOptions={monthOptions} onChangeRaiseAmount={(v) => dispatch({ type: 'SET_RAISE_AMOUNT', payload: v })} onChangeRaiseDate={(v) => dispatch({ type: 'SET_RAISE_DATE', payload: v })} onChangeArrMultiple={(v) => dispatch({ type: 'SET_ARR_MULTIPLE', payload: v })} onChangeExitMultiple={(v) => dispatch({ type: 'SET_EXIT_MULTIPLE', payload: v })} onChangeExitYear={(v) => dispatch({ type: 'SET_EXIT_YEAR', payload: v })} />
        )}

        {state.view === 'analysis' && (
          <AnalysisView allProjections={allProjections} />
        )}

        {state.view === 'scenarios' && (
          <ScenariosView scenarios={state.scenarios} onUpdateScenario={(key, updates) => dispatch({ type: 'UPDATE_SCENARIO', key, updates })} />
        )}

        {state.view === 'settings' && (
          <SettingsView startingCash={state.startingCash} enableSeasonality={state.enableSeasonality} enableVariance={state.enableVariance} variancePercent={state.variancePercent} onChangeStartingCash={(v) => dispatch({ type: 'SET_STARTING_CASH', payload: v })} onToggleSeasonality={() => dispatch({ type: 'TOGGLE_SEASONALITY' })} onToggleVariance={() => dispatch({ type: 'TOGGLE_VARIANCE' })} onChangeVariancePercent={(v) => dispatch({ type: 'SET_VARIANCE_PERCENT', payload: v })} />
        )}
      </div>
    </div>
  );
}
