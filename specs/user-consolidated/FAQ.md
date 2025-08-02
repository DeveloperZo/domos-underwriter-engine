# Frequently Asked Questions

## Purpose
This document addresses common questions about using the Domos Underwriter Engine for LIHTC preservation deal analysis.

## General Questions

### What does the Domos Underwriter Engine do?
The Domos Underwriter Engine is a hybrid human-AI system that helps analyze LIHTC preservation investment opportunities with institutional-grade rigor. It processes deal documents into structured data, facilitates analysis against standardized criteria, and maintains a complete audit trail while keeping humans in control of investment decisions.

### Who should use this system?
This system is designed for investment analysts, asset managers, and investment committee members involved in LIHTC preservation deal evaluation.

### What kinds of deals can I analyze?
The system is optimized for LIHTC (Low-Income Housing Tax Credit) preservation opportunities and naturally occurring affordable housing (NOAH) investments.

## Workflow Questions

### What is the basic workflow?
1. Process deal documents using `processDeal`
2. Analyze the deal against stage criteria using `analyzeStage`
3. Record your analysis using `completeAnalysis`
4. Move the deal to the next stage using `moveDeal`

### How long does it take to analyze a deal?
A typical deal can be processed through all stages in 1-3 days, compared to 1-2 weeks with traditional methods. Each stage has different time requirements:
- Initial Intake: 1-2 hours
- Preliminary Analysis: 4-6 hours
- Full Underwriting: 8-12 hours
- IC Review: 2-4 hours

### Can multiple people work on the same deal?
Yes, different team members can handle different stages of analysis. The system maintains a complete audit trail of who did what and when.

## Technical Questions

### What format should my documents be in?
The system works best with:
- PDF documents for offering memorandums
- Excel files for rent rolls and financial statements
- Word documents for legal and compliance information

### What happens if document processing fails?
If the system can't process a document automatically, it will provide specific error messages. You can:
1. Check file formats and try again
2. Process individual documents separately
3. Manually enter key information if needed

### Can I customize the analysis criteria?
Yes, the stage specifications in the `/specs/` directory can be customized to match your investment criteria and requirements.

## Analysis Questions

### What does a good analysis include?
A thorough analysis should include:
- Assessment against all stage criteria
- Validation of financial assumptions
- Identification of key risks and mitigations
- Clear rationale for decisions
- Confidence level in the assessment

### How do I handle incomplete information?
When dealing with incomplete information:
1. Document what's missing in your analysis
2. Assess the impact on your confidence level
3. Use `REQUEST_MORE_INFO` decision if critical information is missing
4. Make reasonable assumptions when appropriate, but document them clearly

### What happens when a deal is rejected?
Rejected deals are moved to the `rejected/` folder in the current pipeline stage. The rejection reason is documented in the audit trail. Rejected deals can be revived if new information addresses the rejection reasons.

## Output Questions

### What's in the AnalysisJourney.md file?
This file contains the complete audit trail of the deal analysis, including:
- Deal processing events
- Analysis decisions and recommendations
- Timestamps for all actions
- Reasoning behind decisions
- Red flags or issues identified

### Can I generate reports for Investment Committee?
Yes, the system can be used to generate Investment Committee materials:
1. Use `analyzeStage(dealPath, "D-ic-review")` to prepare
2. Review the complete analysis history
3. Generate presentation materials using the provided templates
4. Record IC decisions in the audit trail

### How do I track my deal pipeline?
You can track deals by:
1. Looking in the pipeline stage directories
2. Checking the status in deal.json files
3. Reviewing AnalysisJourney.md for history
4. Using `npm run status` for a system-wide overview

## Troubleshooting

### What if I put a deal in the wrong stage?
You can correct this by:
1. Using `moveDeal()` to place it in the correct stage
2. Documenting the correction in the audit trail
3. Ensuring all required analysis is completed for the new stage

### Can I recover deleted deals?
The system doesn't have built-in recovery for deleted deals. Best practices:
1. Create regular backups of the `processed-deals/` directory
2. Use version control if available
3. Document significant decisions outside the system as well

### What if I need to update my analysis?
You can update your analysis by:
1. Running `analyzeStage()` again for the current stage
2. Adding a new analysis entry with `completeAnalysis()`
3. Documenting the reason for the update
4. The system preserves the full history of all analyses

## Related Resources
- [User Guide](./USER_GUIDE.md) - Complete usage instructions
- [Setup Guide](./SETUP.md) - Installation and configuration
- [Quick Reference](./QUICK_REFERENCE.md) - Command summary

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Product Team  
**Status**: Active
