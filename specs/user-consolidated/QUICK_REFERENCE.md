# Quick Reference

## Purpose
This document provides a concise reference for the essential commands and workflows of the Domos Underwriter Engine.

## Core Commands

### Process Deal
```
processDeal("path/to/due-diligence")
```
- Creates structured data from raw documents
- Outputs to processed-deals/ directory

### Analyze Stage
```
analyzeStage(dealPath, "A-initial-intake")
```
- Loads deal data and stage requirements
- Prepares for your analysis

### Complete Analysis
```
completeAnalysis(dealPath, stage, analysis)
```
- Records your analysis in the audit trail
- Timestamps and documents decisions

### Move Deal
```
moveDeal(dealPath, fromStage, toStage, decision)
```
- Advances or rejects deals in the pipeline
- Updates deal status tracking

## Pipeline Stages

| Stage | Code | Purpose | Key Decision Criteria |
|-------|------|---------|------------------------|
| **Initial Intake** | `A-initial-intake` | Basic qualification | Property eligibility, data completeness |
| **Preliminary Analysis** | `B-preliminary-analysis` | Market validation | Market fundamentals, initial returns |
| **Full Underwriting** | `C-full-underwriting` | Complete analysis | Financial model, risk assessment |
| **IC Review** | `D-ic-review` | Final recommendation | Investment thesis, portfolio fit |
| **LOI/PSA** | `E-loi-psa` | Legal documentation | Transaction terms, legal review |
| **Final Approval** | `F-final-approval` | Final sign-off | Final investment committee approval |
| **Closing** | `G-closing` | Transaction close | Execution and funding |

## Decision Options

| Decision | Code | Result |
|----------|------|--------|
| **Advance** | `ADVANCE` | Move to next stage |
| **Reject** | `REJECT` | End process, archive deal |
| **Request More Info** | `REQUEST_MORE_INFO` | Keep in current stage |
| **Revisions Required** | `REVISIONS_REQUIRED` | Keep in current stage |

## Standard Workflow

### New Deal
```
1. processDeal("sample-deals/DueDiligence")
2. analyzeStage(outputPath, "A-initial-intake")
3. completeAnalysis(dealPath, "A-initial-intake", analysis)
4. moveDeal(dealPath, "A-initial-intake", "B-preliminary-analysis", "ADVANCE")
```

### Continue Analysis
```
1. analyzeStage(dealPath, currentStage)
2. completeAnalysis(dealPath, currentStage, analysis)
3. moveDeal(dealPath, currentStage, nextStage, decision)
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Processing fails** | Check file formats (PDF/Excel), try individual files |
| **Missing financial data** | Provide T12 in Excel format, detailed rent roll |
| **Analysis incomplete** | Review stage specification, break into smaller questions |
| **Pipeline errors** | Verify exact stage names and decision codes |

## Quality Checklist

Before advancing any deal, ensure:
- [ ] All stage requirements addressed
- [ ] Financial assumptions validated
- [ ] Key risks identified and assessed
- [ ] Clear rationale documented
- [ ] Confidence level assigned

## File Structure

```
processed-deals/deal-name-timestamp/
├── deal.json              # Property information
├── tenants.json           # Rent roll data
├── financialSummary.json  # Financial metrics
└── AnalysisJourney.md     # Analysis audit trail

pipeline/
├── A-initial-intake/
│   ├── not-started/       # New deals
│   ├── in-progress/       # Under analysis
│   ├── completed/         # Analysis done
│   └── rejected/          # Failed gate
└── [other stages with same structure]
```

## Related Resources
- [User Guide](./USER_GUIDE.md) - Complete usage instructions
- [Setup Guide](./SETUP.md) - Installation and configuration

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Product Team  
**Status**: Active
