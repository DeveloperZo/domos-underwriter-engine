# Domos LIHTC AI Underwriter - MCP Edition

## Simple Human-in-the-Loop Deal Processing

This system provides **4 simple MCP tools** that enable a clean human-in-the-loop workflow for LIHTC preservation deal analysis. You become the agent in the loop, while MCP tools handle all file operations.

## 🔧 The 4 MCP Tools

### 1. `processDeal(dueDiligencePath)`
- **Purpose**: Creates structured files from due diligence documents
- **Input**: Path to folder containing deal documents  
- **Output**: Structured deal.json, tenants.json, financialSummary.json, AnalysisJourney.md
- **Example**: `processDeal("sample-deals/Due Diligence")`

### 2. `analyzeStage(dealPath, stage)`  
- **Purpose**: Loads deal data + stage specification for human analysis
- **Input**: Deal path + stage name (A-initial-intake, B-preliminary-analysis, etc.)
- **Output**: Presents deal data and spec requirements for human assessment
- **Example**: `analyzeStage("processed-deals/the-frank-2025-01", "A-initial-intake")`

### 3. `updateAnalysisJourney(dealPath, stageAnalysis)`
- **Purpose**: Appends human analysis to AnalysisJourney.md  
- **Input**: Deal path + human analysis text
- **Output**: Updates audit trail with timestamped analysis
- **Example**: `updateAnalysisJourney(dealPath, "My detailed analysis...")`

### 4. `moveDeal(dealPath, fromStage, toStage, decision)`
- **Purpose**: Moves deal through pipeline folders based on decision
- **Input**: Paths, stage names, decision (ADVANCE/REJECT/REQUEST_MORE_INFO)
- **Output**: Relocates deal files and updates pipeline tracking
- **Example**: `moveDeal(dealPath, "A-initial-intake", "B-preliminary-analysis", "ADVANCE")`

## 🔄 Clean Workflow

```
1. You: Call processDeal("sample-deals/Due Diligence")
2. Tool: Creates structured files in processed-deals/

3. You: Call analyzeStage(dealPath, "A-initial-intake") 
4. Tool: Loads deal.json + stage-1-initial-intake.md, presents both to you

5. You: I analyze The Frank against the spec and give you my assessment
6. You: Call updateAnalysisJourney(dealPath, myAnalysis)
7. Tool: Appends my analysis to AnalysisJourney.md

8. You: Call moveDeal(dealPath, "A-initial-intake", "B-preliminary-analysis", "ADVANCE")
9. Tool: Moves deal files to next pipeline stage
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Test the MCP tools
npm run demo-mcp

# Or use individual commands:
npm run mcp-tools                                    # List available tools
npm run mcp-process "sample-deals/Due Diligence"     # Process a deal
npm run mcp-analyze processed-deals/deal-folder A-initial-intake  # Analyze stage
```

## 📁 Project Structure

```
domos-underwriter-engine/
├── src/
│   ├── mcp-server.ts        # 🔧 Main MCP server with 4 tools
│   ├── deal-manager.ts      # 📊 Deal parsing and structuring  
│   ├── demo-mcp.ts          # 🧪 End-to-end demo script
│   └── ...
├── sample-deals/
│   └── Due Diligence/       # 📄 Sample deal documents
├── processed-deals/         # 📁 Output folder for structured deals
├── pipeline/                # 🏗️ Pipeline stage folders (auto-created)
│   ├── A-initial-intake/
│   ├── B-preliminary-analysis/
│   └── ...
└── specs/                   # 📋 Stage specification files
    ├── stage-1-initial-intake.md
    ├── stage-2-preliminary-analysis.md
    └── ...
```

## 🎯 Key Benefits

**Clean Separation**: MCP tools handle file operations, humans handle analysis decisions

**Transparent Audit Trail**: Every analysis and decision recorded in AnalysisJourney.md

**Simple Interface**: Just 4 tools cover the entire deal workflow  

**Human Control**: You make all investment decisions, system just tracks and organizes

**Pipeline Management**: Automatic deal progression through standardized stages

## 🧪 Demo Output

When you run `npm run demo-mcp`:

```
🚀 Starting Domos MCP Server Demo

📋 Available MCP Tools:
  • processDeal: Process a deal from due diligence folder
  • analyzeStage: Load deal data and stage specification for human analysis  
  • updateAnalysisJourney: Append human analysis to AnalysisJourney.md
  • moveDeal: Move deal through pipeline folders based on decision

🔄 Step 1: Processing sample deal...
✅ Deal Processed Successfully
Deal: The Frank
Deal ID: the-frank-1738123456789
Output Path: processed-deals/the-frank-2025-01-29T12-34-56

🔍 Step 2: Loading initial intake analysis...
📋 Stage Initial Intake Analysis Ready
[Presents deal data + stage specification for human analysis]

🤖 Step 3: Simulating human analysis...
✅ Analysis Journey Updated
[Records human analysis with timestamp]

📦 Step 4: Moving deal to next stage...
✅ Deal Moved Successfully
From: A-initial-intake → To: B-preliminary-analysis
Next Step: Call analyzeStage() to continue analysis

✅ Demo completed successfully!
```

## 📚 Available Commands

```bash
npm run mcp-tools           # List all available MCP tools
npm run demo-mcp           # Run full end-to-end demo
npm run mcp-process        # Process deal from due diligence  
npm run mcp-analyze        # Analyze specific stage
npm run build              # Compile TypeScript
npm run help               # Show all available commands
```

## 🔧 Technical Details

- **TypeScript**: Fully typed with structured interfaces
- **File-Based**: No database required, pure file system operations  
- **Module Architecture**: Clean separation between MCP server and deal processing
- **Error Handling**: Graceful handling of missing files and malformed data
- **Audit Trail**: Complete decision history in markdown format

This approach is much cleaner than trying to automate the analysis - you become the agent in the loop, and MCP tools handle the boring file operations!
