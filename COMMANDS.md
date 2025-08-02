# 🚀 Domos LIHTC AI Underwriter - Command Reference

## Available Commands

### 📄 `npm run process-deal [deal-path]`

**Purpose**: Parse deal documents into structured JSON format  
**Usage**: 
```bash
npm run process-deal                    # Uses default 'sample-deals' folder
npm run process-deal sample-deals       # Specific folder
npm run process-deal /path/to/my-deal   # Custom path
```
**Runtime**: ~30 seconds

### 🎯 `npm run analyze-to-stage <deal-path> <stage-number>`

**Purpose**: Process deal to a specific stage (1-6) with precise control  
**Usage**:
```bash
npm run analyze-to-stage sample-deals 1    # Strategic Qualification only
npm run analyze-to-stage sample-deals 3    # Through DueDiligence  
npm run analyze-to-stage sample-deals 6    # Through Final Approval
```
**Stages**:
- `1` - Strategic Qualification
- `2` - Market Intelligence  
- `3` - DueDiligence
- `4` - Financial Underwriting
- `5` - IC Review
- `6` - Final Approval

**Runtime**: ~5-15 seconds depending on target stage

### 📊 `npm run status <deal-path>`

**Purpose**: Check current deal progress and status  
**Usage**:
```bash
npm run status sample-deals       # Show current progress
```
**Shows**: Current stage, decision history, next steps, file locations
**Runtime**: Instant

### 🏃 `npm run demo-stages [deal-path]`

**Purpose**: Process deal through ALL 6 stages automatically  
**Usage**:
```bash
npm run demo-stages sample-deals  # Full pipeline demo
```
**Expected Output** (analyze-to-stage sample-deals 3):
```
🎯 Domos Stage-Specific Processing
==================================

📁 Deal Path: sample-deals
🎯 Target Stage: 3 (DueDiligence)

📋 Step 1: Ensuring deal structure is processed...
✅ Deal structure ready: The Frank

📊 Step 2: Checking current progress...
Current Stage: 2
Current Status: ACTIVE

🔄 Step 3: Processing stages 1 through 3...
Starting from stage 3

🔄 Processing Stage 3: DueDiligence
  ✅ Stage 3: ADVANCE
     DueDiligence completed satisfactorily

📊 Step 4: Final Status
=======================
Current Stage: 3 (DueDiligence)
Status: ACTIVE
Last Decision: ADVANCE
Reasoning: DueDiligence completed satisfactorily

📂 Step 5: Generated Files
==========================
New stage outputs created:
  ✅ Stage03_DueDiligence.md

📁 Check: sample-deals/Outputs/ for all stage reports
📁 Check: sample-deals/AnalysisJourney/auditLog.json for audit trail

🔮 Next Steps
=============
To continue processing: npm run analyze-to-stage sample-deals 4
To process all remaining: npm run demo-stages sample-deals

✅ Stage processing completed successfully!
```

**Expected Output** (status sample-deals):
```
📊 Domos Deal Status Check
==========================

📁 Deal Path: sample-deals
🏢 Property: The Frank

📊 Current Status: ACTIVE
🎯 Current Stage: 3 (DueDiligence)
✅ Last Decision: ADVANCE
💭 Reasoning: DueDiligence completed satisfactorily

📋 Processing History:
======================
✅ Stage 1: Strategic Qualification
   Decision: ADVANCE (12/1/2024 2:30:15 PM)
   Reasoning: Deal meets strategic qualification criteria
   Key Findings: Property: The Frank with 150 units, LIHTC Status: Active...
   │
✅ Stage 2: Market Intelligence
   Decision: ADVANCE (12/1/2024 2:30:18 PM)
   Reasoning: Market conditions support investment thesis
   Key Findings: Market analysis based on property location and type...
   │
✅ Stage 3: DueDiligence
   Decision: ADVANCE (12/1/2024 2:30:21 PM)
   Reasoning: DueDiligence completed satisfactorily
   Key Findings: Property condition assessment, LIHTC compliance review

🔮 Next Steps:
=============
🎯 Continue to Stage 4: Financial Underwriting
   Command: npm run analyze-to-stage sample-deals 4
🏃 Or process all remaining: npm run demo-stages sample-deals

📂 File Locations:
==================
📄 Structured Data: sample-deals/Structured/
📋 Stage Reports: sample-deals/Outputs/
📊 Audit Trail: sample-deals/AnalysisJourney/auditLog.json
```

