# Project Structure Analysis Report
**Domos LIHTC Underwriter Engine - Consolidation Analysis**

## Executive Summary

The Domos LIHTC Underwriter Engine project contains significant structural duplications and organizational inconsistencies that impede maintainability and clarity. This analysis identifies specific overlaps and provides a roadmap for consolidation into a unified specification-driven architecture aligned with the "Plan Two+" vision.

## Current Structure Issues

### 1. Duplicate Workflow Paradigms

**Problem**: The project implements two competing approaches:
- **File-based pipeline**: `/pipeline/` directory with A-initial-intake, B-preliminary-analysis, C-full-underwriting
- **Specification-driven**: `/specs/` directory with gate-A, gate-B, gate-C markdown files

**Impact**: Confusion about primary workflow method, duplicate maintenance overhead, unclear agent processing path.

### 2. Content Overlap Analysis

#### High Overlap (80%+ similarity):
- **`deal-intake.md` vs `gate-A-initial-intake.md`**
  - Both handle initial deal validation and screening
  - Similar data requirements and decision criteria
  - Different JSON output formats
  - gate-A file is more comprehensive with source tracking

#### Medium Overlap (50-80% similarity):
- **`financial-analysis.md` vs `gate-B-preliminary-analysis.md`**
  - Both perform financial underwriting and return calculations
  - financial-analysis.md has more detailed methodology
  - gate-B has more market research requirements
  - Different decision thresholds and output structures

- **`financial-analysis.md` vs `gate-C-full-underwriting.md`**
  - gate-C builds on concepts in financial-analysis.md
  - More comprehensive due diligence requirements in gate-C
  - Similar financial modeling frameworks but different depth

#### Low Overlap (20-50% similarity):
- **`compliance-check.md` vs LIHTC sections in gate files**
  - compliance-check.md is specialized for LIHTC requirements
  - Gate files have basic LIHTC considerations
  - Different levels of compliance analysis depth

### 3. Directory Organization Issues

#### Scattered Business Logic:
```
/specs/business/          # Investment criteria and frameworks
├── INVESTMENT_FRAMEWORK.md
├── LIHTC_COMPLIANCE_GUIDE.md
└── PRESERVATION_CRITERIA.md

/specs/process/           # Workflow and collaboration
├── CODE_REVIEW_STANDARDS.md
├── COLLABORATION_PROTOCOL.md
├── CONFLICT_RESOLUTION.md
└── DEAL_LIFECYCLE.md

/specs/technical/         # System architecture
├── API_DOCUMENTATION.md
├── DATABASE_SCHEMA.md
├── DEPLOYMENT_GUIDE.md
└── SYSTEM_ARCHITECTURE.md
```

**Problem**: Related specifications scattered across multiple subdirectories, making it difficult to maintain coherent business logic.

#### Orphaned SystemCore:
```
/SystemCore/TransparencyLayer/
├── AnalystSimulationMode.md
├── GlassBoxTemplates/
│   ├── AnomalyFlagTemplate.md
│   ├── BenchmarkContextTemplate.md
│   ├── DecisionSummaryTemplate.md
│   └── InputTraceTemplate.md
└── OverrideTriggers.md
```

**Problem**: Critical AI transparency features isolated from main specification structure.

### 4. Naming Inconsistencies

- **Mixed conventions**: "gate-A" vs "A-initial-intake" vs "deal-intake"
- **Inconsistent stage numbering**: No clear progression system
- **JSON output variations**: Different schemas across similar specifications

## Consolidation Recommendations

### 1. Adopt Unified Stage-Based Architecture

**Target Structure**:
```
/specs/
├── stage-1-initial-intake.md      # Consolidated from deal-intake.md + gate-A
├── stage-2-preliminary-analysis.md # Enhanced gate-B with financial-analysis.md content
├── stage-3-full-underwriting.md   # Enhanced gate-C with financial-analysis.md content
├── stage-4-compliance-check.md    # Renamed compliance-check.md
├── stage-5-ic-recommendation.md   # Renamed ic-recommendation.md
├── framework/                     # Consolidated business logic
│   ├── investment/               # From /business/
│   ├── compliance/              # LIHTC-specific requirements
│   └── technical/              # System architecture
├── transparency/                 # From SystemCore/TransparencyLayer/
│   ├── glass-box-templates/
│   ├── analyst-simulation.md
│   └── override-triggers.md
└── templates/                   # Keep existing
    ├── analysis-output.json
    ├── deal-structure.json
    └── ic-presentation.md
```

