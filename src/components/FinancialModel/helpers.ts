import { MonthOption, PlanMix } from './types';
import { CURRENCY } from './constants';

// Converts annual churn to an equivalent monthly churn rate (continuous compounding)
export const annualToMonthlyChurn = (annualRate: number): number => 1 - Math.pow(1 - annualRate, 1 / 12);
export const CHURN_ANNUAL_TO_MONTHLY = (annualRate: number): number => annualToMonthlyChurn(annualRate);

export interface ClientDistribution { starter: number; growth: number; scale: number }
export const distributeClients = (total: number, planMix: PlanMix): ClientDistribution => {
  if (total === 0) return { starter: 0, growth: 0, scale: 0 };
  const keys = Object.keys(planMix) as Array<keyof PlanMix>;
  const result: Record<string, number> = {};
  let remaining = total;
  keys.forEach((key, index) => {
    if (index < keys.length - 1) {
      const count = Math.round(total * planMix[key]);
      result[key] = count;
      remaining -= count;
    } else {
      result[key] = Math.max(0, remaining);
    }
  });
  return { starter: result.starter || 0, growth: result.growth || 0, scale: result.scale || 0 };
};

export const getSeasonalityMultiplier = (month: number, enableSeasonality: boolean): number => {
  if (!enableSeasonality) return 1.0;
  const seasonality = [
    0.85, // Jan - slow
    0.90, // Feb
    0.95, // Mar
    1.00, // Apr
    1.05, // May
    0.90, // Jun - summer slowdown
    0.80, // Jul - summer slowdown
    0.85, // Aug - summer slowdown
    1.00, // Sep - back to work
    1.10, // Oct - Q4 push
    1.15, // Nov - Q4 push
    1.25, // Dec - year-end deals
  ];
  return seasonality[month % 12];
};

// Deterministic seeded jitter helpers
const seeded = (seed: string, i: number): number => {
  let h = 2166136261 ^ i;
  for (const c of seed) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
};

export const jitter = (seed: string, i: number, pct: number, diligenceMode: boolean): number => {
  if (diligenceMode) return 1; // deterministic: no noise
  const r = seeded(seed, i) * 2 - 1;
  return 1 + r * pct; // multiplicative jitter
};

export const applyVariance = (
  value: number,
  variancePercent: number,
  enableVariance: boolean,
  seed: string,
  i: number,
  diligenceMode: boolean
): number => {
  if (!enableVariance) return value;
  const factor = jitter(seed, i, variancePercent / 100, diligenceMode);
  return value * factor;
};

export const fmt = (v: number): string =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: CURRENCY, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

export const pct = (v: number): string => `${(v * 100).toFixed(1)}%`;

export const clamp = (value: number, min?: number, max?: number): number => {
  let x = value;
  if (typeof min === 'number') x = Math.max(min, x);
  if (typeof max === 'number') x = Math.min(max, x);
  return x;
};

export const parseNumber = (raw: string | number, defaultValue = 0, opts?: { min?: number; max?: number }): number => {
  if (typeof raw === 'number' && Number.isFinite(raw)) return clamp(raw, opts?.min, opts?.max);
  const n = typeof raw === 'string' ? parseFloat(raw) : NaN;
  if (!Number.isFinite(n)) return clamp(defaultValue, opts?.min, opts?.max);
  return clamp(n, opts?.min, opts?.max);
};

export function generateMonthOptions(startDate: string, months: number): MonthOption[] {
  const options: MonthOption[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < months; i++) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + i);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}
