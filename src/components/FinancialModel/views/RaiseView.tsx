import React from 'react';
import { ValuationMetrics, InvestorROI, MonthOption } from '../types';
import { fmt, parseNumber } from '../helpers';

interface Props {
  valuationMetrics: ValuationMetrics;
  investorROI: InvestorROI;
  raiseAmount: number;
  arrMultiple: number;
  raiseDate: string;
  exitMultiple: number;
  exitYear: number;
  monthOptions: MonthOption[];
  onChangeRaiseAmount: (amount: number) => void;
  onChangeRaiseDate: (ym: string) => void;
  onChangeArrMultiple: (m: number) => void;
  onChangeExitMultiple: (m: number) => void;
  onChangeExitYear: (y: number) => void;
}

export default function RaiseView({ valuationMetrics, investorROI, raiseAmount, arrMultiple, raiseDate, exitMultiple, exitYear, monthOptions, onChangeRaiseAmount, onChangeRaiseDate, onChangeArrMultiple, onChangeExitMultiple, onChangeExitYear }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Fundraising Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Raise Amount (£)</label>
            <input type="number" value={raiseAmount} onChange={(e) => onChangeRaiseAmount(parseNumber(e.target.value, 0, { min: 0 }))} className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Raise Date</label>
            <select value={raiseDate} onChange={(e) => onChangeRaiseDate(e.target.value)} className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg">
              {monthOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">ARR Multiple</label>
            <input type="number" step="0.5" value={arrMultiple} onChange={(e) => onChangeArrMultiple(parseNumber(e.target.value, 0, { min: 0 }))} className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Investor ROI</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <div>
            <div className="text-sm text-gray-600 mb-1">Exit Year</div>
            <div className="text-xl font-bold text-purple-700">{investorROI.totalYearsToExit}y</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Exit Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Exit Multiple (ARR × ?)</label>
            <input type="number" step="0.5" value={exitMultiple} onChange={(e) => onChangeExitMultiple(parseNumber(e.target.value, 0, { min: 0 }))} className="w-full px-4 py-3 text-xl font-bold border-2 border-purple-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Exit Year (from today)</label>
            <input type="number" value={exitYear} onChange={(e) => onChangeExitYear(parseNumber(e.target.value, 5, { min: 1 }))} className="w-full px-4 py-3 text-xl font-bold border-2 border-purple-300 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
