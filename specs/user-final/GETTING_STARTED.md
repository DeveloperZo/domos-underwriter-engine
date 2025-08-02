# Getting Started

## Purpose
This document provides instructions for installing the Domos Underwriter Engine and processing your first deal.

## Installation

### Prerequisites
- Node.js 18.0 or higher
- 4GB+ available disk space
- Windows, macOS, or Linux environment

### Installation Steps
```bash
# 1. Navigate to project directory
cd C:/Repos/domos-underwriter-engine

# 2. Install dependencies
npm install

# 3. Build the system
npm run build

# 4. Test installation
npm run demo-mcp
```

### Verify Installation
A successful installation will show:
```
🚀 Starting Domos MCP Server Demo
📋 Available MCP Tools:
  • processDeal: Process a deal from DueDiligence folder
  • analyzeStage: Load deal data and stage specification
  • completeAnalysis: Complete analysis and update audit trail
  • moveDeal: Move deal through pipeline folders
✅ Demo completed successfully!
```

## Directory Structure

After installation, your directory structure will include:

```
domos-underwriter-engine/
├── dist/                  # Compiled JavaScript
├── pipeline/              # Deal workflow stages
│   ├── A-initial-intake/
│   ├── B-preliminary-analysis/
│   └── [other stages]
├── processed-deals/       # Structured deal output
├── sample-deals/          # Test data
├── specs/                 # Analysis specifications
└── src/                   # Source code
```

## Processing Your First Deal

### Step 1: Prepare Deal Documents
1. Create a folder in `sample-deals/` for your deal documents
2. Add the following document types:
   - Offering Memorandum (PDF)
   - Rent Roll (Excel preferred)
   - T12 Financial Statements (Excel preferred)
   - Property Information (any format)

### Step 2: Process Documents
```bash
# Process the deal documents
npm run mcp-process "sample-deals/your-deal-folder"
```

This will:
1. Extract data from your documents
2. Create structured JSON files
3. Initialize the analysis audit trail
4. Output the path to the processed deal

### Step 3: Begin Analysis
```bash
# Using the path from the previous step
npm run mcp-analyze "processed-deals/your-deal-timestamp" "A-initial-intake"
```

This will:
1. Load the deal data
2. Present the stage requirements
3. Prepare for your analysis

### Step 4: Record Your Analysis
```bash
# Record your analysis decision
npm run mcp-complete "processed-deals/your-deal-timestamp" "A-initial-intake" "Your detailed analysis text here with recommendation..."
```

This will:
1. Add your analysis to the audit trail
2. Timestamp the entry
3. Preserve your reasoning

### Step 5: Move Through Pipeline
```bash
# Advance the deal to the next stage
npm run mcp-move "processed-deals/your-deal-timestamp" "A-initial-intake" "B-preliminary-analysis" "ADVANCE"
```

This will:
1. Move the deal to the next pipeline stage
2. Update deal status tracking
3. Prepare for the next analysis stage

## Next Steps

After completing your first deal:
1. Explore the `processed-deals/` directory to see the structured output
2. Review the `AnalysisJourney.md` file to see the audit trail
3. Continue analysis through subsequent pipeline stages
4. Experiment with different decision options

## Installation Troubleshooting

### Common Issues

**"npm install" Fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules/` and `package-lock.json`, then retry
- Check Node.js version: `node --version`

**"npm run build" Fails**
- Verify TypeScript installation: `npx tsc --version`
- Check for syntax errors in source files
- Try: `npm install typescript@latest`

**File Operation Errors**
- Check file permissions on the project directory
- Ensure no files are open in other applications
- Verify sufficient disk space

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Engineering Team  
**Status**: Active
