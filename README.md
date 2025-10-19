# NewComma Financial Model v3.1

Interactive fundraising and financial planning UI for NewComma. This React + TypeScript component models revenue, costs, dilution, and runway across scenarios to help you plan a raise and present investor-ready projections.

## Highlights
- Scenario planning: Conservative, Base, Growth
- Revenue modeling: B2B SaaS, Creative memberships, Marketplace fees, Credits
- Costs and runway: salaries, marketing, tools, and more with runway alerts
- Fundraise planning: ARR multiple, pre/post-money, dilution, new shares
- Investor ROI: exit multiple, exit year, payout and return multiple
- Unit economics: CAC, LTV, LTV:CAC, payback period
- Beautiful UI with Tailwind CSS

## Quick start (embed in an existing React app)
> This repository ships a self-contained UI component. Import it into your React app or monorepo. There’s no standalone dev server here.

### 1) Requirements
- React 18+
- TypeScript 5+
- Tailwind CSS (recommended)

### 2) Add the component to your app
Copy the `src/components/FinancialModel` folder (and the `newcomma-model-v3-1.tsx` re-export) into your app, then import it:

```tsx
// e.g. app/page.tsx or src/App.tsx
import FinancialModel from "./newcomma-model-v3-1";

export default function App() {
  return <FinancialModel />;
}
```

### 3) Styling
The UI uses Tailwind utility classes. Ensure your app has Tailwind set up. See Tailwind’s installation guide: `https://tailwindcss.com/docs/installation`.

If you’re not using Tailwind, the component will render but won’t be styled as intended.

## Configuration
Most defaults live in `src/components/FinancialModel/constants.ts`.
- `CURRENCY` (default `GBP`)
- `DEFAULT_CURRENT_DATE`, `DEFAULT_RAISE_DATE`, `DEFAULT_ARR_MULTIPLE`
- `DEFAULT_SCENARIOS` (Conservative/Base/Growth inputs)
- `PRICING` (creative plans, B2B tiers, marketplace fees)
- `COST_STRUCTURE` (salaries, tools, marketing, collections)
- `ARR_MULTIPLE_GUIDANCE` (helper guidance for valuation multiples)

Current version exposes configuration via editing constants; the `FinancialModel` component does not yet accept props for these. If you need runtime configuration, consider wiring props through and threading them into the reducer/logic files noted below.

## What you’ll see in the UI
- Tabs: Overview, Revenue, Expenses, Unit Economics, Raise, Analysis, Scenarios, Settings
- Scenario switching: buttons for Conservative, Base Case, Growth
- Runway alert: highlights short runway with a CTA to plan a raise
- Raise tab: pre/post-money, dilution, new shares, plus Investor ROI

## Project structure
```
newcomma-model-v3-1.tsx             # Re-exports the FinancialModel component
src/components/FinancialModel/
  FinancialModel.tsx                # Main component (tabs, layout, state)
  modelReducer.ts                   # App state + actions
  modelLogic.ts                     # Core monthly projection math
  types.ts                          # Strong TypeScript models for projections
  helpers.ts                        # Utility functions (formatting, variance, dates)
  constants.ts                      # Defaults: currency, scenarios, pricing, costs, etc.
  views/                            # UI for each tab (Overview/Revenue/Expenses/...)
```

## Documentation
- User Guide: `./v3-user-guide.md`
- Quick Reference: `./v3-quick-reference.md`
- Validation Checklist: `./v3-validation-checklist.md`
- Deployment Summary: `./v3-deployment-summary.md`
- Scenarios Playbook: `./scenarios-playbook.md`

These documents explain the business logic, expected ranges/benchmarks, and how to present results to stakeholders and investors.

## Development notes
- Tech: React + TypeScript, Tailwind CSS
- No external charting dependency is required; views render directly with React and Tailwind.
- If you plan to extend calculations, start with `modelLogic.ts`, `modelReducer.ts`, and the shapes in `types.ts`.
- To change pricing, scenarios, or cost assumptions, edit `constants.ts`.

## Roadmap ideas
- Multiple funding rounds
- Seasonality toggles and controls in the UI
- Cohort retention analysis
- CSV export and scenario snapshots
- Sensitivity analysis tooling

## Version
- Model: v3.1 (UI heading reflects this)
- Last updated: October 2025

## Support
- If numbers look off, compare with `v3-validation-checklist.md`
- For usage questions, see `v3-user-guide.md`
