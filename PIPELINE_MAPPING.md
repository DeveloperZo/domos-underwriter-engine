# Pipeline-to-Specification Mapping

## Overview
This document defines the 1:1 mapping between pipeline stages (WHERE deals are located) and specification files (HOW to analyze deals). The agent uses a deal's pipeline location to determine which specification to apply.

## Architecture Principles

### Two-Layer System
1. **Pipeline Layer** (`/pipeline/`) - **State Management**
   - Physical storage and tracking of deal files
   - Workflow progression through stages
   - Deal status within each stage (not-started, in-progress, completed, rejected)

2. **Specifications Layer** (`/specs/`) - **Business Logic**
   - Analysis methodologies and decision criteria
   - Business rules for each stage
   - Output formats and requirements

### Agent Processing Logic
```
1. Agent scans pipeline directories for deals needing processing
2. Based on pipeline location, agent selects appropriate specification file
3. Agent applies specification logic to analyze the deal
4. Based on analysis result, agent moves deal to next state/stage
```

## Complete Pipeline-to-Specification Mapping

| Pipeline Stage | Specification File | Purpose | Possible Outcomes |
|---------------|-------------------|---------|-------------------|
| **A-initial-intake** | `stage-1-initial-intake.md` | First contact screening and data validation | ADVANCE → B/, REJECT, REQUEST_MORE_INFO |
| **B-preliminary-analysis** | `stage-2-preliminary-analysis.md` | Financial screening and preliminary underwriting | ADVANCE → C/, REJECT, REQUEST_MORE_INFO |
| **C-full-underwriting** | `stage-3-full-underwriting.md` | Comprehensive financial analysis and risk assessment | ADVANCE → D/, REJECT, REVISIONS_REQUIRED |
| **D-ic-review** | `stage-4-ic-recommendation.md` | Investment Committee presentation and recommendation | ADVANCE → E/, REVISIONS_REQUIRED |
| **E-loi-psa** | `stage-5-legal-transaction.md` | Letter of Intent and Purchase & Sale Agreement | ADVANCE → F/, REJECT |
| **F-final-approval** | `stage-6-final-approval.md` | Final investment committee approval | ADVANCE → G/, REJECT |
| **G-closing** | `stage-7-closing.md` | Transaction closing and completion | COMPLETED |

## Stage Substates

Each pipeline stage contains substates that track deal processing status:

### Standard Substates
- **not-started/**: Deals waiting to be processed
- **in-progress/**: Deals currently being analyzed
- **completed/**: Deals that passed this stage
- **rejected/**: Deals that failed this stage

### Special Substates
- **revisions-required/**: (D-ic-review only) Deals needing additional work
- Additional substates may exist based on stage-specific requirements

## Agent Processing Workflow

### 1. Deal Discovery
```typescript
// Scan pipeline for deals needing processing
const pendingDeals = await scanPipelineForPendingDeals();
// Returns deals in not-started/ and in-progress/ folders
```

### 2. Specification Selection  
```typescript
// Determine which spec to use based on pipeline location
function getSpecificationForStage(pipelineStage: string): string {
  const mapping = {
    'A-initial-intake': 'stage-1-initial-intake.md',
    'B-preliminary-analysis': 'stage-2-preliminary-analysis.md', 
    'C-full-underwriting': 'stage-3-full-underwriting.md',
    'D-ic-review': 'stage-4-ic-recommendation.md',
    'E-loi-psa': 'stage-5-legal-transaction.md',
    'F-final-approval': 'stage-6-final-approval.md',
    'G-closing': 'stage-7-closing.md'
  };
  return mapping[pipelineStage];
}
```

### 3. Deal Processing
```typescript
// Apply specification to deal
const analysisResult = await applySpecification(specFile, dealData);

// Move deal based on result  
await moveDealBasedOnResult(deal, analysisResult);
```

### 4. State Transitions
```typescript
// Move deal to next stage or substate based on analysis outcome
function moveDealBasedOnResult(deal, result) {
  switch(result.recommendation) {
    case 'ADVANCE':
      return moveDealToNextStage(deal);
    case 'REJECT': 
      return moveDealToRejected(deal);
    case 'REQUEST_MORE_INFO':
      return keepDealInProgress(deal);
    case 'REVISIONS_REQUIRED':
      return moveDealToRevisions(deal);
  }
}
```

## Specification File Requirements

Each specification file must include:

### Required Sections
- **Purpose**: Clear description of stage objectives
- **Required Data Inputs**: What information is needed
- **Analysis Process**: Step-by-step methodology  
- **Decision Criteria**: Clear pass/fail/conditional criteria
- **Output Format**: JSON schema for results
- **Pipeline Integration**: How results map to state transitions

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

## State Transition Rules

### Advancement Rules
- Deal must meet ALL criteria in specification to ADVANCE
- ADVANCE moves deal to next stage's not-started/ folder
- Deals advance sequentially through stages (no skipping)

### Rejection Rules  
- Any critical failure triggers REJECT
- REJECT moves deal to current stage's rejected/ folder
- Rejected deals require manual review to re-enter pipeline

### Information Request Rules
- REQUEST_MORE_INFO keeps deal in current stage's in-progress/ folder
- Deal remains there until additional information is provided
- Once info is provided, deal is re-analyzed with same specification

### Revision Rules (IC Review Stage Only)
- REVISIONS_REQUIRED moves deal to D-ic-review/revisions-required/ folder
- Deal returns to earlier stage if fundamental changes needed
- Minor revisions can be addressed within IC review stage

## Implementation Notes

### File Organization
```
/pipeline/A-initial-intake/not-started/deal-123/
├── deal.json
├── rent-roll.pdf  
└── t12-financials.pdf

/specs/stage-1-initial-intake.md  # Applied to deals in A-initial-intake/
```

### Agent Initialization
```typescript
// Agent starts by scanning all pipeline stages for pending work
const workQueue = await buildWorkQueue();
// Processes deals in priority order across all stages
```

### Error Handling
- Failed analysis attempts are logged and dealt flagged for manual review
- Specification parsing errors halt processing and alert administrators
- Data validation failures trigger REQUEST_MORE_INFO rather than rejection

### Performance Considerations  
- Agent processes multiple deals in parallel where possible
- Specifications are cached to avoid repeated file system reads
- Deal movements are batched to reduce file system operations

## Monitoring and Reporting

### Key Metrics
- Deals processed per stage per day
- Average time spent in each stage
- Rejection rates by stage and reason
- Bottlenecks in pipeline progression

### Pipeline Health Indicators
- Stages with excessive in-progress deals (bottlenecks)
- High rejection rates indicating specification issues
- Deals stuck in revision cycles

## Extension Guidelines

### Adding New Stages
1. Create new pipeline directory with standard substates
2. Create corresponding specification file following template
3. Update mapping configuration
4. Test with sample deals

### Modifying Existing Stages
1. Update specification file following change control process
2. Test changes with historical deals to ensure consistency
3. Update documentation and agent logic if needed
4. Monitor pipeline for unexpected behavior

---

**Last Updated**: [Current Date]  
**Version**: 1.0  
**Maintained By**: Domos Development Team
