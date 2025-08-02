# Domos AI Investment Committee - User Guide

## Welcome to the Domos LIHTC Preservation AI System

This guide will help you use the Domos AI Investment Committee tool to analyze LIHTC preservation deals with full transparency and institutional-grade rigor.

---

## 🎯 What This System Does

The Domos AI system provides **hybrid AI-human investment analysis** for LIHTC preservation opportunities. You remain in complete control of all investment decisions while the AI handles data processing, analysis generation, and audit trail management.

### Key Benefits:
- ⚡ **Speed**: Analyze deals in hours, not weeks
- 🔍 **Rigor**: Institutional-grade analysis standards
- 📝 **Transparency**: Every decision tracked and auditable
- 🎯 **Focus**: You make investment decisions, AI handles data processing
- 📊 **Consistency**: Standardized analysis across all deals

---

## 🚀 Getting Started

### Prerequisites
- Access to Claude with MCP tools enabled
- DueDiligence documents in digital format
- Basic understanding of LIHTC preservation investing

### Your Workflow
1. **Upload** DueDiligence documents
2. **Process** deal through AI parsing
3. **Analyze** each pipeline stage with AI assistance
4. **Make** investment decisions at each gate
5. **Track** complete audit trail automatically

---

## 🔧 The 4 MCP Tools

### 1. Process Deal 📥
**Purpose**: Convert raw DueDiligence into structured data

```
Tool: processDeal
Input: Folder containing DueDiligence documents
Output: Structured deal files ready for analysis
```

**What It Does:**
- Extracts property information from documents
- Parses financial statements and rent rolls
- Creates standardized deal.json structure
- Initializes analysis audit trail

**When to Use**: Start of every new deal

### 2. Analyze Stage 🔍
**Purpose**: Load deal data + stage requirements for your analysis

```
Tool: analyzeStage
Input: Deal path + stage name (A-initial-intake, B-preliminary-analysis, etc.)
Output: Deal data + stage specification for your review
```

**What It Does:**
- Loads current deal data
- Shows relevant stage specification
- Displays analysis history for context
- Prepares everything for your assessment

**When to Use**: At each pipeline stage

### 3. Complete Analysis ✍️
**Purpose**: Record your analysis and AI recommendations

```
Tool: completeAnalysis
Input: Your analysis text + AI recommendations
Output: Updated audit trail with timestamped entry
```

**What It Does:**
- Records your investment analysis
- Timestamps all entries
- Maintains complete audit trail
- Preserves decision rationale

**When to Use**: After completing stage analysis

### 4. Move Deal 📦
**Purpose**: Advance deal through pipeline based on your decision

```
Tool: moveDeal
Input: Current stage + target stage + decision (ADVANCE/REJECT/etc.)
Output: Deal moved to appropriate pipeline folder
```

**What It Does:**
- Moves deal through pipeline stages
- Updates deal status and tracking
- Creates proper folder structure
- Logs pipeline movement decisions

**When to Use**: After making investment decision

---

## 🗂️ Pipeline Stages Explained

### Stage A: Initial Intake
**Purpose**: First-contact screening and basic qualification
- ✅ Property meets basic criteria (20+ units, LIHTC eligible)
- ✅ Deal source is credible
- ✅ Financial data is complete enough for analysis
- ✅ Timeline aligns with our process

**Typical Duration**: 1-2 hours
**Key Documents**: Basic property info, asking price, preliminary financials

### Stage B: Preliminary Analysis  
**Purpose**: Market validation and initial underwriting
- ✅ Market analysis supports investment thesis
- ✅ Property condition assessment
- ✅ Preliminary financial modeling
- ✅ Competition and timing analysis

**Typical Duration**: 4-6 hours
**Key Documents**: T12 financials, rent roll, market studies

### Stage C: Full Underwriting
**Purpose**: Complete financial analysis and DueDiligence
- ✅ Comprehensive financial modeling
- ✅ LIHTC compliance analysis
- ✅ Risk assessment and mitigation
- ✅ Investment returns validation

