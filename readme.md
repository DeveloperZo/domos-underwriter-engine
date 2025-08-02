# Domos LIHTC Preservation Underwriter Engine

**Version**: 0.2.0  
**Status**: Development 🚧

## Overview

AI-powered underwriting system for LIHTC (Low-Income Housing Tax Credit) preservation investment analysis, providing full-spectrum underwriting, transparent decision-making, and edge-case adaptability. This system helps Domos bridge the gap between institutional-grade analysis and competitive acquisition timelines.

## Key Features

- **Glass Box Underwriting**: All automated decisions include human-legible outputs
- **Enhanced Metadata Tracking**: Comprehensive tracking of deal status and analysis history
- **Nine-Stage Investment Framework**: Thorough analysis pipeline with progressive stages
- **Edge Case Detection**: Automatic identification of deals requiring manual review
- **LP-Facing Output Generation**: Automated production of presentation materials

## Setup & Installation

```bash
# Clone repository
git clone https://github.com/yourusername/domos-underwriter-engine.git
cd domos-underwriter-engine

# Install dependencies
npm install

# Build TypeScript files
npm run build
```

## Quick Start

Process a sample deal:

```bash
# Parse deal documents into structured data
npm run process-deal sample-deals/the-frank

# Analyze through all stages
npm run analyze-to-stage sample-deals/the-frank 9
```

## Command Reference

### Core Commands

- `npm run process-deal <deal-path>` - Parse documents into structured JSON
- `npm run analyze-to-stage <deal-path> <stage-number> [--force]` - Analyze deal through specified stage
- `npm run status <deal-path>` - Check current deal status and progress
- `npm run demo-stages <deal-path>` - Process through all stages (demonstration)

See [COMMANDS.md](COMMANDS.md) for detailed usage examples.

## Nine-Stage Investment Framework

1. **Strategic Qualification & Advantage**
   - Validates alignment with investment thesis
   - Identifies competitive positioning

2. **Market Intelligence & Timing**
   - Analyzes market dynamics and timing
   - Validates rent growth assumptions

3. **Due Diligence & Bias Mitigation**
   - Validates property condition and compliance
   - Identifies bias in underwriting assumptions

4. **Financial Underwriting**
   - Builds pro forma financial models
   - Tests sensitivity to various scenarios

5. **Legal & Regulatory Compliance**
   - Validates LIHTC compliance status
   - Identifies regulatory risks

6. **Operational Feasibility**
   - Validates management plan
   - Identifies operational improvement opportunities

7. **Risk Mitigation Planning**
   - Creates risk mitigation strategies
   - Establishes contingency plans

8. **Portfolio Integration**
   - Analyzes fit within existing portfolio
   - Identifies synergies and diversification benefits

9. **Investment Committee Recommendation**
   - Generates final go/no-go recommendation
   - Produces board-ready presentation materials

## System Directory Structure

```
/DomosDealEvaluation/
├── /SystemCore/
│   ├── /TransparencyLayer/
│   │   ├── GlassBoxTemplates/
│   │   ├── OverrideTriggers.md
│   │   └── AnalystSimulationMode.md
│   ├── /StageSpecifications/
│   ├── /AnalyticalTemplates/
│   └── /SystemPerformance/
│       ├── ReviewAccuracyTracking/
│       ├── AnalystFeedbackLogs/
│       └── ModelDriftReports/
├── /ActiveDeals/
```

## Glass Box Transparency

Each stage outputs:

- **DecisionSummary.md**: Plain-language rationale
- **InputTrace.md**: Source documents and variables used
- **RedFlagsRaised.md**: Issues detected vs. expectations
- **OverrideNotes.md**: (if triggered) Manual review notes

## Deal Metadata Structure

Enhanced deal tracking includes:

- Current stage (1-9)
- Status at each stage (pending, approved, rejected, needs-review)
- Overall deal status (active, rejected, approved, on-hold)
- Timestamp of last analysis
- Complete analysis history

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - See LICENSE file for details.