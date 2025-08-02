# Stage 1: Initial Intake Specification

## Purpose
First contact screening to validate incoming LIHTC preservation deals and determine if they meet Domos' basic investment criteria before allocating significant analysis resources.

## Stage Objectives
- **Filter out** deals that clearly don't fit our strategy
- **Capture essential** deal information for tracking and validation
- **Validate data completeness** and quality for downstream analysis
- **Route qualified deals** to preliminary analysis
- **Maintain relationships** with quality deal sources

## Required Information

### Deal Source Information
- [ ] **Source Type**: Broker, Seller Direct, Internal Origination, Referral
- [ ] **Contact Information**: Name, company, phone, email
- [ ] **Source Relationship**: First-time vs repeat, track record
- [ ] **Urgency/Timeline**: When does seller need response?

### Core Property Information
- [ ] **Property Name**: Clear, unique identifier
- [ ] **Address**: Full street address including city, state, ZIP
- [ ] **Unit Count**: Total units and bedroom mix breakdown
- [ ] **Asset Class**: Multifamily (garden, mid-rise, high-rise, townhomes)
- [ ] **Year Built**: Construction year for age assessment
- [ ] **Property Type Details**: Garden, mid-rise, high-rise, townhomes

### Deal Structure Information
- [ ] **Asking Price**: Total acquisition cost
- [ ] **Price per Unit**: Basic efficiency metric
- [ ] **Deal Size Category**: <$10M, $10-50M, >$50M
- [ ] **Expected Closing**: Timeline pressure assessment

### Financial Data Requirements
- [ ] **Current Rents**: By unit type (1BR, 2BR, 3BR, etc.)
- [ ] **Operating Statement**: Last 12 months (T12) if available
- [ ] **Rent Roll**: Current tenant list with rents and lease terms
- [ ] **Capital Needs Assessment**: Major repairs/improvements needed (if known)

### LIHTC Compliance Information
- [ ] **Current LIHTC Status**: Yes/No/Unknown - Currently under LIHTC program
- [ ] **Compliance Period**: Years remaining in affordability period
- [ ] **AMI Restrictions**: Percentage of Area Median Income limits
- [ ] **Affordability Expiration**: Exact date when restrictions end
- [ ] **Current Compliance**: Any violations or issues
- [ ] **Preservation Opportunity**: Why now?

## Screening Criteria

### Geographic Requirements
✅ **PASS**: Target markets (Columbus, Cincinnati, Cleveland, Indianapolis, etc.)
❌ **FAIL**: Outside target markets or markets we don't understand

### Asset Class Requirements  
✅ **PASS**: Multifamily 50+ units, garden/mid-rise/high-rise
❌ **FAIL**: Single family, commercial, mixed-use, manufactured housing

### Deal Size Requirements
✅ **PASS**: $5M - $100M total deal size
❌ **FAIL**: <$5M (too small) or >$100M (too large for current capacity)

### LIHTC/Mission Alignment
✅ **PASS**: Current or former LIHTC, other affordable housing
✅ **CONDITIONAL**: Market rate with conversion potential
❌ **FAIL**: Luxury housing with no affordable component

### Basic Financial Screening
✅ **PASS**: Price per unit $30k - $200k (varies by market)
❌ **FAIL**: Outside reasonable price per unit range for market

## Analysis Process

### Step 1: Initial Contact & Data Collection (Same Day)
1. Log deal in CRM/pipeline system
2. Acknowledge receipt to source
3. Request basic information if missing

### Step 2: Data Completeness Check (Within 24 Hours)
Calculate completeness score based on required elements:
- Critical elements missing = REJECT
- 80%+ complete = PROCEED to screening
- 60-79% complete = REQUEST_MORE_INFO
- <60% complete = REJECT

### Step 3: Basic Financial Screening
Calculate initial metrics:
```
Price Per Unit = Asking Price / Total Units
Gross Rent Multiplier = Asking Price / (Annual Gross Rent) [if rent data available]
Average Rent = Total Monthly Rent / Total Units [if rent roll available]
```

### Step 4: Strategic Screening Criteria
1. **Market check**: Is this a target market?
2. **Asset class check**: Does this fit our focus?
3. **Size check**: Can we handle this deal size?
4. **Mission check**: Any affordable housing angle?

### Step 5: LIHTC Preservation Eligibility
- Must be currently LIHTC property or have clear affordable housing component
- Must have 2+ years remaining in compliance period (if LIHTC)
- Should be approaching end of affordability (within 10 years ideal)

### Step 6: Market Reasonableness Assessment
- Price per unit should be within market range ($30k-$200k)
- GRM should be reasonable (8-20x range if data available)
- Current rents should be reasonable for market

### Step 7: Decision & Communication (Within 48 Hours)
1. Make advance/reject/request more info decision
2. Communicate decision to deal source
3. If advancing: assign to analyst for preliminary analysis
4. Update CRM with decision and rationale

## Decision Criteria

