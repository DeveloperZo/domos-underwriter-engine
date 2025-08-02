# LIHTC Compliance Specification

## Purpose
Ensure comprehensive compliance analysis for LIHTC preservation deals to identify regulatory risks and preservation requirements.

## Compliance Framework

### Core LIHTC Requirements
1. **Affordability Restrictions** - Rent and income limits
2. **Compliance Period** - Initial 15-year and extended use
3. **Physical Standards** - Property condition requirements
4. **Reporting & Monitoring** - Annual compliance submissions
5. **Qualified Allocation Plan (QAP)** - State-specific requirements

## Analysis Process

### Step 1: LIHTC Status Verification

#### Current Program Status
- Verify active LIHTC status with state housing finance agency
- Confirm compliance with all program requirements
- Review any past compliance violations or corrective actions
- Check status of annual compliance monitoring reports

#### Affordability Period Analysis
```
Key Dates to Identify:
- Original placed-in-service date
- Initial 15-year compliance period end
- Extended use agreement (LURA) expiration
- Qualified contract period eligibility
- Right of first refusal periods
```

### Step 2: Rent and Income Compliance

#### Rent Restriction Analysis
- Compare current rents to maximum allowable LIHTC rents
- Verify unit mix meets LIHTC set-aside requirements (20/50 or 40/60)
- Check compliance with average income test if applicable
- Analyze rent increase history for compliance patterns

#### Income Certification Review
- Review tenant income certifications for accuracy
- Check annual recertification compliance
- Verify student rule compliance
- Assess over-income tenant management

#### Current Compliance Metrics
```
Calculate Key Ratios:
- % of units at LIHTC rents vs market rents
- Average income as % of AMI by unit type
- Compliance margin (buffer before violation)
- Historical violation frequency
```

### Step 3: Physical Condition Compliance

#### Housing Quality Standards (HQS)
- Review recent physical inspections
- Identify any habitability issues
- Check compliance with local housing codes
- Assess accessibility compliance (ADA/504)

#### Capital Improvements Impact
- Evaluate if planned improvements maintain affordability
- Ensure improvements don't exceed reasonable rent increase thresholds
- Verify improvements comply with LIHTC requirements
- Check for any restrictions on unit modifications

### Step 4: Preservation Timeline Analysis

#### Critical Compliance Dates
- Years remaining in extended use period
- Qualified contract eligibility timeline
- Right of first refusal notification periods
- Market study requirements for rent increases

#### Preservation Strategy Options
```
Based on remaining compliance period:
- 10+ years: Standard acquisition and management
- 5-10 years: Begin preservation planning
- 2-5 years: Active preservation negotiations required
- <2 years: Emergency preservation situation
```

### Step 5: State/Local Requirements

#### QAP Compliance
- Review state Qualified Allocation Plan requirements
- Check for any state-specific compliance obligations
- Verify compliance with local housing trust fund requirements
- Assess any additional affordability commitments

#### Regulatory Environment
- Identify state housing finance agency oversight requirements
- Check for local right of first refusal ordinances
- Review any inclusionary zoning obligations
- Assess impact of local rent control or stabilization laws

## Risk Assessment Framework

### High-Risk Indicators
- [ ] Less than 3 years remaining in compliance period
- [ ] History of compliance violations in past 3 years
- [ ] Current rents >90% of maximum allowable
- [ ] Deferred maintenance affecting habitability
- [ ] Owner expressed intent to opt-out of program

### Medium-Risk Indicators
- [ ] 3-7 years remaining in compliance period
- [ ] No recent capital improvements
- [ ] Management company lacks LIHTC experience
- [ ] Local market rents significantly exceed LIHTC limits
- [ ] Complex ownership structure with multiple entities

### Low-Risk Indicators
- [ ] 7+ years remaining in compliance period
- [ ] Strong compliance history with no violations
- [ ] Recent capital improvements completed
- [ ] Experienced LIHTC management in place
- [ ] Owner committed to long-term affordability

## Decision Criteria

### PROCEED Requirements
- [ ] Clear LIHTC status with adequate compliance period remaining
- [ ] Strong compliance history with minimal violations
- [ ] Manageable preservation timeline and strategy
- [ ] Physical condition meets or can meet compliance standards

### REJECT Triggers
- [ ] Less than 2 years compliance period remaining without preservation plan
- [ ] Serious ongoing compliance violations
- [ ] Physical condition requiring immediate major investment
- [ ] Legal or regulatory issues preventing successful preservation

### CONDITIONAL APPROVAL Triggers
- [ ] 2-5 years compliance period with viable preservation strategy
- [ ] Minor compliance issues that can be corrected post-acquisition
- [ ] Physical improvements needed but within reasonable budget
- [ ] Complex regulatory situation requiring specialized expertise

## Output Format

Create `compliance-analysis.json`:

```json
{
  "dealId": "string",
  "timestamp": "ISO-8601",
  "lihtcStatus": {
    "programStatus": "ACTIVE|EXPIRED|VIOLATION",
    "placedInServiceDate": "date",
    "compliancePeriodEnd": "date",
    "extendedUseEnd": "date",
    "yearsRemaining": number
  },
  "rentCompliance": {
    "setAsideRequirement": "20/50|40/60|other",
    "currentCompliance": true,
    "rentUtilization": number,
    "complianceMargin": number,
    "violationHistory": "string[]"
  },
  "physicalCompliance": {
    "lastInspectionDate": "date",
    "inspectionScore": number,
    "outstandingViolations": "string[]",
    "capitalNeedsForCompliance": number
  },
  "preservationAnalysis": {
    "urgencyLevel": "LOW|MEDIUM|HIGH|CRITICAL",
    "preservationStrategy": "string",
    "keyDates": "object[]",
    "stakeholders": "string[]"
  },
  "riskAssessment": {
    "overallRisk": "LOW|MEDIUM|HIGH",
    "keyRisks": "string[]",
    "mitigationStrategies": "string[]",
    "monitoringRequirements": "string[]"
  },
  "recommendation": "PROCEED|PROCEED_WITH_CONDITIONS|REJECT",
  "conditions": "string[]",
  "nextSteps": "string[]"
}
```

## Quality Control

### Verification Requirements
- Cross-reference all compliance dates with official documents
- Verify current rent and income data with property records
- Confirm compliance status with state housing finance agency
- Review legal documents for any additional restrictions

### Documentation Standards
- Maintain copies of all LIHTC compliance documents
- Document all assumptions about future compliance requirements
- Record all communications with regulatory agencies
- Track all deadlines and critical compliance dates

## Notes for Agent Processing
- Compliance is binary - properties are either compliant or not
- Focus on preservation timeline as key investment driver
- Consider regulatory complexity in underwriting assumptions
- Build strong relationships with state housing finance agencies
- Always verify information with primary sources

## Success Criteria
- 100% accuracy in compliance status determination
- Zero compliance violations post-acquisition
- Successful preservation negotiations for properties <5 years remaining
- Maintained affordability throughout investment hold period
