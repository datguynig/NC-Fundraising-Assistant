import React from 'react';
import { ProjectionMonth } from '../types';
import { M12_INDEX } from '../constants';
import { fmt } from '../helpers';

interface Props {
  currentProjection: ProjectionMonth[];
}

export default function ExpensesView({ currentProjection }: Props) {
  const m12 = currentProjection[M12_INDEX];
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Cost Structure (Month 12)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Salaries</div>
            <div className="font-bold text-blue-700">{fmt(m12?.salaries || 0)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Marketing</div>
            <div className="font-bold text-green-700">{fmt(m12?.marketing || 0)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Tools</div>
            <div className="font-bold text-amber-700">{fmt(m12?.tools || 0)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Total Costs (M12)</h3>
        <div className="text-2xl font-bold">{fmt(m12?.totalCosts || 0)}</div>
      </div>
    </div>
  );
}
