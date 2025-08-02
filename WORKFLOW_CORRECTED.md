# Domos MCP Tools - Corrected Workflow

## The Real 4 MCP Tools

### 1. `processDeal(dueDiligencePath)`
- **Purpose**: Creates structured files from due diligence documents
- **Who calls**: Human
- **Output**: Structured deal.json, tenants.json, financialSummary.json, AnalysisJourney.md

### 2. `analyzeStage(dealPath, stage, analysis?)`  
- **Purpose**: Loads deal data + stage specification (optionally records analysis)
- **Who calls**: Human (to load) or Claude (to load + analyze)
- **Output**: Presents deal data and spec, optionally records Claude's analysis

### 3. `completeAnalysis(dealPath, stage, analysis)`
- **Purpose**: Records Claude's analysis in the audit trail
- **Who calls**: Claude (after performing analysis)
- **Output**: Updates AnalysisJourney.md with timestamped Claude analysis

### 4. `moveDeal(dealPath, fromStage, toStage, decision)`
- **Purpose**: Moves deal through pipeline based on analysis decision
- **Who calls**: Human (based on Claude's recommendation)
- **Output**: Relocates deal files and updates pipeline tracking

## Corrected Workflow

```
1. Human: Call processDeal("sample-deals/Due Diligence")
2. Tool: Creates structured files in processed-deals/

3. Human: Call analyzeStage(dealPath, "A-initial-intake")
4. Tool: Loads deal.json + stage spec, presents to Claude

5. Claude: Analyzes the deal against requirements
6. Claude: Call completeAnalysis(dealPath, stage, myAnalysis)  
7. Tool: Records Claude's analysis in AnalysisJourney.md

8. Human: Call moveDeal() based on Claude's recommendation
9. Tool: Moves deal to next pipeline stage
```

## Key Insight

**The AnalysisJourney.md is the audit trail of Claude's analysis work**, not something humans update. It automatically captures:

- What Claude analyzed
- When the analysis was performed  
- What criteria Claude applied
- What recommendation Claude made
- What reasoning Claude used

This creates a transparent record of the AI agent's decision-making process for regulatory compliance and investment committee review.

## Updated Benefits

✅ **Audit Trail**: Complete record of Claude's analysis decisions  
✅ **Transparency**: Every AI recommendation is documented and timestamped  
✅ **Human Control**: Humans control workflow, Claude performs analysis  
✅ **Compliance**: Full audit trail for regulatory requirements  
✅ **Scalable**: Can process multiple deals with full documentation  

The human stays in control of the workflow and final decisions, while Claude performs the detailed analysis work and automatically documents everything for compliance and review.
