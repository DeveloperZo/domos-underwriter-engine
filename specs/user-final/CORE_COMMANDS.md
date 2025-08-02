# Core Commands

## Purpose
This document provides a reference for all essential commands in the Domos Underwriter Engine with syntax, parameters, and examples.

## Command Overview

The system provides four primary commands:
1. `mcp-process` - Process deal documents into structured data
2. `mcp-analyze` - Load and analyze a deal stage
3. `mcp-complete` - Record analysis in the audit trail
4. `mcp-move` - Move deals through the pipeline

## Detailed Command Reference

### Process Deal
```bash
npm run mcp-process <document-path>
```

**Purpose**: Converts raw due diligence documents into structured data

**Parameters**:
- `document-path`: Path to folder containing due diligence documents

**Example**:
```bash
npm run mcp-process "sample-deals/franklin-towers"
```

**Output**:
- Structured JSON files in the `processed-deals/` directory
- Initial AnalysisJourney.md file
- Console confirmation with output path

**Notes**:
- Best results with Excel files for financial data
- PDF documents are parsed for text content
- Automatically creates timestamped output folder

### Analyze Stage
```bash
npm run mcp-analyze <deal-path> <stage-code>
```

**Purpose**: Loads deal data and stage requirements for analysis

**Parameters**:
- `deal-path`: Path to processed deal folder
- `stage-code`: Pipeline stage identifier (e.g., "A-initial-intake")

**Example**:
```bash
npm run mcp-analyze "processed-deals/franklin-towers-1720109458293" "A-initial-intake"
```

**Output**:
- Displays deal data and stage specification
- Prepares for analysis input
- Shows previous analysis history if available

**Notes**:
- Stage codes must match exactly (case-sensitive)
- Can be run multiple times for the same stage
- Shows all available deal data for the specified stage

### Complete Analysis
```bash
npm run mcp-complete <deal-path> <stage-code> <analysis-text>
```

**Purpose**: Records analysis decisions in the audit trail

**Parameters**:
- `deal-path`: Path to processed deal folder
- `stage-code`: Pipeline stage identifier
- `analysis-text`: Your detailed analysis and recommendation

**Example**:
```bash
npm run mcp-complete "processed-deals/franklin-towers-1720109458293" "A-initial-intake" "Property meets basic criteria. All required documents provided. Recommend ADVANCE to preliminary analysis."
```

**Output**:
- Updates AnalysisJourney.md with timestamped entry
- Console confirmation of recorded analysis
- Preserved decision rationale

**Notes**:
- Analysis text should include clear recommendation
- Can be run multiple times to add additional analysis
- All entries are preserved in chronological order

### Move Deal
```bash
npm run mcp-move <deal-path> <from-stage> <to-stage> <decision>
```

**Purpose**: Progresses deals through the pipeline based on analysis

**Parameters**:
- `deal-path`: Path to processed deal folder
- `from-stage`: Current pipeline stage
- `to-stage`: Target pipeline stage
- `decision`: Decision code (ADVANCE, REJECT, REQUEST_MORE_INFO, REVISIONS_REQUIRED)

**Example**:
```bash
npm run mcp-move "processed-deals/franklin-towers-1720109458293" "A-initial-intake" "B-preliminary-analysis" "ADVANCE"
```

**Output**:
- Deal moved to appropriate pipeline folder
- Status updated in deal.json
- Console confirmation of move operation

**Notes**:
- Stage codes must match exactly (case-sensitive)
- Decision codes must be one of the defined options
- Sequential progression through stages is enforced

## Additional Utility Commands

### Check Status
```bash
npm run status
```

**Purpose**: Displays the current status of all deals in the pipeline

**Example**:
```bash
npm run status
```

**Output**:
- Summary of deals in each pipeline stage
- Count of deals by status
- Details of any in-progress analyses

### Run Demo
```bash
npm run demo-mcp
```

**Purpose**: Runs a demonstration of the complete workflow

**Example**:
```bash
npm run demo-mcp
```

**Output**:
- Step-by-step demonstration using sample data
- Confirmation of each step's success
- Example of full processing workflow

### Get Help
```bash
npm run help
```

**Purpose**: Displays help information for system commands

**Example**:
```bash
npm run help
```

**Output**:
- List of available commands
- Brief description of each command
- Suggestions for further documentation

## Command Cheat Sheet

| Task | Command |
|------|---------|
| Process new deal | `npm run mcp-process "sample-deals/folder-name"` |
| Begin analysis | `npm run mcp-analyze "processed-deals/deal-path" "A-initial-intake"` |
| Record decision | `npm run mcp-complete "processed-deals/deal-path" "A-initial-intake" "Analysis text..."` |
| Advance deal | `npm run mcp-move "processed-deals/deal-path" "A-initial-intake" "B-preliminary-analysis" "ADVANCE"` |
| Reject deal | `npm run mcp-move "processed-deals/deal-path" "A-initial-intake" "A-initial-intake" "REJECT"` |
| Request more info | `npm run mcp-move "processed-deals/deal-path" "A-initial-intake" "A-initial-intake" "REQUEST_MORE_INFO"` |
| Check status | `npm run status` |

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Engineering Team  
**Status**: Active