**Expected Output**:
```
🚀 Domos Deal Processing MVP Demo
=====================================

🔄 Processing deal from: sample-deals
📂 Created deal folder structure
📁 Found 6 source documents
🔍 Parsing documents...
📊 Parsing rent roll: Rent Roll.xlsx
💰 Parsing financials: The Frank Consolidated Income Statement.xlsx
💾 Saved structured data to JSON files
✅ Successfully processed deal: The Frank

📋 Deal Processing Summary:
============================
Deal ID: deal_1703123456_abc123def
Property: The Frank
Total Units: 150
Annual Gross Rent: $1,800,000
Net Operating Income: $1,200,000
Occupancy Rate: 95.0%
Estimated Price: $14,400,000
Price Per Unit: $96,000

🏠 Tenant Summary:
- Total Units: 150
- Occupied: 143
- Vacant: 7
- Average Rent: $1,000

💰 Financial Summary (T12):
- Total Income: $1,800,000
- Total Expenses: $600,000
- NOI: $1,200,000
- Expense Ratio: 33.3%

📁 Source Documents Found: 6
  - Rent Roll.xlsx (rentRoll)
  - The Frank Consolidated Income Statement.xlsx (financials)
  - Costar Report.pdf (dueDiligence)
  - Commercial Rent Roll.xlsx (other)
  - Lease Agreement.pdf (legal)
  - Property Photos.pdf (other)

✅ Deal processing completed successfully!

📂 Check the following folders in sample-deals:
  - SourceDocuments/ (original files)
  - Structured/ (parsed JSON data)
  - Outputs/ (stage analysis outputs - run demo-stages next)
  - AnalysisJourney/ (audit trail - run demo-stages next)
```

**Files Created**:
```
sample-deals/
├── SourceDocuments/      # (folder created, files referenced)
├── Structured/
│   ├── deal.json         # ✅ Main deal object
│   ├── tenants.json      # ✅ Rent roll and unit data
│   └── financialSummary.json # ✅ T12 financial analysis
├── Outputs/              # (empty, for stage processing)
└── AnalysisJourney/      # (empty, for stage processing)
```

**Runtime**: ~30 seconds

---

### `npm run demo-stages [deal-path]`

**Purpose**: Process deal through all 6 underwriting stages with audit trail  
**Prerequisites**: Must run `process-deal` first  
**Usage**:
```bash
npm run demo-stages                     # Uses default 'sample-deals' folder
npm run demo-stages sample-deals        # Specific folder
npm run demo-stages /path/to/my-deal    # Custom path
```

**Expected Output**:
```
🚀 Domos Stage Processing Demo
==============================

📁 Step 1: Ensuring deal structure is processed...
✅ Deal structure ready: The Frank

🔄 Step 2: Processing through all stages...

🔄 Processing Stage 1...
📋 Analyzing: Strategic Qualification
✅ Stage 1 completed: ADVANCE
  Stage 1: ADVANCE - Deal meets strategic qualification criteria

🔄 Processing Stage 2...
📋 Analyzing: Market Intelligence
✅ Stage 2 completed: ADVANCE
  Stage 2: ADVANCE - Market conditions support investment thesis

🔄 Processing Stage 3...
📋 Analyzing: DueDiligence
✅ Stage 3 completed: ADVANCE
  Stage 3: ADVANCE - DueDiligence completed satisfactorily

🔄 Processing Stage 4...
📋 Analyzing: Financial Underwriting
✅ Stage 4 completed: ADVANCE
  Stage 4: ADVANCE - Financial returns meet criteria (IRR: 9.5%, DSCR: 1.25x)

🔄 Processing Stage 5...
📋 Analyzing: IC Review
✅ Stage 5 completed: ADVANCE
  Stage 5: ADVANCE - Investment Committee approval received

🔄 Processing Stage 6...
📋 Analyzing: Final Approval
✅ Stage 6 completed: ADVANCE
  Stage 6: ADVANCE - Final approvals completed

📋 Step 3: Audit Trail Summary
===============================
# Audit Trail Summary

**Deal**: The Frank (deal_1703123456_abc123def)
**Status**: COMPLETED
**Current Stage**: 6
**Started**: 12/1/2024

## Stage History

### Strategic Qualification (Stage 1)
- **Decision**: ADVANCE
- **Date**: 12/1/2024
- **Reasoning**: Deal meets strategic qualification criteria
- **Key Findings**:
  - Property: The Frank with 150 units
  - LIHTC Status: Active
  - Price per unit: $96,000
  - Occupancy: 95.0%

### Market Intelligence (Stage 2)
- **Decision**: ADVANCE
- **Date**: 12/1/2024
- **Reasoning**: Market conditions support investment thesis
...

📊 Step 4: Current Deal Status
===============================
Current Stage: 6
Status: COMPLETED
Last Decision: ADVANCE
Last Reasoning: Final approvals completed

📂 Step 5: Generated Files
===========================
Check the following directories:
  📁 sample-deals/Outputs/
    - Stage01_StrategicQualification.md
    - Stage02_MarketIntelligence.md
    - Stage03_DueDiligence.md
    - Stage04_FinancialUnderwriting.md
    - Stage05_ICReview.md
    - Stage06_FinalApproval.md

  📁 sample-deals/AnalysisJourney/
    - auditLog.json (complete decision trail)

✅ Stage processing demonstration completed!
```

