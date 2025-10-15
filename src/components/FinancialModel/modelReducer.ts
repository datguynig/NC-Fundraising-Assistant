import { Action, ModelState, ScenarioKey } from './types';
import {
  DEFAULT_PROJECTION_MONTHS,
  DEFAULT_CURRENT_DATE,
  DEFAULT_RAISE_DATE,
  DEFAULT_ARR_MULTIPLE,
  DEFAULT_SELECTED_SCENARIO,
  DEFAULT_SCENARIOS,
} from './constants';

export const initialState: ModelState = {
  view: 'overview',
  currentDate: DEFAULT_CURRENT_DATE,
  projectionMonths: DEFAULT_PROJECTION_MONTHS,
  raiseAmount: 500000,
  raiseDate: DEFAULT_RAISE_DATE,
  arrMultiple: DEFAULT_ARR_MULTIPLE,
  selectedScenario: DEFAULT_SELECTED_SCENARIO,
  scenarios: DEFAULT_SCENARIOS,
  exitMultiple: 12,
  exitYear: 5,
  showRunwayAlert: true,
  showRevenueBreakdown: true,
  startingCash: 147.72,
  enableSeasonality: false,
  enableVariance: false,
  variancePercent: 10,
  diligenceMode: true,
  showActuals: false,
  actuals: {},
};

export function modelReducer(state: ModelState, action: Action): ModelState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload as ScenarioKey };
    case 'SET_RAISE_AMOUNT':
      return { ...state, raiseAmount: Math.max(0, action.payload) };
    case 'SET_RAISE_DATE':
      return { ...state, raiseDate: action.payload };
    case 'SET_ARR_MULTIPLE':
      return { ...state, arrMultiple: Math.max(0, action.payload) };
    case 'SET_EXIT_MULTIPLE':
      return { ...state, exitMultiple: Math.max(0, action.payload) };
    case 'SET_EXIT_YEAR':
      return { ...state, exitYear: Math.max(1, action.payload) };
    case 'SET_STARTING_CASH':
      return { ...state, startingCash: Math.max(0, action.payload) };
    case 'TOGGLE_REVENUE_BREAKDOWN':
      return { ...state, showRevenueBreakdown: !state.showRevenueBreakdown };
    case 'TOGGLE_SEASONALITY':
      return { ...state, enableSeasonality: !state.enableSeasonality };
    case 'TOGGLE_VARIANCE':
      return { ...state, enableVariance: !state.enableVariance };
    case 'SET_VARIANCE_PERCENT':
      return { ...state, variancePercent: Math.max(0, Math.min(100, action.payload)) };
    case 'TOGGLE_DILIGENCE_MODE':
      return { ...state, diligenceMode: !state.diligenceMode };
    case 'TOGGLE_ACTUALS':
      return { ...state, showActuals: !state.showActuals };
    case 'UPDATE_SCENARIO':
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [action.key]: { ...state.scenarios[action.key], ...action.updates },
        },
      };
    default:
      return state;
  }
}