**Typical Duration**: 8-12 hours
**Key Documents**: Complete DueDiligence package

### Stage D: IC Review
**Purpose**: Investment Committee presentation and decision
- ✅ Executive summary preparation
- ✅ Risk/return analysis
- ✅ Final investment recommendation
- ✅ LP presentation materials

**Typical Duration**: 2-4 hours
**Key Documents**: IC memo, presentation deck

### Stages E-G: Transaction Management
**Purpose**: Legal, closing, and post-closing activities
- **E**: LOI/PSA negotiation and execution
- **F**: Final approvals and funding
- **G**: Closing and asset management transition

---

## 📋 Step-by-Step Workflow

### Step 1: Process New Deal
1. **Collect** all DueDiligence documents in one folder
2. **Call** `processDeal("path/to/due-diligence")`
3. **Review** the structured output files created
4. **Note** the deal path for subsequent analysis

### Step 2: Initial Intake Analysis
1. **Call** `analyzeStage(dealPath, "A-initial-intake")`
2. **Review** the deal data and stage requirements
3. **Assess** against the initial intake criteria
4. **Make** your go/no-go decision
5. **Call** `completeAnalysis()` to record your analysis
6. **Call** `moveDeal()` to advance or reject

### Step 3: Continue Through Pipeline
1. **Repeat** analyze → decide → record → move for each stage
2. **Use** AI recommendations to inform your decisions
3. **Maintain** complete audit trail of all choices
4. **Escalate** to IC when ready for final decision

### Step 4: Investment Committee Review
1. **Generate** IC presentation materials
2. **Present** to investment committee
3. **Record** IC decision and rationale
4. **Move** to transaction management or rejection

---

## 💡 Best Practices

### For Effective Analysis
- **Read the specs**: Each stage has specific requirements - follow them
- **Use the AI**: Let Claude handle data analysis, you focus on investment judgment
- **Document decisions**: Always explain your reasoning in the analysis
- **Be consistent**: Apply the same standards to every deal

### For Audit Trail Management
- **Be specific**: Record detailed rationale for all decisions
- **Include risks**: Document concerns and mitigation strategies
- **Reference sources**: Note key documents that influenced decisions
- **Update status**: Keep deal status current throughout process

### For Pipeline Management
- **Don't skip stages**: Each gate serves a purpose
- **Set clear criteria**: Define what constitutes pass/fail for each stage
- **Communicate changes**: Update team when deals move or are rejected
- **Learn from history**: Review past analysis journeys for insights

---

## 🚨 Common Issues & Solutions

### "Deal Won't Process"
**Problem**: processDeal fails or produces incomplete data
**Solutions**:
- Ensure all documents are in supported formats (PDF, Excel, Word)
- Check that financial statements are readable (not scanned images)
- Verify folder structure and file permissions
- Try processing individual document types separately

### "Missing Financial Data"
**Problem**: AI can't extract key financial metrics
**Solutions**:
- Provide T12 income statements in Excel format
- Include detailed rent roll with unit-by-unit data
- Add operating expense breakdown
- Supplement with property management reports

### "Analysis Seems Incomplete"
**Problem**: AI analysis doesn't cover all required areas
**Solutions**:
- Review the stage specification carefully
- Provide additional context in your prompts
- Break analysis into smaller, focused questions
- Use "analyzeStage" multiple times for complex deals

### "Pipeline Movement Errors"
**Problem**: moveDeal fails or creates wrong folder structure
**Solutions**:
- Verify stage names match exactly (A-initial-intake, etc.)
- Check that target stage exists in pipeline
- Ensure proper decision format (ADVANCE, REJECT, etc.)
- Confirm deal path is correct and accessible

---

## 📊 Understanding Your Outputs

