# Multifamily Property Underwriting Analysis Template

## Required Documents Checklist
- Trailing 12 Months (T12) Income Statement
- Current Residential Rent Roll
- Commercial Rent Roll (if applicable)
- Market Comparables Report (CoStar, Yardi Matrix, or similar)
- Aged Receivables Report (optional but recommended)
- Property Appraisal (optional if available)

## Analysis Framework

### CRITICAL T12 ANALYSIS RULES

**WARNING: Avoid Double-Counting in T12 Statements**
- Identify Column Structure First: Check if there are subtotal or total columns
- Only Sum Monthly Columns: Typically columns representing Jan-Dec or similar monthly periods
- Exclude Total/Subtotal Columns: Do not include columns labeled "Total", "YTD", "Annual", etc.
- Verify Row Types: Distinguish between detail rows and subtotal/total rows
- Cross-Check Totals: Calculated totals should match reported totals within reasonable rounding

**CRITICAL: Identifying & Handling T12 Anomalies**
- Review EVERY Month for Anomalies:
  - Unusually low/high revenue or expense months
  - Months with $0 or near-zero activity
  - Significant spikes or drops (>25% variance from adjacent months)
  - Missing data or incomplete reporting

- Acceptable Anomalies (Do NOT require adjustment):
  - Real Estate Taxes: Often paid quarterly, semi-annually, or annually
  - Insurance Premiums: Typically paid annually or semi-annually
  - Other known periodic expenses: HOA fees, certain licenses, etc.
  - These create expected "lumpy" patterns and should be annualized normally

- When Anomalies Are Found:
  - FLAG them prominently in the analysis
  - Calculate both "As Reported" and "Adjusted" metrics
  - For adjusted metrics, use shorter periods (T6, T4, T2) excluding anomalous months
  - TERMINOLOGY: Use "Adjusted TX Analysis" NOT "Stabilized TX Analysis"
  - EXPLICITLY STATE when using shortened periods (e.g., "Using Adjusted T6 analysis due to...")
  - EXPLAIN WHY the adjustment was made

- Identify Transition Periods:
  - Note if property appears to be in lease-up
  - Flag if property was recently acquired/changed management
  - Identify stabilization patterns (e.g., "Operations normalized from Month X forward")

- Present Both Views:
  - "T12 As Reported": Full data including anomalies
  - "Adjusted T[X] Analysis": Clean months only
  - Clearly label and explain the difference

- Exceptions for Adjusted Analysis:
  - Real Estate Taxes: ALWAYS use full T12 data (annualized if needed)
  - Insurance: ALWAYS use full T12 data (annualized if needed)
  - These items have naturally lumpy payment patterns throughout the year
  - Using shortened periods would miss critical payments and understate expenses
  - When presenting Adjusted Analysis expenses, note: "Taxes and Insurance based on full T12"

- Flagging Large One-Time Expenses:
  - When encountering anomalies such as large, one-time or otherwise infrequent expenses that represent >3% of total OpEx, these should be flagged for consideration
  - Include these anomalies in the T12 expense burden unless otherwise directed to have them adjusted or removed

### MANDATORY VERIFICATION PROCEDURES

- Cross-Check All Calculations:
  - When summing line items, ALWAYS verify against "Total" rows in the T12
  - If manual sum ≠ reported total, identify and explain the difference
  - Document which total you're using and why

- Revenue Verification:
  - Identify revenue items by NAME, not codes: Look for terms like "Potential Rent", "Market Rent", "Vacancy", "Concessions", "Bad Debt", etc.
  - CHECK SIGNS: Gain/Loss to Lease can be positive OR negative - verify the sign
  - Separate line items: Never combine concessions and bad debt - report separately
  - For IN-PLACE Revenue Analysis: Use T12 reported GPR figures (do not calculate from market rents)
  - Net Rental Income Formula: GPR + Vacancy + Concessions + Bad Debt (all typically negative)
  - Other Income: List ALL components separately, including any bad debt on other income
  - Always reconcile to T12 totals: Your calculated total MUST match the T12 "Total Income" row
  - If totals don't match: List every single revenue line item to find what's missing
  - Show the full calculation: list each component with its actual value
  - Commercial Income: Include all commercial items (rent, CAM, recoveries, etc.)