### 2. Content Consolidation Matrix

| Source Files | Target File | Action | Content Notes |
|--------------|-------------|---------|---------------|
| deal-intake.md<br>gate-A-initial-intake.md | stage-1-initial-intake.md | **MERGE** | Use gate-A as base, add unique validation criteria from deal-intake |
| financial-analysis.md<br>gate-B-preliminary-analysis.md | stage-2-preliminary-analysis.md | **MERGE** | Integrate detailed financial methodology into gate-B framework |
| financial-analysis.md<br>gate-C-full-underwriting.md | stage-3-full-underwriting.md | **MERGE** | Enhance gate-C with remaining financial-analysis content |
| compliance-check.md | stage-4-compliance-check.md | **RENAME** | Keep as specialized LIHTC compliance stage |
| ic-recommendation.md | stage-5-ic-recommendation.md | **RENAME** | Maintain as final synthesis stage |

### 3. Directory Restructuring Plan

#### Phase 1: Core Specifications
- Merge duplicate intake and financial analysis files
- Rename to consistent stage-based naming
- Standardize JSON output schemas

#### Phase 2: Framework Consolidation
- Move `/specs/business/` → `/specs/framework/investment/`
- Move LIHTC compliance guides → `/specs/framework/compliance/`
- Move `/specs/technical/` → `/specs/framework/technical/`
- Remove `/specs/process/` (development-specific, not business logic)

#### Phase 3: Transparency Integration
- Move `SystemCore/TransparencyLayer/` → `/specs/transparency/`
- Integrate glass box templates with each stage specification
- Update stage files to reference transparency outputs

#### Phase 4: Pipeline Removal
- Archive any unique content from `/pipeline/` directory
- Remove entire `/pipeline/` structure
- Update documentation to reflect specification-driven approach

### 4. JSON Schema Standardization

**Unified Output Schema Structure**:
```json
{
  "dealId": "string",
  "timestamp": "ISO-8601", 
  "stage": "1|2|3|4|5",
  "stageName": "string",
  "decision": "PROCEED|REJECT|REQUEST_MORE_INFO|CONDITIONAL",
  "recommendation": "string",
  "keyMetrics": {},
  "riskFactors": [],
  "nextSteps": [],
  "transparency": {
    "decisionSummary": "string",
    "inputTrace": [],
    "benchmarkContext": {},
    "anomalyFlags": []
  }
}
```

## Implementation Benefits

### 1. Reduced Maintenance Overhead
- Single source of truth for each analysis stage
- No duplicate content to maintain
- Clear ownership of specifications

### 2. Improved Agent Processing
- Unambiguous workflow progression
- Consistent JSON outputs for integration
- Integrated transparency and explainability

### 3. Enhanced Extensibility
- Clear framework structure for new requirements
- Modular transparency layer for AI explainability
- Standardized integration patterns

### 4. Better Documentation
- Coherent directory structure
- Logical specification progression
- Aligned with "Plan Two+" vision

## Risk Mitigation

### 1. Content Loss Prevention
- Comprehensive content mapping before deletion
- Archive unique specifications before consolidation
- Version control checkpoints at each phase

### 2. Integration Testing
- Validate merged specifications with existing test deals
- Ensure JSON schema compatibility
- Test agent processing with consolidated specs

### 3. Rollback Planning
- Maintain separate branch during consolidation
- Document all changes for potential reversal
- Keep archived content accessible

## Success Metrics

- [ ] **Structural**: Single directory structure with no duplicates
- [ ] **Content**: All valuable specifications consolidated without loss
- [ ] **Functional**: Agent can process deals through unified workflow
- [ ] **Documentation**: README accurately reflects new structure
- [ ] **Maintainability**: Clear ownership and updating process for each specification

## Next Steps

1. **Execute consolidation tasks** in dependency order
2. **Test consolidated structure** with sample deals
3. **Update documentation** to reflect new organization
4. **Train team** on new specification structure
5. **Monitor performance** and iterate as needed

---

*Analysis completed: [Current Date]*  
*Recommended timeline: 1-2 weeks for full consolidation*  
*Risk level: Low (with proper version control and testing)*
