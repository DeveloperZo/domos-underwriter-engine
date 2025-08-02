# Usage Guide

## Purpose
This document provides practical instructions for using the Domos Underwriter Engine to process and analyze LIHTC preservation deals.

## Core Commands

### Processing Deals
The engine converts raw deal documents into structured data:

```bash
npm run process-deal <input-folder-name> [output-folder-name]
```

**Example:**
```bash
npm run process-deal "sample-deals/the-frank"
```

This processes documents from the specified folder and creates structured JSON files in `processed-deals/the-frank-[timestamp]`.

### Analyzing Deals
Run a deal through any stage of the nine-stage framework:

```bash
npm run analyze-to-stage <deal-path> <stage-number> [--force]
```

**Example:**
```bash
npm run analyze-to-stage "processed-deals/the-frank-1720109458293" 4
```

This analyzes the deal through stage 4 (Financial Underwriting).

### Checking Status
View the current status of a processed deal:

```bash
npm run status <deal-path>
```

## Output Files

Each processed deal generates:
- **deal.json** - Property information and metadata
- **tenants.json** - Tenant data and occupancy information
- **financialSummary.json** - Financial metrics and NOI calculation
- **AnalysisJourney.md** - Processing log and stage results

## Stage Analysis Output

Each analysis stage produces:
- **DecisionSummary.md** - Plain-language explanation
- **InputTrace.md** - Source data tracking
- **RedFlagsRaised.md** - Issues detected
- **OverrideNotes.md** - (if needed) Manual intervention notes

## Troubleshooting

**Common Issues:**
- Ensure input folder exists in the correct location
- Check file formats match expected templates
- Verify Excel files have properly named sheets
- For process errors, check console output for detailed messages

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Engineering Team  
**Status**: Active
