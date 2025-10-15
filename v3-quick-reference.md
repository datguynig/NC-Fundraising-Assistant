# NewComma Financial Model v3.0 - Quick Reference Card
*Print this page and keep it handy!*

---

## 📍 Navigation Quick Guide

| Tab | What It Shows | When to Use |
|-----|--------------|-------------|
| **Overview** | 4 key metrics + charts | Daily check-in, board meetings |
| **Revenue** | Revenue streams breakdown | Understanding revenue model |
| **Expenses** | Cost structure | Budget planning, hiring decisions |
| **Unit Economics** | LTV, CAC, ratios | Investor conversations |
| **Raise** | Fundraising calculator | Planning rounds, modeling dilution |
| **Cap Table** | Ownership breakdown | Understanding equity |
| **Scenarios** | Edit assumptions | What-if analysis |

---

## 🎯 Three Scenarios At-a-Glance

| Metric | Conservative | Base Case | Growth |
|--------|--------------|-----------|---------|
| **Year 3 ARR** | £298k | £542k | £1.47M |
| **Monthly Leads** | 50 | 200 | 500 |
| **Marketing** | £290/mo | £1,520/mo | £4,160/mo |
| **Sales Team** | 0 | 1 | 4 |
| **Philosophy** | "What if slow?" | "What we expect" | "What if great?" |
| **Use For** | Runway planning | Budgeting | Upside modeling |

---

## 📊 Key Metrics Decoder

### Your Current Numbers (Base Case, Month 12)

| Metric | Your Number | Target | Status |
|--------|-------------|--------|--------|
| **LTV:CAC** | 3.1x | >3x | ✅ Healthy |
| **CAC Payback** | 11 months | <18mo | ✅ Fast |
| **Annual Churn** | 15% | <20% | ✅ Good |
| **B2B LTV** | £3,120 | >3x CAC | ✅ Strong |
| **Year 3 ARR** | £542k | >£500k | ✅ On track |

---

## 💰 Fundraising Quick Calculator

### Current Plan: £500k Seed Round

| Input | Value | Result |
|-------|-------|--------|
| **Raise Amount** | £500,000 | — |
| **ARR Multiple** | 8x | — |
| **Year 3 ARR** | £542k | — |
| **Pre-Money** | — | £4.3M |
| **Post-Money** | — | £4.8M |
| **Dilution** | — | 9.6% |

### Quick Dilution Guide
- £250k @ 8x = 4.9% dilution
- £500k @ 8x = 9.6% dilution
- £750k @ 8x = 14.3% dilution
- £1M @ 8x = 18.9% dilution

---

## 🚨 Warning Signals

### When to Take Action

| Alert | Trigger | Action Needed |
|-------|---------|---------------|
| 🔴 **Cash Critical** | Runway <6mo | Start fundraising NOW |
| 🟡 **Cash Warning** | Runway <12mo | Begin fundraising prep |
| 🔴 **Churn Alert** | >20% annual | Focus on retention |
| 🟡 **Unit Econ Warning** | LTV:CAC <3x | Increase prices or cut CAC |
| 🔴 **Payback Too Long** | >18 months | Reduce CAC or raise prices |

---

## 🎓 5-Minute Workflows

### Workflow 1: Daily Check-In (2 mins)
1. Open **Overview** tab
2. Check 4 metric cards
3. Glance at runway number
4. Done!

### Workflow 2: Board Prep (5 mins)
1. **Overview** → Screenshot metrics
2. **Unit Economics** → Show 3.1x LTV:CAC
3. **Revenue** → Show breakdown
4. **Raise** → Show funding plan
5. Done!

### Workflow 3: Investor Pitch (10 mins)
1. **Overview** → Year 3 ARR goal
2. **Revenue** → Show three engines
3. **Unit Economics** → Show healthy metrics
4. **Raise** → Model their return
5. **Scenarios** → Show range of outcomes
6. Done!

---

## 🔢 Formula Cheat Sheet

### Key Calculations

**LTV (Lifetime Value)**
```
LTV = ARPU / Monthly Churn Rate
Example: £87 / 0.0125 = £3,120
```

**LTV:CAC Ratio**
```
Ratio = LTV / CAC
Example: £3,120 / £1,000 = 3.1x
```

**CAC Payback**
```
Payback = CAC / ARPU
Example: £1,000 / £87 = 11 months
```

**Annual → Monthly Churn**
```
Monthly = Annual / 12
Example: 15% / 12 = 1.25%
```

**ARR (Annual Recurring Revenue)**
```
ARR = MRR × 12
Example: £45k × 12 = £540k
```

---

## 🎯 Decision Frameworks

