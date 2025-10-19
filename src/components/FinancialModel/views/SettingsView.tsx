import React from 'react';

interface Props {
  startingCash: number;
  enableSeasonality: boolean;
  enableVariance: boolean;
  variancePercent: number;
  onChangeStartingCash: (v: number) => void;
  onToggleSeasonality: () => void;
  onToggleVariance: () => void;
  onChangeVariancePercent: (v: number) => void;
}

export default function SettingsView({ startingCash, enableSeasonality, enableVariance, variancePercent, onChangeStartingCash, onToggleSeasonality, onToggleVariance, onChangeVariancePercent }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Model Settings</h3>
        <div className="space-y-6">
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Starting Cash Position</h4>
              <p className="text-sm text-gray-600">Set your actual current cash balance</p>
            </div>
            <div className="w-48">
              <input type="number" value={startingCash} onChange={(e) => onChangeStartingCash(Number(e.target.value) || 0)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-bold" />
            </div>
          </div>

          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">Enable Seasonality</h4>
                <p className="text-sm text-gray-600">Add realistic seasonal patterns to growth (Q4 strong, summer weak)</p>
              </div>
              <button onClick={onToggleSeasonality} className={`px-6 py-2 rounded-lg font-medium ${enableSeasonality ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {enableSeasonality ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">Enable Variance/Randomness</h4>
                <p className="text-sm text-gray-600">Add realistic month-to-month variability</p>
              </div>
              <button onClick={onToggleVariance} className={`px-6 py-2 rounded-lg font-medium ${enableVariance ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {enableVariance ? 'ON' : 'OFF'}
              </button>
            </div>
            {enableVariance && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-2">Variance Amount (%)</label>
                <input type="range" min={5} max={30} value={variancePercent} onChange={(e) => onChangeVariancePercent(Number(e.target.value) || 0)} className="w-full" />
                <div className="text-sm text-gray-600 mt-1">Current: ±{variancePercent}% random variance each month</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