### deal.json Structure
```json
{
  "id": "unique-deal-identifier",
  "propertyName": "Property Name",
  "address": { ... },
  "basicInfo": {
    "totalUnits": 45,
    "yearBuilt": 1960,
    "propertyType": "Mixed-Use Residential"
  },
  "lihtcInfo": {
    "currentlyLIHTC": false,
    "amiRestriction": 60,
    "setAsideRequirement": "20% at 50% AMI"
  },
  "financialData": { ... },
  "status": "processing"
}
```

### AnalysisJourney.md Format
```markdown
# Analysis Journey: Property Name

**Deal ID:** unique-identifier
**Created:** timestamp
**Status:** current-stage

---

## Analysis Entry - timestamp

**Stage:** A-initial-intake
**Analyst:** Your Name
**Recommendation:** ADVANCE

### Assessment Against Stage Specification
- ✅ Criteria met
- ⚠️ Areas of concern
- ❌ Failed requirements

### Key Findings
1. Major finding one
2. Major finding two

### Next Steps
- Action item one
- Action item two

**Confidence Level:** 85%

---
```

### Pipeline Folder Structure
```
pipeline/
├── A-initial-intake/
│   ├── not-started/        # New deals
│   ├── in-progress/        # Under analysis
│   ├── completed/          # Analysis done
│   └── rejected/           # Failed gate
├── B-preliminary-analysis/
│   └── [same substates]
├── C-full-underwriting/
│   └── [same substates]
└── D-ic-review/
    └── [same substates]
```

---

## 🔒 Security & Compliance

### Data Protection
- All deal data stays within your secure environment
- No external data transmission required
- Complete audit trail for regulatory compliance
- User access controls and permissions

### Audit Requirements
- Every analysis decision is timestamped and recorded
- Complete reasoning documented for all stages
- Investment committee decisions fully tracked
- Historical analysis preserved for future reference

### Regulatory Compliance
- SEC compliance for investment decisions
- LIHTC regulatory requirement tracking
- Fair housing compliance monitoring
- Environmental and social impact documentation

---

## 📞 Support & Training

### Getting Help
- **Technical Issues**: Check troubleshooting section above
- **Process Questions**: Review stage specifications in `/specs/`
- **Training Needs**: Work through sample deals first
- **System Updates**: Check CHANGELOG.md for recent changes

### Training Resources
- Sample deals in `/sample-deals/` directory
- Stage specifications in `/specs/stage_*/`
- Demo workflow in demo scripts
- Analysis examples in processed deal histories

### Best Practices Development
- Review successful deal analyses for patterns
- Document lessons learned from rejected deals
- Share insights with team for consistency
- Continuously refine analysis criteria

---

## 🎯 Success Metrics

### Process Efficiency
- **Time to Decision**: Target <3 business days per stage
- **Analysis Quality**: Consistent application of criteria
- **Audit Completeness**: 100% of decisions documented
- **Pipeline Velocity**: Steady flow through stages

### Investment Performance
- **Deal Quality**: Higher success rate on advanced deals
- **Risk Management**: Better identification of problem areas
- **Return Accuracy**: Actual vs projected performance
- **Compliance Success**: Zero LIHTC compliance issues

---

## 🚀 Advanced Features

### Bulk Processing
- Process multiple deals simultaneously
- Batch analysis for portfolio reviews
- Comparative analysis across deals
- Portfolio-level risk assessment

### Custom Analysis
- Modify stage specifications for special situations
- Add custom analysis criteria
- Integrate with external data sources
- Generate custom reporting formats

### Integration Options
- Connect to property management systems
- Link with financial modeling tools
- Export to investment committee systems
- API access for custom workflows

---

**🎯 Remember**: You are the investment professional making all decisions. The AI is your analytical assistant that handles data processing and provides insights to inform your judgment. The system is designed to enhance your expertise, not replace it.

**Questions or issues?** Check the troubleshooting section or review the stage specifications for detailed guidance.
