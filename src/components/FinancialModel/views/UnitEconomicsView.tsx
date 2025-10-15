import React from 'react';
import { ProjectionMonth } from '../types';
import { fmt } from '../helpers';
import { M12_INDEX } from '../constants';

interface Props {
  currentProjection: ProjectionMonth[];
}

export default function UnitEconomicsView({ currentProjection }: Props) {
  const m12 = currentProjection[M12_INDEX];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Blended CAC</div>
          <div className="text-2xl font-bold text-blue-700">{fmt(m12?.cac || 0)}</div>
          <div className="text-xs text-gray-500 mt-1">Customer acquisition cost</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">B2B LTV</div>
          <div className="text-2xl font-bold text-green-700">{fmt(m12?.b2bLTV || 0)}</div>
          <div className="text-xs text-gray-500 mt-1">Lifetime value</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">LTV:CAC Ratio</div>
          <div className="text-2xl font-bold text-purple-700">{m12 ? m12.ltvCacRatio.toFixed(1) : '0.0'}x</div>
          <div className="text-xs text-gray-500 mt-1">Target: &gt;3x</div>
        </div>
      </div>
    </div>
  );
}
