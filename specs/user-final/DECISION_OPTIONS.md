# Decision Options

## Purpose
This document explains the available decision options when analyzing deals in the Domos Underwriter Engine, including when to use each option and its impact on deal flow.

## Available Decisions

The system supports four decision options:

1. **ADVANCE**: Move deal forward to next stage
2. **REJECT**: End process for deal that fails criteria
3. **REQUEST_MORE_INFO**: Pause for additional information
4. **REVISIONS_REQUIRED**: Request changes before proceeding

## Decision Details

### ADVANCE
**Code**: `ADVANCE`

**Purpose**: Progress a deal that meets all stage criteria to the next pipeline stage

**When to Use**:
- Deal satisfies all critical requirements for the current stage
- Analysis is complete with sufficient confidence
- No blockers or red flags remain unaddressed
- Ready to proceed to more detailed analysis

**Pipeline Impact**:
- Moves deal from current stage's `completed/` folder to next stage's `not-started/` folder
- Updates deal status in metadata
- Prepares for next stage analysis

**Example**:
```bash
npm run mcp-move "processed-deals/franklin-towers-1720109458293" "A-initial-intake" "B-preliminary-analysis" "ADVANCE"
```

**Required Documentation**:
- Clear explanation of how deal meets all criteria
- Specific evidence supporting each key requirement
- Confidence level assessment
- Any watch items for next stage

### REJECT
**Code**: `REJECT`

**Purpose**: End the process for deals that fail to meet critical requirements

**When to Use**:
- Deal fails to meet one or more critical requirements
- Issues identified cannot be reasonably mitigated
- Returns fall significantly below required thresholds
- Fundamental deal thesis is flawed or unworkable

**Pipeline Impact**:
- Moves deal to current stage's `rejected/` folder
- Updates deal status to "rejected"
- Ends active processing of the deal

**Example**:
```bash
npm run mcp-move "processed-deals/franklin-towers-1720109458293" "A-initial-intake" "A-initial-intake" "REJECT"
```

**Required Documentation**:
- Specific criteria that were not met
- Quantification of gaps where possible
- Explanation of why issues cannot be mitigated
- Clear rationale for rejection decision

### REQUEST_MORE_INFO
**Code**: `REQUEST_MORE_INFO`

**Purpose**: Pause analysis until additional information is provided

**When to Use**:
- Critical information is missing to complete analysis
- Key assumptions cannot be validated with available data
- Additional third-party reports or verification needed
- Clarification required on deal terms or structure

**Pipeline Impact**:
- Keeps deal in current stage's `in-progress/` folder
- Updates deal status to reflect pending information
- Maintains position in current stage

**Example**:
```bash
npm run mcp-move "processed-deals/franklin-towers-1720109458293" "A-initial-intake" "A-initial-intake" "REQUEST_MORE_INFO"
```

**Required Documentation**:
- Specific information items needed
- Why each item is necessary for analysis
- Impact of missing information on decision-making
- Timeline expectations for receiving information

### REVISIONS_REQUIRED
**Code**: `REVISIONS_REQUIRED`

**Purpose**: Request changes to deal structure or terms before proceeding

**When to Use**:
- Deal structure needs modification to meet requirements
- Terms require negotiation or adjustment
- Financial structure needs reconfiguration
- Investment thesis needs significant revision

**Pipeline Impact**:
- Keeps deal in current stage's `in-progress/` folder
- Updates deal status to reflect pending revisions
- Maintains position in current stage

**Example**:
```bash
npm run mcp-move "processed-deals/franklin-towers-1720109458293" "C-full-underwriting" "C-full-underwriting" "REVISIONS_REQUIRED"
```

**Required Documentation**:
- Specific revisions requested
- Rationale for each revision
- Expected impact of revisions on deal viability
- Requirements for revisiting analysis

## Decision Matrix

Use this matrix to determine the appropriate decision:

| Condition | ADVANCE | REJECT | REQUEST_MORE_INFO | REVISIONS_REQUIRED |
|-----------|---------|--------|-------------------|-------------------|
| Meets all criteria | ✅ | | | |
| Fails critical criteria | | ✅ | | |
| Missing key information | | | ✅ | |
| Needs structural changes | | | | ✅ |
| Borderline performance | | | | ✅ |
| Incomplete documentation | | | ✅ | |
| Fundamental thesis issues | | ✅ | | |

## Stage-Specific Considerations

### Initial Intake (A-initial-intake)
- **ADVANCE**: Basic eligibility confirmed, documents available
- **REJECT**: Property type mismatch, size below threshold
- **REQUEST_MORE_INFO**: Missing essential documents

### Preliminary Analysis (B-preliminary-analysis)
- **ADVANCE**: Market and initial returns promising
- **REJECT**: Market fundamentals don't support thesis
- **REQUEST_MORE_INFO**: Incomplete financial data
- **REVISIONS_REQUIRED**: Pricing adjustment needed

### Full Underwriting (C-full-underwriting)
- **ADVANCE**: Complete model supports investment case
- **REJECT**: Returns below threshold, excessive risk
- **REQUEST_MORE_INFO**: Third-party reports needed
- **REVISIONS_REQUIRED**: Capital structure adjustments needed

### IC Review (D-ic-review)
- **ADVANCE**: Committee approves investment
- **REJECT**: Committee declines investment
- **REVISIONS_REQUIRED**: Committee requests modifications

## Decision Tracking

All decisions are recorded in the deal's AnalysisJourney.md file with:
- Timestamp of decision
- Decision maker identification
- Complete rationale
- Supporting evidence
- Next steps

## Related Documents
- [Core Commands](./CORE_COMMANDS.md) - How to execute decisions
- [Analysis Pipeline](./ANALYSIS_PIPELINE.md) - Complete pipeline overview

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Investment Team  
**Status**: Active
