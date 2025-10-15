# NewComma Financial Model - Scenarios Playbook

**Real business decisions, step-by-step modeling**

This playbook shows you exactly how to use the financial model for common business decisions. Each scenario includes the business question, how to model it, and how to interpret results.

---

## 📚 Table of Contents

1. [Hiring Decisions](#scenario-1-should-we-hire-a-sales-person)
2. [Pricing Changes](#scenario-2-should-we-increase-prices)
3. [Marketing Budget](#scenario-3-double-marketing-spend)
4. [Runway Planning](#scenario-4-when-do-we-need-to-fundraise)
5. [Burn Reduction](#scenario-5-cut-costs-to-extend-runway)
6. [Feature Investment](#scenario-6-invest-in-marketplace)
7. [Geographic Expansion](#scenario-7-expand-to-us-market)
8. [Acquisition Offer](#scenario-8-should-we-accept-acquisition)
9. [Bridge Round](#scenario-9-need-bridge-financing)
10. [Pivot Planning](#scenario-10-what-if-we-pivot)

---

## Scenario 1: Should We Hire a Sales Person?

### The Business Question
"We're getting 150 leads/month but conversions are low. Should we hire a dedicated sales person or keep founder-led sales?"

### How to Model It

**Step 1: Check Current State (Base Case)**
- Go to **Expenses** tab
- Look at Scenario Cost Comparison
- Base Case shows: 1 sales person at 200 leads/month
- You have: 150 leads (below threshold)

**Step 2: Model the Hire**
- Go to **Scenarios** tab
- Click "Base Case"
- Change "Monthly Leads" from 200 to 150
- Go back to **Expenses**
- Check sales headcount: Should show 0.5 (fractional)

**Step 3: Check Affordability**
- Go to **Overview** tab
- Check "Runway" in Conservative scenario
- If runway >12 months with hire → Can afford
- If runway <12 months → Too risky

**Step 4: Model the Upside**
- Go to **Scenarios** tab
- Increase "Demo → Paid %" by 5%
- (Sales person should improve close rate)
- Check if new B2B MRR justifies cost

### Decision Framework

✅ **Hire if:**
- Runway >12 months in Conservative (with hire cost)
- Close rate improves 5%+ with dedicated sales
- Lead volume trending toward 200/month
- Founder time freed up is worth £2k/month

❌ **Don't hire if:**
- Runway <9 months
- Close rate already >30%
- Lead volume declining
- Can't afford in Conservative scenario

### Expected Impact
- **Cost:** +£2,000/month immediately
- **Revenue:** +£3,000-5,000/month within 3 months
- **Payback:** 4-6 months
- **ROI:** 50-150% within year 1

---

## Scenario 2: Should We Increase Prices?

### The Business Question
"Our competitors charge 20% more. Should we raise our B2B prices from £39/£119/£279 to £47/£143/£335?"

### How to Model It

**Step 1: Understand Current LTV**
- Go to **Unit Economics** tab
- Note current B2B LTV: £3,120
- Note current LTV:CAC: 3.1x

**Step 2: Calculate New LTV**
- Current ARPU: £87/month
- New ARPU: £87 × 1.20 = £104/month
- New LTV: £104 / 0.0125 = £8,320
- (Churn stays same = 0.0125 monthly)

**Step 3: Calculate New LTV:CAC**
- Current CAC: ~£1,000
- New LTV:CAC: £8,320 / £1,000 = 8.3x
- (Assuming CAC stays constant)

**Step 4: Model Conversion Impact**
- Higher prices might reduce conversion
- Go to **Scenarios** tab
- Reduce "Demo → Paid %" by 5%
- (Conservative assumption: fewer close)
- Check if revenue still increases

### Decision Framework

✅ **Increase prices if:**
- LTV:CAC would improve (it does: 3.1x → 8.3x)
- Competitors already charge more
- Value proposition supports it
- Even with 10% conversion drop, revenue up

❌ **Don't increase if:**
- Already losing deals to cheaper competitors
- Feature parity not there yet
- Conversion rate already <20%
- In middle of fundraise (wait until after)

### Expected Impact
- **Revenue:** +15-20% immediately (if 5% conversion drop)
- **LTV:CAC:** 3.1x → 6-8x (if churn stays flat)
- **Risk:** May lose 5-10% of leads
- **Mitigation:** Grandfather existing customers for 6 months

### Implementation Plan
1. Test with new customers only (1 month)
2. Monitor conversion rate
3. If <10% drop, roll out to all
4. Update model with actuals after 3 months

---

## Scenario 3: Should We Double Marketing Spend?

### The Business Question
"We're spending £1,520/month on marketing getting 200 leads. Should we double spend to £3,000/month?"

### How to Model It

**Step 1: Check Current Efficiency**
- Go to **Unit Economics** tab
- Current CAC: ~£1,000
- Current CPL: £1,520 / 200 = £7.60
- Current conversion: 3.75% (lead to paid)

**Step 2: Model Doubled Spend (Optimistic)**
- Go to **Scenarios** tab
- Change "Marketing Budget" to £3,000
- Assume same efficiency: 400 leads
- Go to **Revenue** tab
- Check Month 12 B2B MRR

**Step 3: Model Doubled Spend (Realistic)**
- Marketing rarely scales linearly
- Assume efficiency drops 30%
- £3,000 budget = 350 leads (not 400)
- Change "Monthly Leads" to 350
- Recheck B2B MRR

**Step 4: Check Payback**
- Additional spend: £1,480/month
- Additional revenue: Check increase in B2B MRR
- Payback months: £1,480 / (new MRR - old MRR)

### Decision Framework

✅ **Double marketing if:**
- Current CAC <£1,500 (room to grow)
- Channels not saturated
- Payback <12 months on incremental spend
- Runway supports increased burn

❌ **Don't double if:**
- CAC already >£2,000
- Key channels maxed out
- Runway <12 months
- Conversion rates declining

### Expected Impact
- **Best case:** 400 leads, +£4k MRR, ROI: 2.7x
- **Realistic:** 350 leads, +£3k MRR, ROI: 2.0x
- **Worst case:** 300 leads, +£2k MRR, ROI: 1.4x

### Testing Plan
1. **Month 1:** Add £500 (£2k total)
   - Target: 260 leads
   - If met: Continue
2. **Month 2:** Add another £500 (£2.5k total)
   - Target: 320 leads
   - If met: Continue
3. **Month 3:** Full £3k
   - Monitor efficiency
   - Adjust or maintain

---

## Scenario 4: When Do We Need to Fundraise?

### The Business Question
"We have £5,000 in the bank. When should we start our seed round process?"

### How to Model It

**Step 1: Check Conservative Runway**
- Switch to **Conservative** scenario
- Go to **Overview** tab
- Check "Runway" metric
- Note when cash depletes

**Step 2: Calculate Fundraising Timeline**
```
Typical seed timeline:
- Prep materials: 2-4 weeks
- Outreach & meetings: 8-12 weeks
- Due diligence: 4-6 weeks
- Legal & closing: 2-4 weeks
Total: 16-26 weeks (4-6 months)

Add buffer: +3 months
Start fundraising: Runway - 9 months
```

**Step 3: Model Different Raise Amounts**
- Go to **Raise** tab
- Try £250k, £500k, £750k
- For each, check:
  - Post-raise runway
  - Dilution
  - Milestones achievable

**Step 4: Pick Optimal Amount**
- Want: 18-24 months runway post-raise
- In Base Case scenario
- This gives time to hit next milestones

### Decision Framework

| Current Runway | Action | Urgency |
|----------------|--------|---------|
| <6 months | START NOW | 🔴 Critical |
| 6-9 months | Start prep | 🟡 Urgent |
| 9-12 months | Build pipeline | 🟢 Normal |
| >12 months | Plan & model | ⚪ Future |

### Your Situation
If you have £5,000 cash:
- Conservative burn: ~£4k/month
- Runway: 1.25 months
- **Status: 🔴 CRITICAL**
- **Action: Start TODAY**

### Emergency Playbook
1. **Week 1:** 
   - Cut all non-essential costs
   - Pitch everyone you know
   - Model bridge round (£50-100k)
2. **Week 2:**
   - 20 investor meetings
   - Parallel track: revenue acceleration
   - Consider convertible note
3. **Week 3-4:**
   - Close bridge OR
   - Close customers for cash
   - Extend payables if possible

---

## Scenario 5: Cut Costs to Extend Runway

### The Business Question
"Fundraising is taking longer than expected. We need to extend runway by 3 months. Where do we cut?"

### How to Model It

**Step 1: Identify Current Burn**
- Go to **Expenses** tab
- Conservative scenario
- Note Month 1 total costs: ~£4k

**Step 2: Cost Categories to Cut**
```
Fixed (Can't cut easily):
- Base team salaries: £1,970
- Tools (essential): £1,031
- Outsourced: £900

Variable (Can cut):
- Marketing: £290-£4,160
- Sales: £0-£8,000
- Events: varies

Target: Reduce £1,200-1,500/month
```

**Step 3: Model Cut Scenarios**

**Option A: Cut Marketing 50%**
- Go to **Scenarios** tab
- Reduce marketing from £1,520 → £760
- Check impact on leads and revenue
- Savings: £760/month

**Option B: Defer Sales Hire**
- Reduce "Monthly Leads" to <100
- Sales headcount drops to 0
- Savings: £2,000/month
- Cost: Lower revenue growth

**Option C: Combined Approach**
- Marketing: £1,520 → £1,000 (33% cut)
- Defer sales hire
- Cut events
- Total savings: £2,500+/month

**Step 4: Check New Runway**
- With cuts, new burn: £1,500-2,000/month
- New runway: 3-4 months (from 1.25)
- Enough time to close round

### Decision Framework

**Essential (Keep):**
- Core product team
- Critical tools (hosting, core SaaS)
- Founder salaries (minimum)

**Important (Reduce):**
- Marketing (to profitable channels only)
- Sales (founder-led for now)
- Tools (cancel nice-to-haves)

**Optional (Cut):**
- Events
- Premium tools
- Consultants
- Office perks

### Cost-Cutting Checklist

**Week 1: Quick Wins (-£500-800/mo)**
- [ ] Cancel unused SaaS subscriptions
- [ ] Pause paid advertising
- [ ] Defer non-essential hires
- [ ] Cut event budget to zero

**Week 2: Structural Changes (-£1k-2k/mo)**
- [ ] Reduce marketing to organic only
- [ ] Move to cheaper tools/hosting
- [ ] Renegotiate vendor contracts
- [ ] Defer sales hire

**Week 3: If Needed (-£2k-3k/mo)**
- [ ] Salary deferrals (if team agrees)
- [ ] 4-day work weeks
- [ ] Founder salary cuts
- [ ] Office space reduction

### Impact Analysis

**3-Month Extension:**
- Current runway: 1.25 months
- Target runway: 4.25 months
- Burn reduction needed: £1,500/month
- Revenue impact: -10-15% growth
- **Worth it:** Yes, survival > growth

---

## Scenario 6: Should We Invest in Marketplace?

### The Business Question
"Our marketplace is getting traction. Should we invest £50k to build better features?"

### How to Model It

**Step 1: Check Current Marketplace Revenue**
- Go to **Revenue** tab → Show Breakdown
- Check Month 12:
  - Listing fees: ~£1,800/month
  - Platform fees: ~£2,500/month
  - Total marketplace: ~£4,300/month

**Step 2: Model 2x Marketplace Performance**
- Go to **Scenarios** tab
- Double "Listings Per User" (0.0022 → 0.0044)
- Increase "Listing to Project Rate" (0.50 → 0.60)
- Increase "Marketplace Capture" (0.50 → 0.60)

**Step 3: Check New Revenue**
- Go back to **Revenue** tab
- Check Month 12 marketplace revenue
- Estimate: ~£12k/month (3x increase)
- Annual impact: +£90k

**Step 4: Calculate ROI**
- Investment: £50k
- Incremental revenue: +£90k/year
- Payback: 6.7 months
- 3-year return: £270k (5.4x ROI)

### Decision Framework

✅ **Invest if:**
- ROI >3x within 3 years (✅ we have 5.4x)
- Doesn't kill runway (check Conservative)
- User feedback supports it
- Can staff the build (2-3 months)

❌ **Don't invest if:**
- Runway <9 months after investment
- B2B or Creative segments need help more
- Uncertain if users will pay
- Feature might be pivot-away

### Risk Mitigation

**Test Before Full Build:**
1. **Month 1:** Manual MVP (£5k)
   - Manually match 10 projects
   - Test conversion rates
   - Gather feedback
2. **Month 2:** Small feature (£10k)
   - Build one key feature
   - Test with 50 users
   - Measure impact
3. **Month 3:** Full build (£35k)
   - Only if tests successful
   - Otherwise: pivot or defer

### Expected Impact Timeline

- **Month 1-3:** Build phase, no impact
- **Month 4-6:** Launch, +20% marketplace revenue
- **Month 7-12:** Adoption, +100% marketplace revenue
- **Month 13+:** Steady state, 3x original revenue

---

## Scenario 7: Should We Expand to US Market?

### The Business Question
"UK market is good. Should we expand to US? It'd cost £100k and take 6 months."

### How to Model It

**Step 1: Model Current UK Performance**
- Base Case scenario
- Year 3 ARR: £542k
- This is 100% UK

**Step 2: Estimate US Potential**
```
Assumptions:
- US market 5x UK size
- But harder to break in
- Takes 12 months to match UK traction
- Costs £100k upfront + £5k/month

Conservative: US = 50% of UK revenue by Year 3
Realistic: US = 100% of UK revenue by Year 3
Optimistic: US = 200% of UK revenue by Year 3
```

**Step 3: Model in Scenarios**
- Can't directly model this (feature request!)
- Manual calculation:
  - Base Case Year 3: £542k UK
  - + US conservative: £271k
  - Total: £813k ARR
  - Investment: £100k + (£5k × 24) = £220k
  - Net benefit: £593k - £542k = £51k
  - ROI: 23% (meh)

**Step 4: Check Runway Impact**
- £100k upfront + £5k/month burn increase
- Go to **Raise** tab
- Would need to raise £100k+ more
- Or defer 5-6 months

### Decision Framework

✅ **Expand to US if:**
- UK product-market fit proven (✅)
- Can raise extra £200k for expansion
- Founder has US connections
- Competitors not entrenched
- 18+ months runway in Conservative

❌ **Don't expand if:**
- UK not yet proven (<£500k ARR)
- Can't raise expansion capital
- No US go-to-market advantage
- Runway <18 months
- Better opportunities in UK first

### Alternative: Staged Approach

**Phase 1: Test (£10k, 2 months)**
- Founder visits US
- 50 customer interviews
- Test pricing/positioning
- Sell 5 pilot customers
- **Go/No-Go decision**

**Phase 2: Beachhead (£40k, 6 months)**
- Hire US-based sales contractor
- Set up US entity
- Target one city (SF or NYC)
- Get to 20 customers
- **Go/No-Go decision**

**Phase 3: Scale (£100k+, 12 months)**
- Hire full US team
- Multi-city expansion
- Full marketing push

### Risk-Adjusted Recommendation

**Not yet.** Here's why:
- UK ARR <£500k (want £1M+ first)
- Runway concerns (need 18mo+)
- Better ROI from UK optimization
- Can revisit in 12-18 months

**Better alternative:**
- Double down on UK
- Get to £1M ARR
- Use that traction to raise Series A
- Then expand to US properly funded

---

## Scenario 8: Should We Accept Acquisition Offer?

### The Business Question
"Competitor offered £5M to acquire us. Should we sell or keep building?"

### How to Model It

**Step 1: Calculate Current Value**
- Base Case Year 3 ARR: £542k
- At 8x multiple: £4.3M valuation
- Offer: £5M (16% premium)
- Sounds good! But...

**Step 2: Model If We Keep Building**
- Go to **Raise** tab
- Set Exit Year: 5
- Set Exit Multiple: 12x
- Check projected ARR at Year 5
- Calculate exit valuation

**Step 3: Calculate Your Take-Home**

**If Sell Now:**
```
Offer: £5M
Your ownership: 92.2% (founders + team)
Your take: £4.6M
Immediate cash: ✅
Risk: Zero
```

**If Keep Building (Base Case):**
```
Year 5 ARR: ~£900k (projected)
Exit multiple: 12x
Exit valuation: £10.8M
After dilution (Series A): Your 65% = £7M
Risk: Medium
Timeline: 5 years
```

**If Keep Building (Growth Case):**
```
Year 5 ARR: ~£3M (projected)
Exit multiple: 15x
Exit valuation: £45M
After dilution: Your 50% = £22.5M
Risk: High
Timeline: 5 years
```

**Step 4: Calculate Risk-Adjusted Return**
```
Sell now: £4.6M @ 100% probability = £4.6M
Keep building Base: £7M @ 50% probability = £3.5M
Keep building Growth: £22.5M @ 20% probability = £4.5M

Risk-adjusted: Keep building ≈ Sell now
```

### Decision Framework

✅ **Sell if:**
- You're tired/burned out
- Acquirer is perfect strategic fit
- Offer is >2x current valuation
- You have better ideas/ventures
- Team wants to sell

❌ **Don't sell if:**
- You're excited about the mission
- Offer <1.5x valuation
- You think you can 5x in 5 years
- Acquirer might kill the product
- You'd regret it

### The Founder Question

Ask yourself honestly:
1. **Energy:** Do you have 5 more years in you?
2. **Belief:** Can we really 10x from here?
3. **Opportunity cost:** What else could you do with £4.6M?
4. **Team:** Do they want to sell?
5. **Mission:** Does this serve NewComma's purpose?

### Negotiation Playbook

**If you're considering it:**

1. **Counter at £7M** (show your model)
   - Based on Growth case projections
   - 5-year earn-out component
   - Key employee retention

2. **Structure matters:**
   - £5M all-cash = good
   - £3M cash + £2M earn-out = maybe
   - £2M cash + £3M stock = risky

3. **Ask for:**
   - Employment contracts (2 years)
   - Product autonomy
   - Team retention bonuses
   - Accelerated vesting

---

## Scenario 9: Need Bridge Financing

### The Business Question
"Our seed round is taking too long. We need £100k bridge to get to close. How do we structure it?"

### How to Model It

**Step 1: Check Runway Gap**
- Go to **Overview** → Conservative
- Current runway: 2 months
- Time to seed close: 4 months
- Gap: 2 months = £8k
- With buffer: Need £12k minimum
- But asked for £100k (smart: extra runway)

**Step 2: Model Bridge Impact**
- Go to **Raise** tab
- Change raise amount: £100k
- Change raise date: This month
- Check new runway
- Should extend 2-3 months

**Step 3: Structure Options**

**Option A: Convertible Note (Standard)**
```
Amount: £100k
Discount: 20% (converts at 80% of next round)
Cap: £5M valuation cap
Interest: 5% annual

Scenario: Seed at £6M post
Converts at: £4.8M (20% discount)
Effective dilution: 2.08%
```

**Option B: SAFE (Simpler)**
```
Amount: £100k
Discount: 15%
Cap: £4.5M valuation cap
No interest, no maturity

Converts at lower of:
- Seed round valuation with 15% discount
- £4.5M cap
```

**Option C: Equity (Clean)**
```
Amount: £100k
Valuation: £4M post-money
Immediate dilution: 2.5%
No conversion complications
```

**Step 4: Model Total Dilution**
```
Current ownership: 100%
After bridge (SAFE at £4.5M cap): -2.22%
After seed (£500k at £5M post): -10%
Total dilution: -12.22%
Your stake: 87.78%
```

### Decision Framework

**Best structure:**
1. **SAFE** - if investor is founder-friendly
2. **Convertible** - if standard investor
3. **Equity** - if very desperate (avoid if possible)

**Terms to negotiate:**
- Discount: 15-25% (you want lower)
- Cap: £4-6M (you want higher)
- Pro-rata rights: No (avoid if possible)
- Board seat: No (it's just bridge!)

### Bridge Raise Playbook

**Week 1: Friendly Money**
- Existing investors (best option)
- Friends and family
- Entrepreneur friends
- Target: £25-50k

**Week 2: Angels**
- Local angel network
- Industry angels
- Warm intros only
- Target: £50-100k

**Week 3: Close**
- Don't wait for full £100k
- Close £75k if you can
- Get back to seed raise
- 
### Success Metrics

**Good bridge raise:**
- Closes in <2 weeks
- <25% discount
- No board seat
- No excessive terms
- From people who add value

**Bad bridge raise:**
- Takes >4 weeks (defeats purpose)
- >30% discount
- Excessive pro-rata or other terms
- From difficult investors
- Multiple small checks

---

## Scenario 10: What If We Pivot?

### The Business Question
"B2B is working better than creative. Should we pivot to B2B only?"

### How to Model It

**Step 1: Current Revenue Mix**
- Go to **Revenue** tab → Show Breakdown
- Month 12 revenue:
  - Creative: £6,150/month
  - B2B: £3,900/month
  - Marketplace: £4,300/month
  - Total: £14,350/month

**Step 2: Model B2B-Only**
- Can't directly model (feature request)
- Manual calculation:
```
If B2B only:
- Cut creative features: Save £500/month tools
- Cut marketplace features: Save £300/month
- Refocus team: No savings (need same devs)
- Increase B2B marketing: +£1,000/month
- Expected: 2x B2B growth

New B2B MRR: £7,800/month
Lost Creative: -£6,150/month
Lost Marketplace: -£4,300/month
Net change: -£2,650/month (worse!)
```

**Step 3: But Consider 3-Year Impact**
```
Multi-product (current):
- Harder to scale
- Confused positioning
- Year 3: £542k ARR across 3 products

B2B-focused:
- Clear message
- Faster iteration
- Year 3: Potentially £800k+ B2B ARR

Key question: Can we really 3x B2B?
```

**Step 4: Model Different Scenarios**

**Scenario A: Gradual Transition**
- Keep creative free (lead gen for B2B)
- Keep marketplace (differentiation)
- Focus 80% resources on B2B
- Model: Increase B2B marketing to £3k

**Scenario B: Hard Pivot**
- Sunset creative paid tiers
- Keep basic marketplace
- All-in on B2B
- Model: All marketing to B2B

**Scenario C: Stay Multi-Product**
- Current strategy
- Risk: Never #1 in any category
- Benefit: Multiple revenue streams

### Decision Framework

✅ **Pivot to B2B if:**
- B2B growing >50% faster
- Creative churn >25% annual
- Clear B2B product-market fit
- Investors prefer B2B story
- Team excited about B2B

❌ **Stay multi-product if:**
- All three growing steadily
- Creative builds brand
- Marketplace is differentiator
- No clear winner yet
- < 12 months of data

### Testing Before Full Pivot

**Month 1-2: Test**
- Shift 80% marketing to B2B
- See if B2B grows 2x
- Keep other products alive
- Gather data

**Month 3: Decide**
- If B2B doubled: Consider pivot
- If B2B +50%: Stay multi-product
- If B2B flat: Problem isn't product mix

### The Real Question

**It's not about which product.**  
**It's about:**
1. Product-market fit strength
2. Market size opportunity
3. Competitive advantage
4. Team passion/expertise
5. Investor appetite

**Recommendation:**
Don't pivot yet. Give it 6 more months of focused B2B sales. If B2B isn't 2x creative by then, reconsider.

---

## 🎓 Key Lessons from These Scenarios

### Pattern Recognition

**Most decisions come down to:**
1. **Runway:** Do we have time to try this?
2. **ROI:** Will this pay back in <12 months?
3. **Risk:** What if it doesn't work?
4. **Reversibility:** Can we undo this decision?

### Decision Framework

```
High Impact + Low Risk = DO IT NOW
High Impact + High Risk = TEST FIRST
Low Impact + Low Risk = DO IF EASY
Low Impact + High Risk = DON'T DO
```

### Use the Model

**Before any decision:**
1. Model it in the financial model
2. Check all three scenarios
3. Focus on Conservative for risk
4. Check runway impact
5. Calculate payback period

**The model won't make decisions for you.**  
**But it'll show you the numbers to make better ones.**

---

## 📋 Scenario Template

**Use this for any decision:**

### 1. What's the Question?
[Business decision you need to make]

### 2. Current State
- Go to [relevant tab]
- Note current metrics
- Which scenario are you in?

### 3. Model the Change
- Go to [Scenarios tab or relevant section]
- Change [specific inputs]
- Check [relevant outputs]

### 4. Calculate Impact
- Financial: [revenue, costs, runway]
- Strategic: [positioning, focus]
- Team: [morale, bandwidth]

### 5. Decision Framework
- Do if: [conditions]
- Don't if: [conditions]
- Test first if: [conditions]

### 6. Implementation
- Timeline: [weeks/months]
- Resources: [people, money]
- Success metrics: [how to measure]

---

**Keep using the model for every major decision. The more you use it, the better your business judgment becomes!**

---

**Version:** 1.0  
**Updated:** October 2025  
**For:** NewComma Financial Model v3.0