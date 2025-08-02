# Analysis Pipeline

## Purpose
This document explains the nine-stage analysis pipeline used by the Domos Underwriter Engine to evaluate LIHTC preservation investment opportunities.

## Pipeline Overview

The analysis pipeline consists of these sequential stages:

1. **Initial Intake** (A-initial-intake)
2. **Preliminary Analysis** (B-preliminary-analysis)
3. **Full Underwriting** (C-full-underwriting)
4. **IC Review** (D-ic-review)
5. **LOI/PSA** (E-loi-psa)
6. **Final Approval** (F-final-approval)
7. **Closing** (G-closing)

Each stage has four possible substates:
- **not-started/**: Deals awaiting processing
- **in-progress/**: Deals currently being analyzed
- **completed/**: Deals that passed this stage
- **rejected/**: Deals that failed this stage

## Stage Details

### Stage 1: Initial Intake (A-initial-intake)
**Purpose**: Basic qualification and initial screening

**Key Criteria**:
- Property meets basic eligibility (20+ units, LIHTC eligible)
- Required documentation is available
- Initial data completeness check
- Timeline alignment with acquisition strategy

**Typical Duration**: 1-2 hours

**Required Documents**:
- Basic property information
- Asking price
- Preliminary financials
- Location details

**Output Decision**:
- ADVANCE: Meets basic criteria, proceed to preliminary analysis
- REJECT: Fails to meet fundamental requirements
- REQUEST_MORE_INFO: Critical information missing

### Stage 2: Preliminary Analysis (B-preliminary-analysis)
**Purpose**: Market validation and initial financial screening

**Key Criteria**:
- Market analysis supports investment thesis
- Preliminary financial metrics meet targets
- Property condition assessment
- Competition and timing analysis

**Typical Duration**: 4-6 hours

**Required Documents**:
- T12 financials
- Complete rent roll
- Market studies
- Property condition reports

**Output Decision**:
- ADVANCE: Initial returns and market analysis support investment
- REJECT: Market or financial metrics don't support thesis
- REQUEST_MORE_INFO: Additional data needed for key assumptions

### Stage 3: Full Underwriting (C-full-underwriting)
**Purpose**: Comprehensive financial analysis and risk assessment

**Key Criteria**:
- Detailed financial modeling
- LIHTC compliance analysis
- Risk identification and mitigation
- Return projections with sensitivity analysis

**Typical Duration**: 8-12 hours

**Required Documents**:
- Complete due diligence package
- Detailed operating statements
- Capital needs assessment
- LIHTC compliance history

**Output Decision**:
- ADVANCE: Full analysis supports investment case
- REJECT: Detailed analysis reveals insurmountable issues
- REVISIONS_REQUIRED: Adjustments needed to investment thesis

### Stage 4: IC Review (D-ic-review)
**Purpose**: Investment committee presentation and decision

**Key Criteria**:
- Executive summary preparation
- Complete investment recommendation
- Risk/return presentation
- LP-facing materials

**Typical Duration**: 2-4 hours

**Required Documents**:
- IC memo
- Presentation deck
- Financial models
- Risk assessment summary

**Output Decision**:
- ADVANCE: Investment committee approves deal
- REJECT: Investment committee declines deal
- REVISIONS_REQUIRED: Committee requests modifications

### Stages 5-7: Transaction Management
**Stage 5: LOI/PSA (E-loi-psa)**
- Focus on legal documentation and transaction terms
- Negotiation of purchase agreement
- Deal structure finalization

**Stage 6: Final Approval (F-final-approval)**
- Final sign-off from all stakeholders
- Funding approval
- Final diligence clearance

**Stage 7: Closing (G-closing)**
- Transaction execution
- Funding coordination
- Asset management transition

## Pipeline Workflow Visualization

```
A-initial-intake/ → B-preliminary-analysis/ → C-full-underwriting/ → D-ic-review/ → E-loi-psa/ → F-final-approval/ → G-closing/
    ↓                      ↓                        ↓                    ↓              ↓                 ↓                ↓
not-started/           not-started/             not-started/         not-started/   not-started/      not-started/     not-started/
in-progress/           in-progress/             in-progress/         in-progress/   in-progress/      in-progress/     in-progress/
completed/             completed/               completed/           completed/     completed/        completed/       completed/
rejected/              rejected/                rejected/            rejected/      rejected/         rejected/        rejected/
```

## Stage Gate Decision Process

At each pipeline stage:

1. **Analyze**: Evaluate deal against stage-specific criteria
2. **Decide**: Make a determination based on analysis
3. **Document**: Record rationale in the audit trail
4. **Move**: Progress deal to the appropriate next stage

## Stage Specifications

Each stage has a detailed specification document in the `/specs/` directory:
- Initial Intake: `/specs/stage_01/stage-1-initial-intake.md`
- Preliminary Analysis: `/specs/stage_02/stage-2-preliminary-analysis.md`
- Full Underwriting: `/specs/stage_03/stage-3-full-underwriting.md`
- IC Review: `/specs/stage_04/stage-4-ic-recommendation.md`
- Transaction Stages: `/specs/stage_05/` through `/specs/stage_07/`

These specifications define the exact criteria, required inputs, and decision processes for each stage.

## Key Performance Indicators

### Pipeline Efficiency
- **Time to Decision**: Target <3 business days per stage
- **Conversion Rate**: % of deals advancing to next stage
- **Completion Rate**: % of started deals reaching closing

### Analysis Quality
- **Decision Accuracy**: Alignment of actual vs. projected returns
- **Risk Identification**: % of actual risks identified during analysis
- **Compliance Success**: Zero LIHTC compliance issues missed

## Related Documents
- [Core Commands](./CORE_COMMANDS.md) - Commands for pipeline operations
- [Decision Options](./DECISION_OPTIONS.md) - Details on decision choices

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Investment Team  
**Status**: Active
