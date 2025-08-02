# Domos MCP Server Test

Let's test the basic functionality:

## Available Commands

```bash
# List available MCP tools
npm run mcp-tools

# Process a deal from DueDiligence
npm run mcp-process sample-deals/Due\ Diligence

# Analyze a stage (after processing)
npm run mcp-analyze processed-deals/deal-folder A-initial-intake
```

## Test Workflow

1. **Process Deal**: `processDeal("sample-deals/DueDiligence")`
2. **Analyze Stage**: `analyzeStage(dealPath, "A-initial-intake")`  
3. **Update Journey**: `updateAnalysisJourney(dealPath, analysis)`
4. **Move Deal**: `moveDeal(dealPath, "A-initial-intake", "B-preliminary-analysis", "ADVANCE")`

This creates a clean human-in-the-loop workflow where:
- MCP tools handle file operations 
- Human provides the actual analysis
- System tracks everything in AnalysisJourney.md
- Pipeline moves based on human decisions