### When to Hire?
```
✅ Hire if: Revenue supports cost in BASE case
⚠️ Wait if: Only works in GROWTH case
❌ Don't hire if: Negative in CONSERVATIVE case
```

### When to Fundraise?
```
Start when: Runway = 9-12 months (Conservative)
Why: 3-6mo process + 3mo buffer
```

### Which Scenario to Use?
```
Daily planning → BASE CASE
Runway planning → CONSERVATIVE
Budgeting → BASE CASE
Hiring decisions → BASE CASE
Investor pitch → Show ALL THREE
Risk assessment → CONSERVATIVE
```

---

## 💡 Pro Tips

### Do This ✅
- View Base Case first (most credible)
- Check unit economics weekly
- Model Conservative for runway
- Update actuals monthly
- Show all three scenarios to investors
- Start fundraising at 12mo runway

### Don't Do This ❌
- Don't only show Growth
- Don't ignore runway warnings
- Don't fundraise based on current cash
- Don't change scenarios mid-budget
- Don't assume linear growth
- Don't wait until 6mo runway to fundraise

---

## 📞 Quick Help

### Model Not Working?
1. Check console (F12) for errors
2. Hard refresh (Ctrl+Shift+R)
3. Compare with v2.2 backup
4. Review validation checklist

### Numbers Look Wrong?
1. Check which scenario is active
2. Verify helper functions loaded
3. Check for NaN or Infinity
4. Review recent assumption changes

### Need to Rollback?
```bash
cp financial-model-v2.2-backup.jsx financial-model.jsx
# Or use: git checkout v2.2-stable
```

---

## 🎨 Color Codes in Charts

**Revenue Streams:**
- 🔵 Blue = B2B SaaS (biggest)
- 🟢 Green = Creative Memberships
- 🟣 Purple = Platform Fees
- 🟠 Orange = Listing Fees
- 🔴 Red = Credits

**Cost Structure:**
- 🔵 Blue = Salaries (biggest)
- 🟢 Green = Marketing
- 🟠 Orange = Tools
- 🟣 Purple = Outsourced
- 🩷 Pink = Events

---

## 📈 Benchmark Targets

### SaaS Industry Standards

| Metric | Target | Your Number |
|--------|--------|-------------|
| **LTV:CAC** | 3-5x | 3.1x ✅ |
| **CAC Payback** | <18mo | 11mo ✅ |
| **Annual Churn** | <20% | 15% ✅ |
| **Gross Margin** | >70% | ~85% ✅ |
| **Growth Rate** | >100% YoY | — |
| **Magic Number** | >0.75 | — |

---

## 🔍 Where to Find What

### "How much cash do we have?"
→ **Overview** tab → "Current Cash" card

### "When do we run out of money?"
→ **Overview** tab → "Runway" card

### "Are our unit economics good?"
→ **Unit Economics** tab → Check LTV:CAC

### "How much should we raise?"
→ **Raise** tab → Try different amounts

### "What will Year 3 revenue be?"
→ **Overview** tab → "Year 3 ARR" card

### "How many sales people do we need?"
→ **Expenses** tab → Scenario Cost Comparison

### "What's our dilution?"
→ **Raise** tab → "Dilution" result

### "What do scenarios differ on?"
→ **Expenses** tab → Scenario Cost Comparison

---

## 🎯 Monthly Checklist

### First Week of Month
- [ ] Check Overview metrics
- [ ] Compare actuals to projections
- [ ] Note any major variances
- [ ] Update team on progress

### Mid-Month
- [ ] Review one detailed tab
- [ ] Check runway (Conservative)
- [ ] Verify fundraising timeline
- [ ] Model any new decisions

### End of Month
- [ ] Update assumptions if needed
- [ ] Prepare board update
- [ ] Export key charts
- [ ] Plan next month's focus

---

## 🚀 Remember

**Three Numbers to Know:**
1. **£542k** = Year 3 ARR (Base Case)
2. **3.1x** = LTV:CAC ratio (healthy!)
3. **9.6%** = Dilution from £500k raise

**Three Actions to Take:**
1. Check Overview daily
2. Update actuals monthly
3. Start fundraising at 12mo runway

**Three Rules:**
1. Base Case for planning
2. Conservative for runway
3. Growth for inspiration

---

## 📞 Support Resources

**Documentation:**
- User Guide (comprehensive)
- Implementation Plan
- Validation Checklist
- Investor Comparison Doc

**Quick Links:**
- Model: [your URL]
- Docs: [your URL]
- Support: [your email]

---

*Print this reference card and keep it near your computer!*

**Version:** 3.0  
**Updated:** October 2025  
**Page:** 1 of 1 (designed for single-page printing)