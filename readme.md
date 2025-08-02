# Domos LIHTC AI Underwriter - MVP

## File-Based Deal Processing System

This MVP demonstrates the core concept of processing LIHTC preservation deals through a structured file-based workflow with audit trails.

### 🏗️ Deal Structure

Each processed deal creates the following folder structure:

```
sample-deals/
├── SourceDocuments/          # Original files (copied/referenced)
│   ├── Rent Roll.xlsx
│   ├── Income Statement.xlsx
│   └── ...
├── Structured/               # Parsed JSON data
│   ├── deal.json            # Main deal object
│   ├── tenants.json         # Rent roll and tenant data
│   └── financialSummary.json # Financial analysis
├── Outputs/                  # Stage analysis outputs (coming in Task 2)
│   ├── Stage01_StrategicQualification.md
│   ├── Stage02_MarketIntel.md
│   └── ...
└── AnalysisJourney/         # Audit trail (coming in Task 2)
    └── auditLog.json        # Digital ledger of all decisions
```

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Parse deal documents 
npm run process-deal sample-deals

# Option 1: Process to specific stage
npm run process-to-stage sample-deals 3  # Through DueDiligence
npm run status sample-deals              # Check progress

# Option 2: Process all stages at once
npm run demo-stages sample-deals         # Full pipeline

# Total time: < 1 minute
```

**Expected Output**:
- `sample-deals/Structured/` - Parsed JSON data (deal.json, tenants.json, financialSummary.json)
- `sample-deals/Outputs/` - 6 stage analysis reports (.md files)  
- `sample-deals/AnalysisJourney/auditLog.json` - Complete decision audit trail

📝 **[Full Command Documentation](COMMANDS.md)** - Detailed usage and expected outputs

### 📊 What Gets Parsed

- **Excel Files**: Rent rolls, financial statements (T12)
- **PDF Files**: DueDiligence documents (categorized)
- **Deal Object**: Property details, LIHTC info, financial metrics
- **Tenant Data**: Unit details, occupancy, rent information
- **Financial Summary**: Income, expenses, NOI, key ratios

### 🎯 MVP Features Complete

✅ **File Structure Creation**: Standard folder hierarchy
✅ **Document Parsing**: Excel rent rolls and financial statements
✅ **Data Structuring**: JSON objects for deal, tenants, financials
✅ **Stage Processing**: 6-stage gate system with decision logic
✅ **Audit Logging**: Complete decision trail in AnalysisJourney/auditLog.json
✅ **Markdown Outputs**: Human-readable stage analysis reports
✅ **Flexible Parsing**: Handles missing documents gracefully
✅ **The Frank Demo**: Works with real sample deal data

### 🔄 Next Steps (Tasks 3-4)

- **Pipeline Orchestration**: Automated deal progression through all stages
- **Status Tracking**: Pipeline visibility and batch processing
- **Report Generation**: Final investment recommendations and executive summaries

### 🔧 Architecture

- **DealManager**: Main orchestration class
- **ExcelParser**: Handles .xlsx files with flexible column mapping
- **TypeScript**: Full type safety with structured interfaces
- **File-Based**: No database required, pure file system operations

### 📁 Key Files

- `src/deal-manager.ts` - Main deal processing logic
- `src/stage-processor.ts` - Stage-based gate processing system
- `src/audit-logger.ts` - Audit trail management and logging
- `src/parsers/excel-parser.ts` - Excel document parsing
- `src/types/deal-structure.ts` - TypeScript interfaces for deals
- `src/types/audit-types.ts` - TypeScript interfaces for audit trail
- `src/process-deal.ts` - CLI for document parsing
- `src/process-to-stage.ts` - CLI for stage-specific processing
- `src/check-status.ts` - CLI for status checking
- `src/demo-stages.ts` - CLI for full pipeline demo

This MVP demonstrates the core concept: transform unstructured deal documents into structured data objects that can flow through automated underwriting stages while maintaining full audit trails.

### 🎯 Success Criteria

The MVP successfully:
1. ✅ Parses The Frank sample deal Excel files (rent roll, T12 financials)
2. ✅ Creates proper folder structure with deal.json, tenants.json, financialSummary.json
3. ✅ Extracts structured data matching expected Deal interface
4. ✅ Handles missing documents gracefully with error handling
5. ✅ Provides clear CLI output showing parsed deal metrics

### 🧪 Demo Output

When you run `npm run process-deal`, you'll see:

```
🚀 Domos Deal Processing MVP Demo
=====================================

🔄 Processing deal from: /sample-deals
📁 Found X source documents
🔍 Parsing documents...
📊 Parsing rent roll: Rent Roll.xlsx
💰 Parsing financials: The Frank Consolidated Income Statement.xlsx
💾 Saved structured data to JSON files
✅ Successfully processed deal: The Frank

📋 Deal Processing Summary:
============================
Deal ID: deal_123456789_abcdef
Property: The Frank
Total Units: 150
Annual Gross Rent: $1,800,000
Net Operating Income: $1,200,000
Occupancy Rate: 95.0%
...
```

Ready for stage-based processing in Task 2!