### ADVANCE TO PRELIMINARY ANALYSIS
Requirements:
- [ ] All basic screening criteria met
- [ ] Data completeness score ≥80%
- [ ] Deal source is responsive and professional
- [ ] Timeline allows for proper underwriting
- [ ] Fits within current pipeline capacity
- [ ] All critical data elements present
- [ ] LIHTC property with 2+ years remaining OR clear affordable housing component
- [ ] Financial metrics in reasonable ranges
- [ ] Clear preservation opportunity

### POLITE REJECTION
Reasons:
- [ ] Outside target geography or asset class
- [ ] Deal size outside parameters
- [ ] No affordable housing angle
- [ ] Price obviously too high/low for market
- [ ] Not currently LIHTC property (unless exceptional circumstances)
- [ ] Less than 2 years compliance remaining
- [ ] Price per unit >$200k or <$30k
- [ ] Major data gaps with unresponsive seller

### REQUEST MORE INFORMATION
When:
- [ ] Close to criteria but missing key details
- [ ] Good relationship with source, worth exploring
- [ ] Unique deal that might warrant exception
- [ ] Minor data gaps that could be filled (60-79% completeness)
- [ ] Unclear LIHTC status or compliance period
- [ ] Reasonable financial metrics but need validation
- [ ] Seller responsive and willing to provide additional info

## Output Format

Create `stage-1-intake-analysis.json`:

```json
{
  "dealId": "string",
  "timestamp": "ISO-8601",
  "stage": "1",
  "stageName": "Initial Intake",
  "source": {
    "type": "BROKER|SELLER_DIRECT|INTERNAL|REFERRAL",
    "contact": "string",
    "relationship": "FIRST_TIME|REPEAT|PREFERRED",
    "urgency": "LOW|MEDIUM|HIGH"
  },
  "completenessScore": 0-100,
  "basicInfo": {
    "propertyName": "string",
    "address": "string",
    "unitCount": "number",
    "askingPrice": "number",
    "pricePerUnit": "number"
  },
  "basicMetrics": {
    "pricePerUnit": "number",
    "grossRentMultiplier": "number|null",
    "averageRent": "number|null",
    "totalUnits": "number"
  },
  "lihtcStatus": {
    "currentlyLIHTC": "boolean",
    "yearsRemaining": "number|null",
    "amiRestriction": "number|null",
    "complianceIssues": "string[]"
  },
  "screeningResults": {
    "geography": "PASS|FAIL",
    "assetClass": "PASS|FAIL", 
    "dealSize": "PASS|FAIL",
    "missionAlignment": "PASS|CONDITIONAL|FAIL",
    "basicFinancials": "PASS|FAIL",
    "dataCompleteness": "PASS|PARTIAL|FAIL"
  },
  "missingElements": "string[]",
  "redFlags": "string[]",
  "decision": "ADVANCE|REJECT|REQUEST_MORE_INFO",
  "recommendation": "ADVANCE|REJECT|REQUEST_MORE_INFO",
  "reasoning": "string",
  "nextSteps": "string[]",
  "assignedAnalyst": "string|null",
  "priorityLevel": "LOW|MEDIUM|HIGH"
}
```

## Quality Control

### Response Time Targets
- **Acknowledgment**: Same day
- **Decision**: Within 48 hours
- **Communication**: Professional and timely

### Validation Checks
- All monetary values are positive numbers
- Dates are valid and in future (for compliance expiration)
- Unit counts add up correctly
- Percentages are between 0-100

### Common Issues to Flag
- Asking price significantly above/below market comparables
- Rent roll dates older than 30 days
- Operating statement not recent (>90 days old)
- Missing critical compliance documentation
- Seller urgency that might indicate problems

### Relationship Management
- Maintain positive relationships even with rejected deals
- Provide brief, honest feedback when possible
- Track source quality for future prioritization

### Pipeline Management
- Don't advance more deals than team can handle
- Balance deal quality with source relationships
- Consider market timing and competition

## Success Metrics
- **Pass Rate**: 60-80% of deals should advance (too high = not selective enough)
- **Completion Rate**: 95%+ of ADVANCE recommendations should complete full analysis successfully
- **Efficiency**: <5% of deals should require re-work due to inadequate initial screening
- **Source Satisfaction**: Maintain good relationships with quality sources
- **Pipeline Flow**: Steady flow to preliminary analysis without overwhelming team
- **False Positives**: <10% of advanced deals should fail basic preliminary analysis

## Notes for Agent Processing
- Be conservative but not dismissive in initial screening
- Better to request more info than proceed with gaps
- When in doubt, request more information rather than reject
- Consider source relationship in borderline decisions
- Document all assumptions made during analysis
- Flag any data inconsistencies between documents
- Consider market context (urban vs suburban, geographic region)
- Pay special attention to compliance timeline - this drives investment urgency
- Flag any deals that might be exceptions to standard criteria

## Transparency Requirements
All decisions must include:
- **Decision Summary**: Plain-language rationale for decision
- **Input Trace**: Source documents and variables used in analysis
- **Benchmark Context**: How deal compares to typical submissions
- **Anomaly Flags**: Any unusual conditions or data points identified

---

*This specification consolidates the intake validation process into a single, comprehensive stage that captures deal source information, validates data completeness, performs strategic screening, and routes qualified deals to preliminary analysis while maintaining strong relationships with deal sources.*
