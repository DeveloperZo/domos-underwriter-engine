# Domos AI Investment Committee - Quick Reference

## 🚀 4-Step Workflow

### 1. Process Deal 📥
```
Call: processDeal("sample-deals/DueDiligence")
Result: Structured deal files in processed-deals/
```

### 2. Analyze Stage 🔍
```
Call: analyzeStage(dealPath, "A-initial-intake")
Result: Deal data + stage requirements loaded
```

### 3. Complete Analysis ✍️
```
Call: completeAnalysis(dealPath, stage, yourAnalysis)
Result: Analysis recorded in audit trail
```

### 4. Move Deal 📦
```
Call: moveDeal(dealPath, fromStage, toStage, decision)
Result: Deal advanced through pipeline
```

---

## 📋 Pipeline Stages

| Stage | Code | Purpose | Duration |
|-------|------|---------|----------|
| **Initial Intake** | `A-initial-intake` | Basic qualification | 1-2 hrs |
| **Preliminary Analysis** | `B-preliminary-analysis` | Market validation | 4-6 hrs |
| **Full Underwriting** | `C-full-underwriting` | Complete analysis | 8-12 hrs |
| **IC Review** | `D-ic-review` | Investment committee | 2-4 hrs |
| **LOI/PSA** | `E-loi-psa` | Legal documentation | Variable |
| **Final Approval** | `F-final-approval` | Final sign-off | Variable |
| **Closing** | `G-closing` | Transaction close | Variable |

---

## 🎯 Decision Options

| Decision | Code | Result |
|----------|------|--------|
| **Advance** | `ADVANCE` | Move to next stage |
| **Reject** | `REJECT` | End process, archive deal |
| **More Info** | `REQUEST_MORE_INFO` | Keep in current stage |
| **Revisions** | `REVISIONS_REQUIRED` | Keep in current stage |

---

## 📁 File Structure

```
processed-deals/deal-name-timestamp/
├── deal.json              # Property & LIHTC data
├── tenants.json          # Rent roll information
├── financialSummary.json # T12 & financial metrics
└── AnalysisJourney.md    # Complete audit trail

pipeline/A-initial-intake/
├── not-started/          # New deals
├── in-progress/          # Under analysis
├── completed/            # Analysis complete
└── rejected/             # Failed gate criteria
```

---

## ⚡ Common Commands

### Start New Deal
```
1. processDeal("path/to/due-diligence")
2. Note the output path
3. analyzeStage(outputPath, "A-initial-intake")
```

### Continue Analysis
```
1. Review deal data + stage spec
2. Make your assessment
3. completeAnalysis(dealPath, stage, analysis)
4. moveDeal(dealPath, currentStage, nextStage, decision)
```

### Check Deal Status
```
1. Look in pipeline/[stage]/[substate]/ folders
2. Review AnalysisJourney.md for history
3. Check deal.json for current status
```

---

## 🚨 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Processing fails** | Check file formats (PDF/Excel), try individual files |
| **Missing financials** | Provide T12 in Excel format, detailed rent roll |
| **Incomplete analysis** | Review stage specification, break into smaller questions |
| **Move errors** | Verify exact stage names and decision codes |

---

## 📊 Quality Checklist

### Before Moving to Next Stage
- [ ] All stage requirements reviewed
- [ ] Key risks identified and assessed
- [ ] Financial data validated
- [ ] Analysis recorded with reasoning
- [ ] Next steps clearly defined
- [ ] Confidence level assigned

### Investment Decision Criteria
- [ ] Property meets LIHTC preservation criteria
- [ ] Financial returns meet target (10%+ LIRR)
- [ ] Market fundamentals support investment
- [ ] Risk profile acceptable for portfolio
- [ ] Compliance requirements manageable
- [ ] Exit strategy clearly defined

---

## 🎯 Success Tips

### Effective Analysis
- **Follow the specs** - Each stage has specific requirements
- **Use AI insights** - Let Claude handle data analysis
- **Document thoroughly** - Future you will thank you
- **Stay consistent** - Apply same standards to every deal

### Pipeline Management
- **Don't rush gates** - Each serves a purpose
- **Communicate changes** - Keep team informed
- **Learn from history** - Review past decisions
- **Set clear criteria** - Define pass/fail standards

### Audit Trail
- **Be specific** - Record detailed reasoning
- **Include risks** - Document concerns and mitigations
- **Reference sources** - Note influential documents
- **Update regularly** - Keep status current

---

## 📞 Need Help?

1. **Check stage specs**: `/specs/stage_*/` for detailed requirements
2. **Review samples**: Look at existing processed deals
3. **Read user guide**: `USER_GUIDE.md` for comprehensive help
4. **Test workflow**: Use sample deals to practice

---

**🎯 Key Principle**: You make all investment decisions. AI handles data processing and provides analysis to inform your professional judgment.