- Revenue Calculation Structure:
```
RENTAL INCOME:
Gross Potential Rent (from T12)    $X,XXX
+ Vacancy (negative)               $(X,XXX)
+ Concessions (negative)           $(X,XXX)
+ Bad Debt - Rent (negative)       $(X,XXX)
= Net Rental Income                $X,XXX

OTHER INCOME:
[List each item separately]         $X,XXX
- Bad Debt - Other Income          $(X,XXX)
= Total Other Income               $X,XXX

COMMERCIAL INCOME:
[List each item]                   $X,XXX
= Total Commercial Income          $X,XXX

TOTAL INCOME                       $X,XXX
```

Verify this matches T12 reported total!

- MANDATORY: Match T12 Subtotals:
  - DO NOT CREATE YOUR OWN CATEGORIES - use the T12's structure
  - If T12 shows "Other Income" subtotal, match that EXACT total
  - Check what items are included/excluded from each subtotal
  - Common structure variations:
    - Parking may be separate from "Other Income"
    - Internet/Cable may be separate
    - Bad Debt on Other Income may be in rental section
  - ALWAYS VERIFY: Your subtotals MUST match T12 subtotals
  - If they don't match, list every line item to find what's included/excluded
  - State clearly: "Other Income per T12: $XXX (verified)"

- Expense Verification:
  - Identify expenses by CATEGORY NAME: Payroll, Utilities, Maintenance, Insurance, Taxes, etc.
  - Look for common expense categories regardless of coding system
  - Compare to "Total Expenses" row
  - Check for subtotal categories (e.g., "Manager Controlled", "Asset Manager Controlled", "Operating Expenses")
  - Ensure all expense categories are captured

- NOI Verification:
  - Calculate: Total Income - Total Expenses
  - Compare to T12 reported NOI
  - If different, identify why and document

- Documentation Requirements:
  - Show your calculation method (e.g., "8-month expenses per Total Expenses row: $1,027,376")
  - Display full formulas with actual numbers, not just results
  - If discrepancies exist, explain them
  - State which figures are from T12 totals vs. manual calculations
  - For shortened periods (T8, T6, etc.), show the exact months included

### Data Source Hierarchy
When gathering information, use the following priority:
1. Property Data (T12, Rent Roll, Aged Receivables Reports, etc.)
2. Market Comparable Data (when available)
3. Property Offering Memorandums, Appraisals, etc. (when available)

**DO NOT use Industry Standards or Professional Judgment AT ANY TIME**

---

## 1. Property Overview & Current Status

