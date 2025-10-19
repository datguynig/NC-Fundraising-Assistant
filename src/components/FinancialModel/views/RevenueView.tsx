import React from 'react';
import { ProjectionMonth } from '../types';
import { fmt } from '../helpers';
import { PRICING, M36_INDEX } from '../constants';

interface Props {
  currentProjection: ProjectionMonth[];
  showBreakdown: boolean;
  onToggleBreakdown: () => void;
}

export default function RevenueView({ currentProjection, showBreakdown, onToggleBreakdown }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Revenue Analysis</h2>
        <button onClick={onToggleBreakdown} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-xl">Month 36 Revenue Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded">
            <div className="font-semibold text-gray-900 mb-1">Creative Memberships</div>
            <div className="text-green-700 font-bold text-lg">{fmt(currentProjection[M36_INDEX]?.creativeMRR)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="font-semibold text-gray-900 mb-1">B2B SaaS</div>
            <div className="text-blue-700 font-bold text-lg">{fmt(currentProjection[M36_INDEX]?.b2bMRR)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="font-semibold text-gray-900 mb-1">Marketplace</div>
            <div className="text-orange-700 font-bold text-lg">{fmt((currentProjection[M36_INDEX]?.listingsRevenue || 0) + (currentProjection[M36_INDEX]?.platformFees || 0) + (currentProjection[M36_INDEX]?.creditsRevenue || 0))}</div>
          </div>
        </div>
      </div>

      {showBreakdown && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-xl">Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-700">Pro: {currentProjection[M36_INDEX]?.proPaid} × £{PRICING.creative.pro} = {fmt((currentProjection[M36_INDEX]?.proPaid || 0) * PRICING.creative.pro)}</div>
              <div className="text-sm text-gray-700">Plus: {currentProjection[M36_INDEX]?.plusPaid} × £{PRICING.creative.plus} = {fmt((currentProjection[M36_INDEX]?.plusPaid || 0) * PRICING.creative.plus)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-700">Starter: {currentProjection[M36_INDEX]?.starterClients} × £{PRICING.b2b.starter} = {fmt((currentProjection[M36_INDEX]?.starterClients || 0) * PRICING.b2b.starter)}</div>
              <div className="text-sm text-gray-700">Growth: {currentProjection[M36_INDEX]?.growthClients} × £{PRICING.b2b.growth} = {fmt((currentProjection[M36_INDEX]?.growthClients || 0) * PRICING.b2b.growth)}</div>
              <div className="text-sm text-gray-700">Scale: {currentProjection[M36_INDEX]?.scaleClients} × £{PRICING.b2b.scale} = {fmt((currentProjection[M36_INDEX]?.scaleClients || 0) * PRICING.b2b.scale)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
