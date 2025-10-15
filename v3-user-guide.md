# NewComma Financial Model v3.0 - User Guide

**Welcome to your financial planning tool!** This guide will help you understand and use the NewComma Financial Model effectively.

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding the Tabs](#understanding-the-tabs)
3. [Working with Scenarios](#working-with-scenarios)
4. [Planning a Fundraise](#planning-a-fundraise)
5. [Reading the Metrics](#reading-the-metrics)
6. [Common Use Cases](#common-use-cases)
7. [Tips & Best Practices](#tips-best-practices)
8. [FAQ](#faq)

---

## 🚀 Quick Start

### Your First 5 Minutes

1. **Open the model** - You'll see the Overview tab by default
2. **Check the scenario** - Make sure "Base Case" is selected (yellow button)
3. **Review key metrics** - 4 cards at top show: Year 3 ARR, Cash, LTV:CAC, Runway
4. **Explore tabs** - Click through Revenue, Expenses, Unit Economics
5. **Try scenarios** - Switch between Conservative, Base Case, and Growth

**That's it!** You now understand the basics.

---

## 📊 Understanding the Tabs

### 1. Overview Tab 🏠
**What it shows:** High-level business health

**Key Elements:**
- **4 metric cards:** Quick snapshot of performance
  - Year 3 ARR: Recurring revenue at end of 3 years
  - Current Cash: How much money in the bank today
  - LTV:CAC: Unit economics health (want >3x)
  - Runway: Months until cash runs out
  
- **Revenue Growth chart:** Shows recurring vs transaction revenue over time
- **Cash Runway chart:** Bar = cash balance, Line = months of runway

**When to use:** 
- Daily check-in on business health
- Board meetings - show this first
- Quick status updates

---

### 2. Revenue Tab 💰
**What it shows:** How you make money

**Key Elements:**
- **Revenue Streams chart:** Stacked area showing 5 revenue sources
  - B2B SaaS (blue)
  - Creative Memberships (green)
  - Platform Fees (purple)
  - Listing Fees (orange)
  - Credits (red)

- **Revenue Breakdown** (click "Show Revenue Breakdown"):
  - B2B funnel breakdown
  - Creative membership details
  - Marketplace activity
  - Year 3 revenue pie chart

**When to use:**
- Understanding revenue mix
- Modeling pricing changes
- Investor questions about revenue model
- Planning go-to-market strategy

**Pro tip:** Click "Show Revenue Breakdown" to see the detailed funnel math. This is great for investor due diligence.

---

### 3. Expenses Tab 💸
**What it shows:** How you spend money

**Key Elements:**
- **Cost Structure chart:** Stacked area showing 5 cost categories
  - Salaries (blue) - biggest expense
  - Marketing (green)
  - Tools (orange)
  - Outsourced services (purple)
  - Events (pink)

- **Scenario Cost Comparison:** See how costs differ across scenarios
  - Marketing budget per scenario
  - Sales team size
  - Tools growth rate
  - Team multiplier

**When to use:**
- Budget planning
- Comparing scenario tradeoffs
- Identifying cost drivers
- Planning hiring

**Pro tip:** Notice how Growth scenario has 4 sales people vs Base Case's 1. This is automatic based on lead volume.

---

### 4. Unit Economics Tab 📈
**What it shows:** Customer-level profitability

**Key Elements:**
- **3 metric cards:**
  - Blended CAC: Cost to acquire a customer
  - B2B LTV: Lifetime value of B2B customer
  - LTV:CAC Ratio: Health metric (want 3-5x)

- **CAC Trend chart:** How acquisition costs change over time
- **Payback Period chart:** Months to recover acquisition cost

- **Healthy SaaS Benchmarks:** Compare your metrics to targets
  - LTV:CAC: 3-5x (✅ you're at 3.1x)
  - CAC Payback: <18mo (✅ you're at 11mo)
  - Annual Churn: <20% (✅ you're at 15%)

**When to use:**
- Investor conversations (they LOVE this tab)
- Optimizing marketing spend
- Evaluating pricing changes
- Comparing to competitors

**Pro tip:** If LTV:CAC is below 3x, either increase prices, reduce marketing spend, or improve retention.

---

### 5. Raise Tab 💰
**What it shows:** Fundraising planning

**Top Section - Fundraising Calculator:**
- **Raise Amount:** How much you're raising (default £500k)
- **Raise Date:** When the money hits your account
- **ARR Multiple:** Valuation multiple (8x is typical for seed)

**Results show:**
- Pre-Money Valuation
- Post-Money Valuation
- New Shares Issued
- Founder Dilution %

**Bottom Section - Investor ROI:**
- **Exit Multiple:** What multiple of ARR at exit (10-15x typical)
- **Exit Year:** When you expect to exit (5-7 years common)

**Results show:**
- ARR at Exit
- Exit Valuation
- Investor Payout
- Return Multiple (investors want 10x+)

**When to use:**
- Planning fundraising round
- Modeling dilution scenarios
- Answering investor questions
- Understanding exit scenarios

**Pro tip:** Try different scenarios. £500k at 8x ARR = 9.6% dilution. £750k at same multiple = 14.3% dilution.

---

### 6. Cap Table Tab 📋
**What it shows:** Ownership breakdown

**Top Section - Current Cap Table:**
- Founders & Team: Current ownership
- Option Pool: Reserved for employees
- Fully Diluted: Total shares if all options exercised

**Bottom Section - Post-Raise Cap Table:**
- Shows ownership AFTER your planned raise
- New Investors row shows dilution

**When to use:**
- Understanding current ownership
- Modeling fundraising impact
- Employee equity planning
- Investor negotiations

**Pro tip:** Fully diluted is the "real" number investors care about, not just outstanding shares.

---

### 7. Scenarios Tab ⚙️
**What it shows:** Edit scenario assumptions

**You can adjust:**
- Monthly Leads (marketing effectiveness)
- Lead → Demo % (top of funnel)
- Demo → Paid % (close rate)
- Marketing Budget

**Three scenarios:**
- **Conservative:** 50 leads/mo, low conversion, £290/mo marketing
- **Base Case:** 200 leads/mo, medium conversion, £1,520/mo marketing
- **Growth:** 500 leads/mo, high conversion, £4,160/mo marketing

**When to use:**
- Sensitivity analysis
- What-if planning
- Modeling different strategies
- Preparing for board questions

**Pro tip:** Clone Base Case assumptions, then tweak one variable at a time to see impact.

---

## 🎭 Working with Scenarios

### The Three Scenarios Explained

**Conservative (Worst Case)**
- **Philosophy:** "What if growth is slower than expected?"
- **Assumptions:** Low marketing, minimal conversions, founder-led sales
- **Use for:** Downside planning, runway calculations, risk assessment
- **Outcome:** £298k ARR at Year 3

**Base Case (Most Likely)**
- **Philosophy:** "What we actually expect to happen"
- **Assumptions:** Moderate marketing, proven conversion rates, 1 sales hire
- **Use for:** Budgeting, investor projections, board reporting
- **Outcome:** £542k ARR at Year 3

**Growth (Best Case)**
- **Philosophy:** "What if everything goes right?"
- **Assumptions:** Aggressive marketing, strong product-market fit, 4 sales hires
- **Use for:** Upside scenarios, stretch goals, fundraising optimism
- **Outcome:** £1.47M ARR at Year 3

### When to Use Each Scenario

**Daily planning:** Base Case  
**Board meetings:** Show all three, plan for Base  
**Fundraising:** Present Base, mention upside  
**Budgeting:** Base Case with Conservative contingency  
**Hiring decisions:** Base Case timeline  
**Runway planning:** Conservative (worst case)  

### Switching Scenarios

1. Click the scenario button at the top (turns yellow when active)
2. All charts and numbers update automatically
3. Notice how costs change too (not just revenue!)

**Key differences you'll see:**
- Sales team size (0 → 1 → 4 people)
- Marketing spend (£290 → £1,520 → £4,160)
- Year 3 ARR (£298k → £542k → £1.47M)
- Team costs (1.0x → 1.0x → 1.25x)

---

## 💼 Planning a Fundraise

### Step-by-Step Fundraising Planning

**1. Determine How Much to Raise**

Think about:
- How much runway do you need? (18-24 months typical)
- What milestones will you hit? (ARR goals, product launches)
- How much dilution is acceptable? (<20% is good for seed)

**Default:** £500k seed round

**2. Choose Raise Timing**

Go to: **Raise tab** → Set "Raise Date"

Consider:
- Current cash position (£147.72 = need money soon!)
- When will you run out? (check runway on Overview)
- How long does fundraising take? (3-6 months typically)

**Default:** November 2025 (soon!)

**3. Set Valuation Multiple**

Go to: **Raise tab** → Set "ARR Multiple"

Market rates:
- Pure SaaS: 8-15x ARR
- Marketplace: 2-8x ARR  
- Blended (you): 5-12x ARR

**Default:** 8x (reasonable for seed with traction)

**4. Review Dilution**

Check the 4 boxes:
- **Pre-Money:** Your valuation before raise
- **Post-Money:** Valuation after raise
- **New Shares:** How many shares investors get
- **Dilution:** % founders give up

**Target:** <20% dilution is healthy for seed

**5. Model Investor Returns**

Scroll down to "Investor ROI Calculator"

Set:
- **Exit Multiple:** 12x (typical for successful SaaS)
- **Exit Year:** 5 years (typical for seed → exit)

Results show:
- ARR at exit (grows from Year 3)
- Exit valuation
- Investor payout
- Return multiple (investors want 10x+)

**6. Create Scenarios**

Try different amounts:
- £250k at 8x = 4.9% dilution
- £500k at 8x = 9.6% dilution
- £750k at 8x = 14.3% dilution

**Pro tip:** Model different multiples too. 8x vs 10x makes a big difference!

---

## 📊 Reading the Metrics

### Key Performance Indicators Explained

**ARR (Annual Recurring Revenue)**
- What: Yearly value of all subscriptions
- Why: Main valuation driver for SaaS
- Good: >£500k by Year 3 for seed-stage
- Your number: £542k (Base Case)

**LTV:CAC (Lifetime Value : Customer Acquisition Cost)**
- What: How much a customer is worth vs cost to get them
- Why: Shows unit economics health
- Good: 3-5x is healthy for SaaS
- Your number: 3.1x ✅

**Runway**
- What: Months until cash runs out
- Why: Tells you when to start fundraising
- Good: Want 12+ months after raise
- Your number: Check Overview tab (varies by scenario)

**Payback Period**
- What: Months to recover customer acquisition cost
- Why: Shows how quickly you get to profitability per customer
- Good: <18 months
- Your number: 11 months ✅

**Monthly Churn**
- What: % of customers lost each month
- Why: High churn kills LTV
- Good: <2% monthly (<20% annual)
- Your number: 1.25% monthly (15% annual) ✅

**B2B LTV**
- What: Total revenue from average B2B customer
- Why: Shows customer value
- Good: Depends on price, but want LTV > 3x CAC
- Your number: £3,120 with £1k CAC = 3.1x ✅

---

## 🎯 Common Use Cases

### Use Case 1: Board Meeting Prep

**Goal:** Show business health to board

**Steps:**
1. Open **Overview** tab
2. Select **Base Case** scenario
3. Screenshot the 4 metrics + charts
4. Go to **Unit Economics** 
5. Show LTV:CAC = 3.1x (✅ healthy)
6. Go to **Revenue** → Show Breakdown
7. Walk through B2B funnel (leads → demos → paid)
8. End on **Raise** tab showing seed round plan

**Time:** 5 minutes  
**Story:** "We're tracking to £542k ARR with healthy unit economics (3.1x LTV:CAC). We need to raise £500k this quarter to extend runway to 18 months."

---

### Use Case 2: Investor Pitch

**Goal:** Show financial model to potential investors

**Steps:**
1. Start with **Overview** - show Year 3 ARR target
2. Go to **Revenue** → Show Breakdown
   - Explain three revenue engines
   - Show month 12 numbers
   - Emphasize recurring revenue growth
3. Go to **Unit Economics**
   - Show 3.1x LTV:CAC (✅ healthy)
   - Show 11 month payback (✅ fast)
   - Compare to SaaS benchmarks (all green!)
4. Go to **Raise**
   - Show £500k raise at 8x multiple
   - Show 9.6% dilution
   - Model 5 year exit at 12x = 4.5x investor return
5. Show **Scenarios** tab
   - Conservative: £298k ARR
   - Base: £542k ARR  
   - Growth: £1.47M ARR

**Time:** 10 minutes  
**Story:** "We're building three revenue streams. Base Case projects £542k ARR by Year 3 with healthy 3.1x LTV:CAC. We're raising £500k at 8x ARR multiple, offering 9.6% equity. Conservative exit scenario returns 4.5x to investors in 5 years."

---

### Use Case 3: Hiring Decision

**Goal:** Decide when to hire sales person #2

**Steps:**
1. Go to **Expenses** tab
2. Check **Scenario Cost Comparison**
3. Note: Base Case has 1 sales person, Growth has 4
4. Switch to **Growth** scenario
5. Check when Month 12 costs become sustainable
6. Go to **Revenue** tab
7. See when revenue supports additional headcount
8. Decision: Hire when leads exceed 200/month

**Time:** 5 minutes  
**Story:** "Our current sales person can handle 100 leads/month. When we hit 200 leads/month sustainably, we'll hire #2. Model shows this happens Month 8 in Base Case."

---

### Use Case 4: Pricing Change Analysis

**Goal:** Should we increase B2B prices?

**Steps:**
1. Go to **Scenarios** tab
2. Clone Base Case settings (take notes)
3. Mental note: Current pricing is £39/£119/£279
4. Go to **Unit Economics**
5. Note current LTV: £3,120
6. Consider: 20% price increase would increase LTV 20%
7. New LTV: £3,744
8. New LTV:CAC: 3.7x (vs 3.1x now)
9. Decision: Increase prices if market can bear it

**Time:** 3 minutes  
**Story:** "We're at 3.1x LTV:CAC. A 20% price increase would get us to 3.7x, improving margins without increasing costs. Let's test with new customers."

---

### Use Case 5: Runway Emergency

**Goal:** Oh no, cash is running low!

**Steps:**
1. Check **Overview** → Runway number
2. If <6 months, this is urgent
3. Go to **Raise** tab
4. Model accelerated raise:
   - Increase amount (more runway)
   - Earlier date (ASAP)
   - Maybe accept lower multiple (speed > valuation)
5. Switch to **Conservative** scenario
6. Check when cash depletes
7. Calculate: Raise timeline (3-6mo) + buffer (3mo)
8. Action: Start fundraising when runway = 9 months

**Time:** 2 minutes  
**Story:** "We have 7 months runway in Conservative case. That means start fundraising NOW (3mo process + 3mo buffer = 6mo lead time)."

---

## 💡 Tips & Best Practices

### Do's ✅

**1. Always view Base Case first**
- It's your "most likely" scenario
- Use for planning and budgeting
- Most credible for investors

**2. Check unit economics regularly**
- LTV:CAC should stay >3x
- If it drops, investigate why
- Usually: churn up OR marketing costs up

**3. Model Conservative when planning runway**
- Better to have too much cash than too little
- Use Conservative to decide when to fundraise
- Start fundraising when runway <12mo (Conservative)

**4. Update with actuals monthly**
- Compare projections to reality
- Adjust assumptions if consistently off
- Keep stakeholders updated on variance

**5. Show all three scenarios to investors**
- Demonstrates you've thought about risks
- Shows range of outcomes
- Builds credibility

**6. Use the Raise tab for dilution planning**
- Model different amounts before deciding
- Consider runway vs dilution tradeoff
- More money = longer runway but more dilution

### Don'ts ❌

**1. Don't only show Growth scenario**
- Investors will think you're unrealistic
- You'll over-hire if you budget for Growth
- Massive disappointment if you hit Base instead

**2. Don't ignore the runway warning**
- Red alert box means cash is running low
- Take action immediately
- Start fundraising or cut costs

**3. Don't fundraise based on current cash**
- Look at runway in months, not pounds
- Account for 3-6 month fundraising process
- Add 3 month buffer

**4. Don't change scenarios mid-budget**
- Pick one scenario for annual budget
- Stick to it unless major change
- Switching scenarios mid-year causes confusion

**5. Don't ignore negative cash flow**
- If cash goes negative in any scenario, investigate
- Either: raise more, earlier
- Or: reduce costs
- Or: accelerate revenue

**6. Don't assume linear growth**
- Reality is bumpy (up and down months)
- Model shows smooth growth
- Add contingency for reality

---

## ❓ FAQ

### General Questions

**Q: Why do the numbers look different from our old model?**  
A: v3.0 fixed several calculation errors:
- Churn now calculated correctly (15% annual, not monthly)
- LTV 10x higher due to correct math
- Scenarios now meaningfully different
All changes make the model MORE accurate.

**Q: Which scenario should I use for budgeting?**  
A: Use Base Case for annual budget. Use Conservative for runway planning.

**Q: How often should I update the model?**  
A: Review monthly. Update assumptions quarterly or when major changes occur.

**Q: Can I edit the scenarios?**  
A: Yes! Go to Scenarios tab and adjust any assumption. Your changes save automatically.

---

### Technical Questions

**Q: What's the difference between churn rate and churn annual?**  
A: Churn rate is PER MONTH. Churn annual is PER YEAR.
- 15% annual = 1.25% monthly
- They're connected: monthly = annual / 12

**Q: Why is LTV so much higher now?**  
A: Previous version used annual churn rate incorrectly. Now it's 10x higher because we divide by monthly churn (0.0125) not annual (0.15).

**Q: How is sales headcount calculated?**  
A: Each sales person handles 100 leads/month. Formula: leads / 100 = sales people needed. Founder handles first 100.

**Q: What are collection rates?**  
A: Not all revenue becomes cash. 98% of recurring (2% payment failures) and 90% of transaction (chargebacks, disputes).

**Q: How do tools costs grow?**  
A: Tools have a base cost per year PLUS an annual growth rate:
- Conservative: 0% growth (flat)
- Base: 10% growth
- Growth: 15% growth

---

### Scenario Questions

**Q: Should I ever use Conservative for anything other than runway?**  
A: Yes - use it for:
- Hiring decisions (hire only if profitable in Conservative)
- Long-term contracts (only commit if you can afford in Conservative)
- Downside modeling for investors

**Q: What if we beat Base Case?**  
A: Great! That means you're trending toward Growth scenario. Don't immediately increase spending - wait to confirm the trend is real.

**Q: Can I create my own scenario?**  
A: Not in the current version, but you can edit existing scenarios in the Scenarios tab.

---

### Fundraising Questions

**Q: What's a good ARR multiple for seed stage?**  
A: 5-10x ARR is typical. Higher if:
- Strong growth (>100% YoY)
- Low churn (<10%)
- Great unit economics (LTV:CAC >4x)

**Q: How much dilution is too much?**  
A: For seed: <20% is good, 20-30% is okay, >30% is concerning. You'll need room for Series A dilution too.

**Q: When should I start fundraising?**  
A: Start when runway = 9-12 months (in Conservative scenario):
- 3-6 months to close
- 3 month buffer
- Better safe than sorry

**Q: What exit multiple should I model?**  
A: Depends on exit type:
- Strategic acquisition: 8-15x ARR
- IPO: 10-20x ARR
- Private equity: 6-12x ARR
Use 10-12x for "typical" scenario.

---

### Metrics Questions

**Q: What if my LTV:CAC is below 3x?**  
A: You have three options:
1. Increase prices (raises LTV)
2. Reduce marketing spend (lowers CAC)
3. Improve retention (raises LTV)

**Q: Is 11 month payback good?**  
A: Yes! <18 months is target. You're very healthy.

**Q: What if my churn is higher than 15%?**  
A: This is concerning if annual churn >20%. Focus on:
- Customer success
- Product improvements
- Onboarding experience

**Q: What's the difference between ARR and MRR?**  
A: MRR = Monthly Recurring Revenue
ARR = MRR × 12 (annual value)
Investors care more about ARR.

---

### Advanced Questions

**Q: How do I model a bridge round?**  
A: Change raise amount and date in Raise tab. Model as smaller amount ($250k) at same/lower multiple.

**Q: Can I model multiple rounds?**  
A: Not yet. Current version shows one raise only. Pick your next immediate raise.

**Q: How do I account for seasonality?**  
A: Model doesn't include seasonality. Consider this when comparing actuals to projections. Q4 usually stronger.

**Q: What if we pivot the business model?**  
A: You'll need to adjust assumptions significantly:
- Go to Scenarios tab
- Change conversion rates
- Adjust pricing (need code change)
- Or start with fresh model

---

## 📚 Additional Resources

### Documentation Package
- ✅ This User Guide
- ✅ Implementation Plan (30 pages)
- ✅ Validation Checklist
- ✅ Investor Comparison Doc
- ✅ Deployment Summary

### Support
- Check browser console (F12) for errors
- Review validation checklist if numbers look wrong
- Compare with v2.2 backup if needed

### Improvements for v4.0
Consider requesting:
- Multiple funding rounds
- Seasonality modeling
- Cohort retention analysis
- CSV export
- Sensitivity analysis

---

## 🎓 Becoming a Power User

### Week 1: Learn the Basics
- [ ] Open each tab and understand what it shows
- [ ] Switch between all three scenarios
- [ ] Model a fundraise in the Raise tab
- [ ] Screenshot key metrics

### Week 2: Use It Daily
- [ ] Check Overview tab every morning
- [ ] Review one detailed tab per day
- [ ] Compare projections to actuals
- [ ] Adjust one scenario assumption

### Week 3: Teach Others
- [ ] Walk a teammate through Overview
- [ ] Explain what LTV:CAC means
- [ ] Show how scenarios differ
- [ ] Demo fundraising calculator

### Week 4: Advanced Usage
- [ ] Use for board meeting prep
- [ ] Model a business decision
- [ ] Create investor presentation
- [ ] Update assumptions based on actuals

**After one month, you'll be a financial model expert!** 🎉

---

## 🏆 Conclusion

You now have everything you need to use the NewComma Financial Model v3.0 effectively!

**Remember:**
- Base Case for planning
- Conservative for runway
- Growth for inspiration
- Update monthly with actuals
- Start fundraising early

**Key Metrics to Watch:**
- LTV:CAC >3x ✅
- Payback <18mo ✅
- Churn <20% annual ✅
- Runway >12mo (after raise) ✅

**You're ready to:**
- Present to investors
- Plan your fundraise
- Make hiring decisions
- Model business scenarios
- Report to your board

Good luck building NewComma! 🚀

---

*Questions or feedback? Let us know how we can improve this guide.*

**Version:** 1.0  
**Last Updated:** October 2025  
**Model Version:** 3.0