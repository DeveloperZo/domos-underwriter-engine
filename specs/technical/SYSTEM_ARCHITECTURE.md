# System Architecture & Pipeline

## Purpose
This document provides a comprehensive overview of the Domos Underwriter Engine architecture, including its core components, processing pipeline, and technical implementation details for developers and system integrators.

## System Overview

### Core Components

#### 1. Processing Engine
- **Document Parser**: Extracts structured data from deal documents
- **Deal Manager**: Manages deal metadata and processing state
- **Stage Processor**: Handles the progression through analysis stages
- **Output Generator**: Creates standardized reports and presentations

#### 2. Pipeline System
- **Active Deals Pipeline**: Manages workflow through processing stages
- **Transparency Layer**: Provides explainable decisions with audit trails
- **Override Interface**: Allows manual intervention for edge cases
- **Analytics System**: Tracks performance and generates insights

#### 3. Storage & Data Management
- **Deal Repository**: Structured storage for processed deals
- **Specification Repository**: Business rules and analysis criteria
- **Template Library**: Standardized output templates
- **Archive System**: Historical deal storage with search capabilities

## Pipeline Architecture

### Two-Layer Design
The system uses a clear separation between state management and business logic:

#### 1. Pipeline Layer (`/pipeline/`)
Manages the **WHERE** - physical storage and workflow state:
- Deal location in the processing pipeline
- Status tracking and state transitions
- Physical file organization and versioning

#### 2. Specifications Layer (`/specs/`)
Defines the **HOW** - business rules and analysis criteria:
- Analysis methodologies for each stage
- Decision criteria and thresholds
- Output requirements and formats

### Pipeline-to-Specification Mapping

| Pipeline Stage | Specification File | Purpose | Outcomes |
|---------------|-------------------|---------|----------|
| **A-initial-intake** | `stage-1-initial-intake.md` | Initial screening | ADVANCE, REJECT, REQUEST_INFO |
| **B-preliminary-analysis** | `stage-2-preliminary-analysis.md` | Financial screening | ADVANCE, REJECT, REQUEST_INFO |
| **C-full-underwriting** | `stage-3-full-underwriting.md` | Comprehensive analysis | ADVANCE, REJECT, REVISIONS |
| **D-ic-review** | `stage-4-ic-recommendation.md` | IC presentation | ADVANCE, REVISIONS |
| **E-loi-psa** | `stage-5-legal-transaction.md` | Transaction docs | ADVANCE, REJECT |
| **F-final-approval** | `stage-6-final-approval.md` | Final approval | ADVANCE, REJECT |
| **G-closing** | `stage-7-closing.md` | Closing process | COMPLETED |

### Stage Substates
Each pipeline stage contains substates for tracking:
- **not-started/**: Deals waiting to be processed
- **in-progress/**: Deals currently being analyzed
- **completed/**: Deals that passed this stage
- **rejected/**: Deals that failed this stage
- **revisions-required/**: (Selected stages) Deals needing additional work

## Processing Workflows

### 1. Deal Intake Workflow
```
1. Document upload to sample-deals/{deal-name}
2. Process command execution (npm run process-deal)
3. Document parsing and data extraction
4. Structured data creation (deal.json, tenants.json, etc.)
5. Deal placement in initial pipeline stage
```

### 2. Analysis Workflow
```
1. Deal discovery in pipeline stage
2. Specification selection based on stage
3. Application of analysis rules from specification
4. Decision generation with explanation
5. State transition based on analysis outcome
6. Output generation (DecisionSummary.md, etc.)
```

### 3. Transparency Workflow
```
1. Logging of all processing steps in AnalysisJourney.md
2. Input source tracking in InputTrace.md
3. Anomaly detection and recording in RedFlagsRaised.md
4. Manual override tracking in OverrideNotes.md (if triggered)
```

## Technical Implementation

### Directory Structure
```
/DomosDealEvaluation/
├── /SystemCore/
│   ├── /TransparencyLayer/
│   ├── /StageSpecifications/
│   ├── /AnalyticalTemplates/
│   └── /SystemPerformance/
├── /ActiveDeals/
└── /ArchiveDeals/
```

### Technology Stack
- **TypeScript/Node.js**: Core application logic
- **Python**: Analytical processing and modeling
- **Excel/XLSX**: Financial data processing
- **Markdown**: Documentation and specification format
- **JSON**: Structured data storage

### Key Processing Code

#### Deal Discovery
```typescript
// Scan pipeline for deals needing processing
const pendingDeals = await scanPipelineForPendingDeals();
```

#### Specification Selection
```typescript
// Determine which spec to use based on pipeline location
function getSpecificationForStage(pipelineStage: string): string {
  const mapping = {
    'A-initial-intake': 'stage-1-initial-intake.md',
    'B-preliminary-analysis': 'stage-2-preliminary-analysis.md',
    // Additional stages...
  };
  return mapping[pipelineStage];
}
```

#### Deal Processing
```typescript
// Apply specification to deal
const analysisResult = await applySpecification(specFile, dealData);

// Move deal based on result
await moveDealBasedOnResult(deal, analysisResult);
```

### Standard Output Schema
```json
{
  "dealId": "string",
  "timestamp": "ISO-8601",
  "stage": "1|2|3|4|5|6|7",
  "stageName": "string", 
  "recommendation": "ADVANCE|REJECT|REQUEST_MORE_INFO|REVISIONS_REQUIRED",
  "reasoning": "string",
  "nextSteps": "string[]",
  // Stage-specific analysis data...
}
```

## Performance Considerations
- Parallel processing of multiple deals
- Caching of specifications and templates
- Efficient file system operations
- Optimized document parsing for large files

## Error Handling & Recovery
- Comprehensive logging of all processing steps
- Graceful failure modes with clear error messages
- Automatic retry mechanisms for transient failures
- Manual override capability for edge cases

## Security & Compliance
- Input validation and sanitization
- Audit logging of all system actions
- Role-based access control
- Secure storage of sensitive deal information

## Extension Points
- Custom specification development
- Pipeline stage customization
- Integration with external data sources
- Custom output format generation

## Related Documents
- [API Documentation](./API_DOCUMENTATION.md)
- [Usage Guide](./USAGE.md)

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: zAITK (Zo AI Tool Kit) 
**Status**: Active  
**Related Issues**: #112, #145, #201
