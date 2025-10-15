import React from 'react';
import { AllProjections } from '../types';
import { fmt } from '../helpers';
import { M36_INDEX, M12_INDEX } from '../constants';

interface Props {
  allProjections: AllProjections;
}

export default function AnalysisView({ allProjections }: Props) {
  const worst = allProjections.worst[M36_INDEX];
  const base = allProjections.base[M36_INDEX];
  const best = allProjections.best[M36_INDEX];
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Year 3 Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">ARR (Conservative)</div>
            <div className="font-bold">{fmt(allProjections.worst[M36_INDEX].totalRevenue * 12)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">ARR (Base)</div>
            <div className="font-bold">{fmt(allProjections.base[M36_INDEX].totalRevenue * 12)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">ARR (Growth)</div>
            <div className="font-bold">{fmt(allProjections.best[M36_INDEX].totalRevenue * 12)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Month 12 Unit Economics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">LTV:CAC</div>
            <div className="font-bold">{allProjections.base[M12_INDEX].ltvCacRatio.toFixed(1)}x</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">CAC Payback</div>
            <div className="font-bold">{allProjections.base[M12_INDEX].paybackMonths.toFixed(0)}mo</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Costs</div>
            <div className="font-bold">{fmt(allProjections.base[M12_INDEX].totalCosts)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
