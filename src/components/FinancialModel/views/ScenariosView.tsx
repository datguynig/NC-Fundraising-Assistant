import React from 'react';
import { Scenario, ScenarioKey } from '../types';
import { parseNumber, pct } from '../helpers';

interface Props {
  scenarios: Record<ScenarioKey, Scenario>;
  onUpdateScenario: (key: ScenarioKey, updates: Partial<Scenario>) => void;
}

export default function ScenariosView({ scenarios, onUpdateScenario }: Props) {
  const keys: ScenarioKey[] = ['worst', 'base', 'best'];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-4 text-xl">Edit Scenario Assumptions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {keys.map(key => {
          const s = scenarios[key];
          return (
            <div key={key} className="border-2 border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4">{s.name}</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-medium mb-1">Monthly Leads</label>
                  <input type="number" value={s.monthlyLeads} onChange={(e) => onUpdateScenario(key, { monthlyLeads: parseNumber(e.target.value, s.monthlyLeads, { min: 0 }) })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Lead → Demo (%)</label>
                  <input type="number" value={(s.leadToDemo * 100).toFixed(0)} onChange={(e) => onUpdateScenario(key, { leadToDemo: parseNumber(e.target.value, s.leadToDemo * 100, { min: 0, max: 100 }) / 100 })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Demo → Paid (%)</label>
                  <input type="number" value={(s.demoToPaid * 100).toFixed(0)} onChange={(e) => onUpdateScenario(key, { demoToPaid: parseNumber(e.target.value, s.demoToPaid * 100, { min: 0, max: 100 }) / 100 })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Marketing Budget (£)</label>
                  <input type="number" value={s.marketingBudget} onChange={(e) => onUpdateScenario(key, { marketingBudget: parseNumber(e.target.value, s.marketingBudget, { min: 0 }) })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
