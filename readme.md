# Domos Underwriter Engine

## What Is This?

A hybrid AI-powered system that helps Domos make fast, high-quality investment decisions for affordable housing preservation (LIHTC/NOAH properties).

## The Problem We're Solving

Domos needs to move quickly in a competitive market while still performing thorough analysis on affordable housing investments. Traditional processes are too slow, but cutting corners risks bad investments.

## How It Works

The system:
1. Automates the 9-stage investment analysis process
2. Provides clear explanations for all decisions ("glass box" approach)
3. Flags unusual cases for human review
4. Generates ready-to-present investment committee materials

## System Flow

1. **Deal Ingestion**: Drop a new deal folder into the system
   - Contains raw property documents (rent roll, T12, etc.)
   - System assigns a unique deal ID

2. **Data Structuring**: Agent runs command to process raw documents
   - Extracts and normalizes key data points
   - Creates structured data files in the deal folder
   - Flags any missing or problematic information

3. **Pipeline Entry**: Agent moves structured deal folder into active pipeline
   - Deal status updated to "In Analysis"
   - Analysis journey document initiated

4. **Deal Processing**: Agent applies pipeline specs to the deal
   - Each spec performs specific analysis (market, financial, regulatory, etc.)
   - Results are stored in the deal object
   - All actions and outcomes are logged to the analysis journey

5. **Review & Decision**: System generates final recommendation and materials
   - Investment committee deck and summary auto-generated
   - Decision and rationale recorded in the analysis journey

## Traceability & Audit

Every action in the system is recorded in the analysis journey, providing:
- Complete history of all processing steps
- Record of which agent performed each action
- Timestamps for all activities
- Documentation of all decision inputs and outputs
- Full audit trail for compliance and review

## Key Features

- **Fast Decision-Making**: Complete analysis in under 3 business days
- **Transparent Logic**: All decisions include explanations and source data
- **Edge Case Detection**: Automatically identifies unusual properties that need special attention
- **Simulation Tools**: Analysts can test different scenarios and assumptions
- **Ready-Made Outputs**: Automatically generates presentation decks and executive summaries

## Success Metrics

- Thorough analysis (100% of traditional investment committee rigor)
- Quick turnaround (< 3 days)
- Fast presentation generation (< 1 hour)
- All unusual cases properly flagged for human review

## Directory Structure

```
/DomosDealEvaluation/
├── /SystemCore/ - Core system functionality
├── /ActiveDeals/ - Current deals under evaluation
│   ├── /Deal_ID_123/ - Example deal folder
│   │   ├── raw/ - Original documents
│   │   ├── structured/ - Processed data
│   │   ├── DealObject.json - Current deal state
│   │   ├── AnalysisJourney.md - Complete audit trail
│   │   └── /Outputs/ - Generated materials
```

## Purpose

This system helps Domos balance its dual mission of providing investor returns (10.0% LIRR target) while preserving affordable housing during a critical period when many properties are at risk of conversion to market-rate housing.