**Files Created**:
```
sample-deals/
├── Outputs/
│   ├── Stage01_StrategicQualification.md     # ✅ Strategic analysis
│   ├── Stage02_MarketIntelligence.md         # ✅ Market analysis
│   ├── Stage03_DueDiligence.md               # ✅ DD analysis
│   ├── Stage04_FinancialUnderwriting.md      # ✅ Financial model
│   ├── Stage05_ICReview.md                   # ✅ IC recommendation
│   └── Stage06_FinalApproval.md              # ✅ Final approval
└── AnalysisJourney/
    └── auditLog.json                         # ✅ Complete audit trail
```

**Runtime**: ~10 seconds

---

## Quick Test Sequences

### 🚀 **Full Pipeline Demo**
```bash
# Install dependencies (one time)
npm install

# Parse documents into structured data
npm run process-deal sample-deals

# Process through all 6 stages
npm run demo-stages sample-deals

# Total time: < 1 minute
```

### 🎯 **Stage-by-Stage Processing**
```bash
# Parse documents first
npm run process-deal sample-deals

# Check initial status
npm run status sample-deals

# Process to Strategic Qualification
npm run analyze-to-stage sample-deals 1

# Check progress
npm run status sample-deals

# Continue to DueDiligence
npm run analyze-to-stage sample-deals 3

# Process remaining stages
npm run demo-stages sample-deals

# Final status check
npm run status sample-deals
```

### 🔍 **Status Monitoring**
```bash
# Check deal status anytime
npm run status sample-deals

# Shows: current stage, decision history, next steps
```

## Expected Final Structure

After running both commands:

```
sample-deals/
├── DueDiligence/           # Original source documents
│   ├── Historic Financials/
│   │   ├── Rent Roll.xlsx
│   │   └── The Frank Consolidated Income Statement.xlsx
│   ├── Commercial Leases/
│   └── CoStar and Demos/
├── SourceDocuments/         # (created but empty - files referenced)
├── Structured/              # ✅ Parsed JSON data
│   ├── deal.json
│   ├── tenants.json
│   └── financialSummary.json
├── Outputs/                 # ✅ 6 stage analysis reports
│   ├── Stage01_StrategicQualification.md
│   ├── Stage02_MarketIntelligence.md
│   ├── Stage03_DueDiligence.md
│   ├── Stage04_FinancialUnderwriting.md
│   ├── Stage05_ICReview.md
│   └── Stage06_FinalApproval.md
└── AnalysisJourney/         # ✅ Complete audit trail
    └── auditLog.json
```

## Error Handling

Both commands include helpful error messages and usage examples:

```bash
# If path doesn't exist
❌ Error processing deal: Deal path does not exist: /invalid/path

💡 Usage: npm run process-deal [deal-path]
   Example: npm run process-deal sample-deals
   Example: npm run process-deal /path/to/my-deal
```

## Notes

- **Flexible Paths**: Both commands work with any folder containing deal documents
- **Graceful Failures**: Missing documents don't crash the system
- **Complete Audit**: Every decision is logged with timestamp and reasoning
- **Human Readable**: All outputs are in markdown format for easy review
