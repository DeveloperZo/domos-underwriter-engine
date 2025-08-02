# User Guide

## Purpose
This guide provides practical instructions for using the Domos Underwriter Engine to analyze LIHTC preservation deals efficiently with institutional-grade analysis standards.

## System Overview

The Domos Underwriter Engine is a hybrid human-AI system that provides:

- **Speed & Efficiency**: Process deals in hours instead of weeks
- **Institutional-Grade Analysis**: Standardized evaluation with comprehensive criteria
- **Complete Transparency**: Full audit trail of all decisions and reasoning
- **Human Control**: You make all investment decisions while AI handles data processing

## Core Tools

The system provides four main tools for deal analysis:

### 1. Process Deal
```
processDeal("path/to/due-diligence")
```
- **Purpose**: Convert raw documents into structured data
- **Input**: Folder containing due diligence documents
- **Output**: Structured JSON files and analysis journal
- **When to Use**: At the start of every new deal

### 2. Analyze Stage
```
analyzeStage(dealPath, "A-initial-intake")
```
- **Purpose**: Load deal data and stage specification
- **Input**: Deal path and stage identifier
- **Output**: Relevant deal data and stage requirements
- **When to Use**: When beginning analysis of any stage

### 3. Complete Analysis
```
completeAnalysis(dealPath, stage, analysis)
```
- **Purpose**: Record analysis in the audit trail
- **Input**: Your assessment and recommendation
- **Output**: Updated analysis journal with timestamp
- **When to Use**: After completing your evaluation

### 4. Move Deal
```
moveDeal(dealPath, fromStage, toStage, decision)
```
- **Purpose**: Progress deals through the pipeline
- **Input**: Current stage, target stage, and decision
- **Output**: Deal moved to appropriate pipeline location
- **When to Use**: After making an investment decision

## Analysis Pipeline

Deals progress through a structured pipeline with defined stages:

| Stage | Code | Purpose | Key Focus Areas |
|-------|------|---------|-----------------|
| **Initial Intake** | `A-initial-intake` | Basic qualification | Property eligibility, data completeness |
| **Preliminary Analysis** | `B-preliminary-analysis` | Market validation | Market analysis, initial financials |
| **Full Underwriting** | `C-full-underwriting` | Complete analysis | Comprehensive financials, risk assessment |
| **IC Review** | `D-ic-review` | Final recommendation | Investment committee materials |
| **Transaction Management** | `E-G` | Execution phases | LOI/PSA, approval, closing |

Each stage includes four possible substates:
- **not-started/**: Deals awaiting processing
- **in-progress/**: Deals currently being analyzed
- **completed/**: Deals that passed this stage
- **rejected/**: Deals that failed this stage

## Step-by-Step Workflow

### Starting a New Deal
1. Collect all due diligence documents in one folder
2. Run `processDeal("path/to/documents")`
3. Note the output path for the processed deal
4. Run `analyzeStage(outputPath, "A-initial-intake")`
5. Assess the deal against stage requirements
6. Record your analysis using `completeAnalysis()`
7. Move to the next stage or reject using `moveDeal()`

### Continuing Analysis
1. Run `analyzeStage(dealPath, currentStage)`
2. Review deal data and stage requirements
3. Make your assessment against criteria
4. Record your analysis using `completeAnalysis()`
5. Advance or reject using `moveDeal()`

### Investment Committee Process
1. Prepare using `analyzeStage(dealPath, "D-ic-review")`
2. Generate IC presentation materials
3. Present to investment committee
4. Record decision using `completeAnalysis()`
5. Move to transaction phase or reject using `moveDeal()`

## Output Files

Each processed deal generates:
- **deal.json** - Property information and metadata
- **tenants.json** - Tenant data and occupancy information
- **financialSummary.json** - Financial metrics and NOI calculation
- **AnalysisJourney.md** - Complete audit trail of all analysis

The AnalysisJourney.md file serves as the system's audit trail, capturing:
- Deal processing events
- Analysis decisions and recommendations
- Timestamps for all actions
- Reasoning behind decisions
- Red flags or issues identified

## Best Practices

### Effective Analysis
- Follow stage specifications precisely
- Document all reasoning in detail
- Be consistent in applying criteria across deals
- Identify and address risks explicitly

### Quality Checklist
Before advancing any deal:
- Ensure all stage requirements are addressed
- Validate all financial assumptions
- Document key risks and mitigation strategies
- Record confidence level in your assessment
- Specify clear next steps

### Audit Trail Management
- Be specific in recording decision rationale
- Reference key documents that influenced decisions
- Note any assumptions made during analysis
- Update deal status consistently throughout process

## Troubleshooting

### Common Issues

**Processing Failures**
- Ensure documents are in supported formats (PDF, Excel, Word)
- Check that financial statements are readable (not scanned images)
- Verify folder structure and file permissions

**Missing Financial Data**
- Provide T12 statements in Excel format
- Include detailed rent roll with unit-by-unit data
- Add operating expense breakdown if available

**Analysis Issues**
- Review stage specification carefully
- Provide additional context in your analysis
- Break complex analyses into focused components
- Use specific, concrete examples

**Pipeline Movement Errors**
- Verify exact stage names (A-initial-intake, etc.)
- Check that decision codes are correct (ADVANCE, REJECT, etc.)
- Ensure deal path is accurate and accessible

## Related Resources
- [Setup Guide](./SETUP.md) - Installation and configuration
- [Quick Reference](./QUICK_REFERENCE.md) - Command summary
- [Stage Specifications](../stage_01/) - Detailed analysis criteria

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Product Team  
**Status**: Active
