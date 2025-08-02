# Income Restriction Analysis Guide, South Carolina Multifamily Assets
## Additional Rules & Steps for Multifamily Underwriting in South Carolina

### When Income Restrictions Are Present

#### 1. Unit Mix Segregation
**Rule:** Create separate line items for market-rate vs. income-restricted units

**Implementation Steps:**
- Identify total units by type (1BR, 2BR, etc.)
- Determine which unit types have restrictions
- Split restricted unit types into two categories:
  - Market Rate Units
  - Income-Restricted Units
- Create expanded unit mix table showing both categories

**Example Format:**
```
| Unit Type | Total Units | Market Rate | Income-Restricted | Restricted Rent |
|-----------|-------------|-------------|-------------------|-----------------|
| 1BR       | 230         | 124         | 106              | $869           |
```

#### 2. Revenue Calculations with Restrictions

**Rule:** Calculate gross potential rent using different rates for restricted vs. market units

**Steps:**
1. Market Rate Units: # units × market rent × 12 months
2. Restricted Units: # units × restricted rent × 12 months
3. Sum all unit types for total GPR

**Calculation Format:**
```
1BR Restricted: 106 units × $869 × 12 = $1,105,968
1BR Market: 124 units × $1,088 × 12 = $1,618,944
[Continue for all unit types]
Total GPR = Sum of all categories
```

#### 3. Property Tax Research & Calculation

**Rule:** When requested, research specific jurisdiction tax rates

**Research Steps:**
1. Search for "[City/County] [State] property tax rate commercial property [year]"
2. Identify:
   - Total millage rate on multifamily apartment communities
   - Assessment ratio for multifamily apartment communities
3. Calculate tax burden:
   - Assumed Property Value × Assessment Rate = Assessed Value × Assessment Ratio × Millage Rate
   - Always request

**Example:**
- Property Value: $100,000,000
- Assessment Rate: 26%
- Assessed Value: $26,000,000
- Assessment Ratio: 6%
- Millage Rate: 0.549
- Tax = $26,000,000 × 0.06 × 0.549 = $856,440

#### 4. Multi-Scenario Stabilized Analysis

**Rule:** Create comprehensive comparison showing restricted vs. unrestricted scenarios

**Required Scenarios:**
1. In-Place (T12)
2. Stabilized with Restrictions
3. Stabilized Unrestricted (with property taxes)

**Table Structure:**
```
| Line Item | In-Place | Stabilized w/ Restrictions | Stabilized Unrestricted | Variance |
```

**Key Differences:**
- Unrestricted GPR = All units at market rent
- Unrestricted OpEx = Include calculated property taxes
- Show variance column to highlight trade-offs

#### 5. Net Benefit Analysis

**Rule:** Quantify the economic impact of maintaining restrictions

**Calculation Steps:**
1. Calculate gross rent gain from removing restrictions
2. Calculate property tax burden triggered
3. Calculate net impact (usually negative due to tax burden)

**Format:**
```
Gross Rent Gain: +$277,968
Property Tax Burden: -$856,440
Net Annual Benefit of Restrictions: +$600,710
```

#### 6. Enhanced Metrics Reporting

**Rule:** Include both restricted and unrestricted metrics in summary

**Additional Metrics Required:**
- Stabilized NOI (Unrestricted)
- Implied Cap Rate (Unrestricted)
- Annual Property Tax Savings
- Net Annual Benefit of Restrictions

**Calculation Notes:**
- Implied Cap Rate = NOI ÷ Implied Terminal Value
- Calculate for all NOI scenarios (In-Place, Stabilized w/ Restrictions, Stabilized Unrestricted)

### Documentation Standards

#### Always Document:
1. **Assessment Assumptions**
   - Assessment rate (% of market value)
   - Assessment ratio by property type
   - Source of assessment data

2. **Tax Rate Components**
   - Base millage rate
   - Total millage including all jurisdictions
   - Year of rates being used

3. **Restriction Details**
   - Number and type of restricted units
   - Restriction level (e.g., 50% AMI)
   - Monthly rent for restricted units

4. **Calculation Methodology**
   - Show full formulas with numbers
   - Include step-by-step calculations
   - Label all scenarios clearly

### Summary Formula Reference

**Property Tax Calculation:**
```
Property Tax = Assessed Value × Assessment Ratio × Millage Rate
```

**Net Benefit of Restrictions:**
```
Net Benefit = Property Tax Savings - Revenue Loss from Restrictions
```

**Stabilized NOI Comparison:**
```
NOI (Restricted) = Revenue (w/ restricted rents) - OpEx (no taxes)
NOI (Unrestricted) = Revenue (all market rents) - OpEx (with taxes)
```