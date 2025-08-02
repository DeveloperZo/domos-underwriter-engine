# Domos MCP Tools - Quick Start Guide

## Installation & Setup

```bash
cd C:\Repos\domos-underwriter-engine
npm install
npm run build
```

## Test the System

```bash
# Basic functionality test
npm run test-mcp

# Full end-to-end demo
npm run demo-mcp
```

## The 4 MCP Tools

### 1. Process Deal
```bash
npm run mcp-process "sample-deals/DueDiligence"
```
- Reads DueDiligence documents
- Creates structured deal.json, tenants.json, financialSummary.json
- Initializes AnalysisJourney.md
- Returns path to processed deal

### 2. Analyze Stage  
```bash
npm run mcp-analyze "processed-deals/deal-folder" "A-initial-intake"
```
- Loads deal data + stage specification
- Presents both for human analysis
- Shows current analysis journey for context

### 3. Update Analysis Journey
(Called programmatically via MCP)
- Appends human analysis to AnalysisJourney.md
- Timestamps all entries
- Maintains audit trail

### 4. Move Deal
(Called programmatically via MCP)
- Moves deal through pipeline stages
- Updates deal status and tracking
- Creates proper folder structure

## Human-in-the-Loop Workflow

1. **You call**: `processDeal()` → **System**: Creates structured files
2. **You call**: `analyzeStage()` → **System**: Shows deal + spec
3. **You analyze**: Against spec requirements → **You decide**: ADVANCE/REJECT/etc.
4. **You call**: `updateAnalysisJourney()` → **System**: Records your analysis  
5. **You call**: `moveDeal()` → **System**: Moves to next stage
6. **Repeat** for each pipeline stage

## Pipeline Stages

- `A-initial-intake` → Initial screening and qualification
- `B-preliminary-analysis` → Market analysis and basic underwriting  
- `C-full-underwriting` → Complete financial analysis
- `D-ic-review` → Investment committee review
- `E-loi-psa` → Legal documentation and LOI
- `F-final-approval` → Final investment approval
- `G-closing` → Transaction closing

## Key Files Created

```
processed-deals/the-frank-{timestamp}/
├── deal.json                 # Structured deal data
├── tenants.json             # Rent roll and tenant info  
├── financialSummary.json    # T12 and financial metrics
└── AnalysisJourney.md       # Complete audit trail

pipeline/A-initial-intake/not-started/deal-folder/
├── [copied deal files]
└── AnalysisJourney.md       # Updated with moves
```

## Next Steps for Integration

1. **MCP Server Setup**: Point Claude MCP to this directory
2. **Tool Registration**: Claude will discover the 4 tools automatically
3. **Live Workflow**: Use the tools interactively with Claude
4. **Deal Processing**: Process real deals through the pipeline

## Benefits

✅ **Simple**: Just 4 tools cover entire workflow  
✅ **Transparent**: Complete audit trail in AnalysisJourney.md  
✅ **Human-Controlled**: You make all investment decisions  
✅ **Automated**: System handles file operations and tracking  
✅ **Scalable**: Easy to add more stages or customize logic  

This approach keeps you in control while automating the boring file management parts!
