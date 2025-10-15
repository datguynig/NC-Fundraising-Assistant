import React from 'react';
import { ProjectionMonth, ValuationMetrics, RunwayStatus, ModelState, Action } from '../types';
import { fmt } from '../helpers';
import { M12_INDEX } from '../constants';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ComposedChart, Bar, Line } from 'recharts';

interface Props {
  state: ModelState;
  dispatch: React.Dispatch<Action>;
  currentProjection: ProjectionMonth[];
  valuationMetrics: ValuationMetrics;
  runwayStatus: RunwayStatus;
}

export default function OverviewView({ state, dispatch, currentProjection, valuationMetrics, runwayStatus }: Props) {
  return (
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
          <div className="text-xs text-gray-500 mt-1">Editable in Settings</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Runway</div>
          <div className="text-2xl font-bold text-orange-700">{runwayStatus.minRunway.toFixed(0)}mo</div>
          <div className="text-xs text-gray-500 mt-1">Minimum</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">LTV:CAC (M12)</div>
          <div className="text-2xl font-bold text-purple-700">{currentProjection[M12_INDEX]?.ltvCacRatio.toFixed(1)}x</div>
          <div className="text-xs text-gray-500 mt-1">Month 12 avg</div>
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
              <Tooltip formatter={(v) => fmt(Number(v))} />
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
  );
}