### Property Information to Gather:
- Property Name
- Address & Submarket
- Total Units (verify across all documents)
- Year Built / Renovation Date
- Unit Mix (# and % by bedroom type)
- Average Unit Sizes by Type
- Current Physical Occupancy
- Current Economic Occupancy

### Revenue Analysis Structure:
```
Gross Potential Rent (GPR) - from T12
- Less: Vacancy Loss
- Less: Concessions
- Less: Bad Debt
= Net Rental Income

Plus: Other Income
  - Application/Admin Fees
  - Pet Fees/Rent
  - Amenity/Service Fees
  - Late Fees
  - Other Miscellaneous

Plus: Commercial Income (if applicable)
= Total Effective Income
```

### Key Metrics to Calculate:
- Physical Vacancy Rate = Vacant Units ÷ Total Units
- Economic Occupancy = 1 - (Vacancy Loss ÷ GPR)
- Bad Debt % = Total Bad Debt ÷ Gross Potential Rent
- Other Income Ratio = Other Income ÷ Total Residential Income

### Average Rent Analysis: 
Create table by unit type showing:
- Number of units
- Occupied units
- Average in-place rent
- Average square footage
- Rent per square foot

---

## 2. Operating Expense Analysis

### Expense Categories to Track:
- Payroll & Benefits
- Administrative
- Marketing & Advertising
- Maintenance & Repairs
- Utilities
- Insurance
- Property Taxes
- Management Fees
- Other Operating

### CRITICAL RULE: Missing Expense Categories
When analyzing T12 operating expenses, if common expense categories show $0 or are missing entirely:
- Still include them in the expense table with $0 value
- Add a warning note (⚠️) next to any $0 major expense category
- Common categories that should ALWAYS be shown even if $0:
  * Property Taxes (critical - may indicate exemption or delinquency)
  * Insurance (required by lenders - if $0, major red flag)
  * Management Fees (if $0, may be self-managed)
  * Utilities (if $0, may be tenant-paid)
- Document in notes section why expense might be $0

### T12 Operating Expenses by Category

Present expenses in a detailed breakdown showing both line items and category subtotals:

| Expense Category | Annual Amount | $/Unit | % of Total |
|-----------------|---------------|---------|------------|
| **Payroll & Benefits** | | | |
| Manager | $XXX | $XXX | X.X% |
| Assistant Manager/Office | $XXX | $XXX | X.X% |
| Leasing Personnel | $XXX | $XXX | X.X% |
| Maintenance Supervisor | $XXX | $XXX | X.X% |
| Maintenance Technician | $XXX | $XXX | X.X% |
| Groundskeeper | $XXX | $XXX | X.X% |
| Overtime | $XXX | $XXX | X.X% |
| Payroll Taxes & Benefits | $XXX | $XXX | X.X% |
| **Subtotal Payroll** | **$XXX** | **$XXX** | **XX.X%** |
| | | | |
| **Administrative** | | | |
| Office Supplies | $XXX | $XXX | X.X% |
| Bank Fees | $XXX | $XXX | X.X% |
| Legal Fees | $XXX | $XXX | X.X% |
| Professional Fees | $XXX | $XXX | X.X% |
| **Subtotal Admin** | **$XXX** | **$XXX** | **X.X%** |
| | | | |
| **Marketing** | | | |
| Advertising | $XXX | $XXX | X.X% |
| Marketing/Leasing | $XXX | $XXX | X.X% |
| **Subtotal Marketing** | **$XXX** | **$XXX** | **X.X%** |
| | | | |
| **Utilities** | | | |
| Electric | $XXX | $XXX | X.X% |
| Gas | $XXX | $XXX | X.X% |
| Water/Sewer | $XXX | $XXX | X.X% |
| Trash | $XXX | $XXX | X.X% |
| **Subtotal Utilities** | **$XXX** | **$XXX** | **XX.X%** |
| | | | |
| **Maintenance & Repairs** | | | |
| Unit Turns | $XXX | $XXX | X.X% |
| Supplies | $XXX | $XXX | X.X% |
| Repairs | $XXX | $XXX | X.X% |
| Contracts | $XXX | $XXX | X.X% |
| **Subtotal R&M** | **$XXX** | **$XXX** | **XX.X%** |
| | | | |
| **Insurance** | $XXX | $XXX | XX.X% |
| **Management Fee** | $XXX | $XXX | X.X% |
| **Property Taxes** | $XXX | $XXX | X.X% |
| | | | |
| **Total Operating Expenses** | **$XXX** | **$XXX** | **100.0%** |

**Operating Expense Ratio:** XX.X% of Total Revenue

### Key Metrics:
- Total Operating Expenses
- Operating Expense per Unit
- Operating Expense Ratio = OpEx ÷ Effective Gross Income
- Operating Margin = 1 - (Total Expenses ÷ Total Revenue)

---

## 3. Net Operating Income (NOI)
```
Total Effective Income
- Less: Total Operating Expenses
= Net Operating Income (NOI)
```

---

## 4. Market Rent & Loss to Lease Analysis

### Rent Comparable Selection Criteria:
- Year built: ±10 years OR recently renovated
- Location: Same submarket or similar quality

### Detailed Unit Type Comparison

Organize rent comparables by unit type, showing subject property units first, followed by market comparables:

**One Bedroom Units**

| Property | Distance | Year Built | Unit Count | Avg Size | Avg Rent | $/SF |
|----------|----------|------------|------------|----------|----------|------|
| **Subject - [Size] SF** | Subject | [Year] | [Count] | [Size] | $[Rent] | $[$/SF] |
| [Comp Property] | [X.XX mi] | [Year] | [Count] | [Size] | $[Rent] | $[$/SF] |

**Market Analysis - One Bedroom:**
- Subject Average: $[XXX] ($[X.XX]/SF)
- Market Average: $[XXX] ($[X.XX]/SF)
- **Loss to Lease: $[XXX]/unit ([XX.X]%)**

**Two Bedroom Units**

| Property | Distance | Year Built | Unit Count | Avg Size | Avg Rent | $/SF |
|----------|----------|------------|------------|----------|----------|------|
| **Subject - [Size] SF** | Subject | [Year] | [Count] | [Size] | $[Rent] | $[$/SF] |
| [Comp Property] | [X.XX mi] | [Year] | [Count] | [Size] | $[Rent] | $[$/SF] |

**Market Analysis - Two Bedroom:**
- Subject Average: $[XXX] ($[X.XX]/SF)
- Market Average: $[XXX] ($[X.XX]/SF)
- **Loss to Lease: $[XXX]/unit ([XX.X]%)**

(Continue for all unit types)

### Summary Loss to Lease Analysis

| Unit Type | Units | Current Rent | Market Rent | Loss to Lease | Annual Impact |
|-----------|-------|--------------|-------------|---------------|---------------|
| 1BR | [XXX] | $[XXX] | $[XXX] | $[XXX] | $[XXX,XXX] |
| 2BR | [XXX] | $[XXX] | $[XXX] | $[XXX] | $[XXX,XXX] |
| 3BR | [XXX] | $[XXX] | $[XXX] | $[XXX] | $[XXX,XXX] |
| **Total** | **[XXX]** | | | | **$[XXX,XXX]** |

### Loss to Lease Calculation:
For each unit type:
- Market Rent - In-Place Rent = Loss to Lease ($)
- Loss to Lease % = Loss to Lease ($) ÷ Market Rent
- Annual Impact = Loss to Lease ($) × Number of Units × 12

---

## 5. Sales Comparable Analysis

### Sales Comp Selection Criteria:
- Sale date: Within past 24 months
- Property size: ±50 units from subject
- Year built: ±10 years OR similar quality
- Location: Same market

### Sales Comp Summary Table:
| Property | Units | Sale Date | Price | $/Unit | Cap Rate |
|----------|-------|-----------|-------|---------|----------|

**Note:** Include Cap Rate column only if cap rate data is provided in sales comparables. If not available, exclude this column and note "Cap rate data not provided in sales comparables"

### Key Metrics to Extract:
- Average Price per Unit
- Price per Unit Range (Low/High)
- Average Cap Rate (if available)
- Cap Rate Range (if available)

---

## 6. Stabilized Value Analysis

### Stabilized NOI Projection

**Revenue Assumptions:**
- **Occupancy:** Use the lesser of 95% standard stabilized assumption or market comparable occupancy data (if available). When in doubt, use 95% standard stabilized occupancy unless specified otherwise
- **Market Rents:** Per unit type analysis in Section 4. If market rents are not available, note this in the analysis and use in-place rental data as a placeholder
- **Bad Debt:** If T12 shows bad debt greater than 3% of GPR, use the T12 percentage. If T12 shows bad debt below 3% of GPR, use 3% as standard assumption unless specified otherwise
- **Other Income:** Use historical T12 figures (not calculated as % of revenue)
- **Operating Expenses:** DO NOT MAKE ANY ADJUSTMENTS - use T12 operating expenses as-is

### Revenue Formula Order:
1. Potential/Market Rent ± Gain/Loss to Lease = GPR
2. GPR + Vacancy + Concessions + Bad Debt = Net Rental Income

Note: "Potential/Market Rent" comes from rent comparables and is only relevant for stabilized income calculations, not for understanding in-place T12 revenues.

### In-Place vs. Stabilized Comparison

| Line Item | In-Place (T12) | Stabilized | Variance |
|-----------|----------------|------------|----------|
| **Revenue** | | | |
| Gross Potential Rent | $[XXX,XXX] | $[XXX,XXX] | $[XXX,XXX] |
| Vacancy Loss | $([XXX,XXX]) | $([XXX,XXX]) | $[XXX,XXX] |
| Bad Debt | $([XXX,XXX]) | $([XXX,XXX]) | $[XXX,XXX] |
| Net Rental Revenue | $[XXX,XXX] | $[XXX,XXX] | $[XXX,XXX] |
| Other Income | $[XXX,XXX] | $[XXX,XXX] | $[XXX,XXX] |
| **Total Revenue** | **$[XXX,XXX]** | **$[XXX,XXX]** | **$[XXX,XXX]** |
| | | | |
| **Operating Expenses** | | | |
| Total Operating Expenses | $[XXX,XXX] | $[XXX,XXX] | $0 |
| Management Fee (if % based) | [Note if included above] | [Note if included above] | $0 |
| **Total OpEx** | **$[XXX,XXX]** | **$[XXX,XXX]** | **$0** |
| | | | |
| **Net Operating Income** | **$[XXX,XXX]** | **$[XXX,XXX]** | **$[XXX,XXX]** |

*Note: Include any relevant notes about revenue components. For commercial income, use T12 and/or commercial rent roll unless specifically told otherwise.

**Key Stabilization Metrics:**
- Revenue Growth: [XX.X]%
- Expense Growth: 0.0% (no adjustments made)
- NOI Growth: [XX.X]%
- Stabilized Expense Ratio: [XX.X]%

---

## 7. Purchase Price Recommendation

### Method 1: Sales Comparable Method
- Average $/Unit from Comps × Total Units = Comp-Based Value
- Apply ±10% range based on property condition

### Method 2: Income Approach (In-Place)
- Current NOI ÷ Market Cap Rate = Income-Based Value

### Method 3: Income Approach (Stabilized)
- Stabilized NOI ÷ Market Cap Rate = Stabilized Value

**Note:** If market cap rates are not available from sales comparables, note this limitation.

---

## 8. Key Assumptions & Standards

### Standard Assumptions:
- Stabilized Occupancy: Lesser of 95% or market comparable occupancy
- Bad Debt in Stabilized: Greater of 3% or T12 actual percentage
- Other Income: Always based on T12 reported "Other Income" items specifically (does not scale with stabilized rents)
- Management Fee: 4% of EGI
- Replacement Reserves: Not calculated as part of In-Place or Stabilized NOI
- Insurance: Always based on T12 figures
- Stabilization Period: 12-24 months

### Valuation Rules:
- Always use greater of in-place or market rents for stabilized value
- Cap rates and theoretical sale price per unit should reflect property quality and market conditions
- Provide two terminal valuation estimates – one based on cap rate, and the other based on sales price per unit
- Adjust for property-specific risks (age, location, condition)
- Consider time value for unstabilized properties

---

## 9. Financial Metrics Quick Reference

### Key Investment Metrics Summary

| Metric | Value |
|--------|-------|
| **Property Name** | [Property Name] |
| **Age of Property** | [X years] |
| **Location** | [City, State] |
| **Unit Count** | [XXX] |
| **Average Rent/Unit** | $[X,XXX] |
| **Total In-Place Revenue** | $[X,XXX,XXX] |
| **Total In-Place Expenses** | $[X,XXX,XXX] |
| **Total In-Place NOI** | $[X,XXX,XXX] |
| **In-Place Bad Debt** | $[XXX,XXX] ([X.X]% of GPR) |
| **In-Place Occupancy** | [XX.X]% |
| **Expense Ratio** | [XX.X]% |
| **Stabilized NOI** | $[X,XXX,XXX] |
| **Market Comp Occupancy** | [XX.X]% |
| **Market Comp Sales $/Unit Range** | $[XXX,XXX] - $[XXX,XXX] |
| **Weighted Avg Market Comp $/Unit** | $[XXX,XXX] |
| **Implied Terminal Value** | $[XX,XXX,XXX] |
| **Implied Entry Cap Rate** | [X.X]% |
| **Implied Stabilized Cap Rate** | [X.X]% |

**Notes:**
- Implied Terminal Value = Weighted Avg Market Comp $/Unit × Unit Count
- Implied Entry Cap Rate = In-Place NOI ÷ Implied Terminal Value
- Implied Stabilized Cap Rate = Stabilized NOI ÷ Implied Terminal Value

### Additional Operating Metrics:
- Breakeven Occupancy = Operating Expenses ÷ GPR
- Debt Coverage Ratio = NOI ÷ Annual Debt Service
- Expense Ratio = OpEx ÷ EGI

---

## Data Validation Checklist
□ T12 total revenue matches sum of components  
□ T12 total expenses matches sum of components  
□ Unit count matches Rent Roll  
□ Stabilized expenses match T12 (no adjustments)