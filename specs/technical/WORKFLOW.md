# Workflow & Process Flow

## Purpose
This document describes the operational workflow of the Domos Underwriter Engine, detailing how deals flow through the system and how human analysts interact with the automated analysis tools.

## Core MCP Tools

The system provides four main tools that facilitate the human-in-the-loop workflow:

### 1. `processDeal(dueDiligencePath)`
- **Purpose**: Transforms raw due diligence documents into structured data files
- **Input**: Path to folder containing due diligence documents
- **Output**: Structured JSON files (deal.json, tenants.json, financialSummary.json) and AnalysisJourney.md
- **Called by**: Human analyst at the beginning of the workflow

### 2. `analyzeStage(dealPath, stage, analysis?)`
- **Purpose**: Loads deal data and stage specification for analysis
- **Input**: Deal path, stage identifier, optional analysis text
- **Output**: Presents deal data and spec to the analyst/AI, optionally records analysis
- **Called by**: Human to initiate analysis, or AI to record analysis

### 3. `completeAnalysis(dealPath, stage, analysis)`
- **Purpose**: Records analysis decisions in the audit trail
- **Input**: Deal path, stage identifier, analysis text
- **Output**: Updates AnalysisJourney.md with timestamped analysis
- **Called by**: AI after performing analysis

### 4. `moveDeal(dealPath, fromStage, toStage, decision)`
- **Purpose**: Progresses deals through the pipeline based on analysis decisions
- **Input**: Deal path, source stage, destination stage, decision details
- **Output**: Relocates deal files and updates pipeline tracking
- **Called by**: Human analyst based on analysis recommendations

## Standard Workflow Sequence

```
1. Human: Call processDeal("sample-deals/DueDiligence")
   → System creates structured files in processed-deals/

2. Human: Call analyzeStage(dealPath, "A-initial-intake")
   → System loads deal.json + stage spec, presents for analysis

3. AI: Analyzes the deal against stage requirements
   → AI evaluates data against criteria in stage specification

4. AI: Call completeAnalysis(dealPath, stage, analysis)
   → System records analysis in AnalysisJourney.md

5. Human: Reviews AI recommendation and calls moveDeal()
   → System moves deal to next pipeline stage based on decision

6. Repeat steps 2-5 for each subsequent stage
```

## Pipeline Stages

Deals progress through a structured pipeline with defined stages:

1. **A-initial-intake**: Initial screening and qualification
2. **B-preliminary-analysis**: Financial screening and preliminary underwriting
3. **C-full-underwriting**: Comprehensive financial analysis
4. **D-ic-review**: Investment Committee review and recommendation
5. **E-loi-psa**: Letter of Intent and Purchase Agreement
6. **F-final-approval**: Final investment approval
7. **G-closing**: Transaction closing and completion

## Stage Substates

Each pipeline stage includes substates for tracking deal status:
- **not-started/**: Deals awaiting processing
- **in-progress/**: Deals currently being analyzed
- **completed/**: Deals that passed this stage
- **rejected/**: Deals that failed this stage
- **revisions-required/**: (Select stages) Deals needing additional work

## Audit Trail

The AnalysisJourney.md file serves as the system's audit trail, automatically capturing:
- Deal processing events
- Analysis decisions and recommendations
- Timestamps for all actions
- Reasoning behind decisions
- Red flags or issues identified

This creates a transparent, chronological record of the entire analysis process for compliance and review purposes.

## Human-in-the-Loop Design

The workflow maintains human oversight while leveraging AI capabilities:
- Humans control the workflow progression
- AI performs detailed analysis against specifications
- Humans make final decisions based on AI recommendations
- System automatically documents all steps for compliance
- Override capabilities exist for edge cases

## Implementation Notes

- The stage specifications (markdown files in `/specs/`) define the analysis criteria
- The pipeline directories (`/pipeline/`) manage deal state and progression
- Each deal maintains its complete history in AnalysisJourney.md
- The system enforces sequential progression through stages
- Edge case detection triggers additional review steps

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: zAITK (Zo AI Tool Kit) 
**Status**: Active  
**Related Issues**: #167, #205
