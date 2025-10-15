# NewComma Financial Model v3.0 - Validation Checklist

## ✅ Pre-Deployment Validation

### Quick Visual Test (2 mins)
Open the model and verify:
- [ ] **Header shows:** "NewComma Financial Model v3.0"
- [ ] **Subtitle shows:** "✅ Fixed: Churn calculations, client distribution, scenario parameters, exit ROI"
- [ ] **Cash position alert visible** (amber box with £147.72 message)
- [ ] **All 7 tabs render:** Overview, Revenue, Expenses, Unit Economics, Raise, Cap Table, Scenarios
- [ ] **No console errors** (press F12 to check)

---

## 🔍 Critical Metrics Validation (10 mins)

### Test 1: Base Case Unit Economics (Month 12)
**Expected Results:**
- [ ] **LTV:CAC Ratio:** ~3.1x (not 0.3x!) ✅
- [ ] **B2B LTV:** ~£3,120 (not £312!) ✅
- [ ] **CAC Payback:** ~11 months ✅
- [ ] **Pro Members:** ~615 (not ~800) ✅
- [ ] **Sales Headcount:** 1 person (not 0.5) ✅

**How to check:**
1. Select "Base Case" scenario
2. Go to "Unit Economics" tab
3. Check the 3 metric cards at top
4. Go to "Revenue" → Toggle "Show Revenue Breakdown"
5. Look at Month 12 numbers in the funnel boxes

---

### Test 2: Churn Rate Display
**Navigate to:** Revenue → Show Revenue Breakdown → Creative Memberships box

**Expected to see:**
- [ ] Monthly Churn: **1.25%** (10% annual)
- [ ] NOT showing 10% monthly

**Navigate to:** Revenue → Show Revenue Breakdown → B2B box

**Expected to see:**
- [ ] Monthly B2B Churn: **1.25%** (15% annual)

---

### Test 3: Scenario Cost Differences
**Navigate to:** Expenses tab → Scenario Cost Comparison

**Expected:**
- [ ] **Conservative:** 50 leads, 0 sales people, 1.0x team multiplier
- [ ] **Base Case:** 200 leads, 1 sales person, 1.0x team multiplier
- [ ] **Growth:** 500 leads, 4 sales people, 1.25x team multiplier

**All three should show DIFFERENT Month 12 costs**

---

### Test 4: Exit Year Calculation
**Navigate to:** Raise tab → Investor ROI Calculator

**Test:**
1. Set "Exit Year" to **3**
2. Check "ARR at Exit" equals "Year 3 ARR" from Overview (~£542k for Base Case)
3. Set "Exit Year" to **5**
4. Check "ARR at Exit" is HIGHER than Year 3 ARR (should be ~£800k-900k)
5. Verify "Exit Year" shows: **5y** (not 60 or 24)

✅ If exit year 5 shows higher ARR than year 3, calculation is correct!

---

### Test 5: Client Distribution (Advanced)
**Navigate to:** Revenue → Show Revenue Breakdown → B2B Funnel

**Month 12, Base Case:**
- New B2B clients: ~7-8 per month
- Distribution should be: 4 Starter, 3 Growth, 0-1 Scale
- **Sum should equal total** (no off-by-one errors)

---

## 🎨 UI/UX Validation (5 mins)

### Visual Check
- [ ] All charts render without errors
- [ ] Scenario switcher buttons work (yellow highlight on active)
- [ ] Numbers update when changing scenarios
- [ ] Raise calculator updates when changing amount
- [ ] No broken layouts on mobile (if testing)

### Interaction Check
- [ ] Can type in all input fields
- [ ] Dropdowns work (Raise Date, etc.)
- [ ] Tabs switch correctly
- [ ] "Show/Hide Revenue Breakdown" button works
- [ ] Hover tooltips on charts work

---

## 📊 Data Comparison (If you have v2.2)

### Key Changes to Expect

| Metric | v2.2 | v3.0 | Status |
|--------|------|------|--------|
| **Month 12 Pro Members** | ~800 | ~615 | ✅ More realistic |
| **B2B LTV** | £312 | £3,120 | ✅ Fixed calculation |
| **LTV:CAC** | 0.31x | 3.1x | ✅ Now healthy |
| **Year 3 ARR** | ~£564k | ~£542k | ✅ More conservative |
| **Sales Headcount (Base)** | 0.5 | 1 | ✅ Capacity-based |

**If numbers match these patterns, fixes are working! ✅**

---

## 🚨 Red Flags (Stop if you see these)

### Immediate Issues:
- ❌ Console shows errors
- ❌ Charts don't render
- ❌ LTV:CAC still shows 0.3x
- ❌ Numbers show NaN or Infinity
- ❌ Client counts don't sum correctly
- ❌ All scenarios show identical costs

### If you see red flags:
1. Check browser console for specific error
2. Compare with backup v2.2
3. Review implementation checklist
4. Check that helper functions are at top of file

---

## ✨ Success Indicators

### You're ready to deploy if:
- ✅ All visual tests pass
- ✅ LTV:CAC shows ~3x
- ✅ Churn shows monthly AND annual rates
- ✅ Scenarios show different costs
- ✅ Exit year 5 > exit year 3
- ✅ No console errors
- ✅ Numbers look reasonable (no NaN, no negatives where impossible)

---

## 📋 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Export Base Case to CSV for records
- [ ] Update pitch deck with new numbers
- [ ] Take screenshots of key metrics
- [ ] Send team notification email

### Week 1
- [ ] Monitor for any user-reported issues
- [ ] Validate with real scenario tweaking
- [ ] Compare against actuals (if available)
- [ ] Document any edge cases found

### Week 2
- [ ] Gather team feedback
- [ ] Update investor materials
- [ ] Archive v2.2 backup (keep for reference)

---

## 🎯 Quick Reference: What Changed

### Fixed ✅
1. **Churn:** 15% annual = 1.25% monthly (not 15% monthly!)
2. **Client Distribution:** Always sums correctly (no rounding errors)
3. **LTV Calculation:** Uses monthly churn rate (10x improvement)
4. **Scenario Costs:** Actually differ meaningfully
5. **Sales Headcount:** Scales with lead volume
6. **Tools Costs:** Compound with growth rate
7. **Exit Year:** From today, not from month 36

### Added ✅
- Helper functions (churn conversion, client distribution)
- Collection rate constants
- Cash position alert
- Monthly churn rate displays
- Team growth multipliers
- Exit year clarity

### Maintained ✅
- All historical data
- Revenue model logic
- Pricing structure
- UI/UX (no breaking changes)

---

## 📞 Support

**If validation fails:**
1. Check this checklist again
2. Review browser console
3. Compare with v2.2 backup
4. Check helper functions are present

**If all checks pass:**
🎉 **You're ready to deploy v3.0!**

---

## 📝 Sign-Off

**Validated by:** _______________  
**Date:** _______________  
**Time spent:** _______________  
**Issues found:** _______________  
**Ready for deployment:** ☐ Yes ☐ No

---

*Keep this checklist for future reference and for validating any future model updates.*