# Domos AI Investment Committee - User Documentation

Welcome to the Domos LIHTC Preservation AI Investment Committee system. This directory contains all user-facing documentation to help you efficiently analyze deals with full transparency and audit trails.

---

## 📚 Documentation Overview

### 🚀 Getting Started
- **[SETUP.md](SETUP.md)** - Installation and system setup guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - One-page workflow reference
- **[USER_GUIDE.md](USER_GUIDE.md)** - Comprehensive user manual

### 🛠️ Support Resources  
- **[FAQ.md](FAQ.md)** - Frequently asked questions and answers
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🎯 Quick Navigation

### New Users - Start Here
1. **[SETUP.md](SETUP.md)** - Install and configure the system
2. **[USER_GUIDE.md](USER_GUIDE.md)** - Learn the complete workflow
3. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Keep handy during daily use

### Experienced Users
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Daily workflow commands
- **[FAQ.md](FAQ.md)** - Quick answers to common questions
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solve issues fast

### System Administrators
- **[SETUP.md](SETUP.md)** - Multi-user deployment guidance
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Technical issue resolution

---

## 🔧 What This System Does

The Domos AI Investment Committee tool provides **hybrid human-AI analysis** for LIHTC preservation deals. Key capabilities:

### ⚡ Speed & Efficiency
- Process deals in hours instead of weeks
- Automated data extraction from DueDiligence documents
- Streamlined pipeline with clear decision gates

### 🔍 Institutional-Grade Analysis
- Standardized analysis criteria across all deals
- Comprehensive financial modeling and risk assessment
- LIHTC compliance and preservation opportunity validation

### 📝 Complete Transparency
- Every decision tracked with timestamp and rationale
- Human-readable audit trail for regulatory compliance
- Glass-box AI recommendations with full explanation

### 🎯 Human-Controlled Process
- You make all investment decisions
- AI handles data processing and provides analysis support
- Maintain professional judgment while leveraging AI efficiency

---

## 🏗️ System Architecture

### 4-Tool MCP Interface
1. **processDeal** - Convert DueDiligence → structured data
2. **analyzeStage** - Load deal + specs for your analysis
3. **completeAnalysis** - Record decisions in audit trail
4. **moveDeal** - Advance through pipeline stages

### Pipeline Stages
- **A-initial-intake** - Basic qualification and screening
- **B-preliminary-analysis** - Market validation and initial underwriting
- **C-full-underwriting** - Complete financial analysis and DueDiligence
- **D-ic-review** - Investment committee presentation and decision
- **E-loi-psa** - Legal documentation and transaction management
- **F-final-approval** - Final investment approval and funding
- **G-closing** - Transaction closing and asset management transition

### File Structure
```
processed-deals/          # Structured deal data
├── deal.json            # Property and LIHTC information
├── tenants.json         # Rent roll and tenant data
├── financialSummary.json # T12 and financial metrics
└── AnalysisJourney.md   # Complete audit trail

pipeline/                # Workflow management
├── A-initial-intake/
│   ├── not-started/     # New deals awaiting analysis
│   ├── in-progress/     # Currently under review
│   ├── completed/       # Analysis finished, ready to advance
│   └── rejected/        # Failed gate criteria
└── [other stages with same structure]
```

---

## 💼 Typical User Workflow

### Daily Operations
1. **New Deal Arrives** → Process with `processDeal`
2. **Load for Analysis** → Use `analyzeStage` 
3. **Perform Assessment** → Apply your investment expertise
4. **Record Decision** → Document with `completeAnalysis`
5. **Advance Pipeline** → Move forward with `moveDeal`

### Weekly Reviews
- Review deals in each pipeline stage
- Identify bottlenecks or stalled analyses
- Update stage specifications as needed
- Archive completed transactions

### Monthly Activities
- Analyze deal flow and conversion rates
- Review analysis quality and consistency
- Update investment criteria and specifications
- Train new team members on system usage

---

## 🎓 Training Path

### Beginner (1-2 hours)
1. **Read**: [SETUP.md](SETUP.md) + [USER_GUIDE.md](USER_GUIDE.md)
2. **Practice**: Process sample deal through complete workflow
3. **Reference**: Keep [QUICK_REFERENCE.md](QUICK_REFERENCE.md) handy

### Intermediate (1-2 days)
1. **Process**: 3-5 real deals through initial stages
2. **Customize**: Modify stage specifications for your criteria
3. **Integrate**: Connect with existing investment processes

### Advanced (1 week)
1. **Optimize**: Develop team standards and best practices
2. **Scale**: Handle multiple concurrent deals efficiently
3. **Lead**: Train other team members and manage workflow

---

## 🔒 Compliance & Audit

### Regulatory Requirements
- **SEC Compliance**: All investment decisions documented with rationale
- **LIHTC Regulations**: Compliance status tracked throughout process
- **Fair Housing**: Equal treatment standards applied consistently
- **Fiduciary Duty**: Complete decision trail for LP transparency

### Audit Trail Features
- Timestamped entries for all actions and decisions
- Human-readable markdown format for easy review
- Immutable history preserved throughout deal lifecycle
- Export capabilities for regulatory reporting

### Quality Assurance
- Standardized analysis criteria across all deals
- Consistent application of investment standards
- Regular review and calibration processes
- Performance tracking and improvement

---

## 📈 Success Metrics

### Process Efficiency
- **Time to Decision**: Target < 3 business days per stage
- **Analysis Throughput**: 10x faster than manual process
- **Pipeline Velocity**: Consistent flow from intake to closing
- **Resource Utilization**: Optimize analyst time on high-value decisions

### Investment Quality
- **Deal Success Rate**: Higher conversion of analyzed deals
- **Risk Identification**: Better early detection of problem areas
- **Return Accuracy**: Improved actual vs. projected performance
- **Compliance Record**: Zero LIHTC compliance violations

### User Adoption
- **Team Proficiency**: All analysts trained and productive
- **Consistency**: Standardized analysis across team
- **Satisfaction**: Positive user feedback and adoption
- **Innovation**: Continuous improvement and optimization

---

## 🆘 Support & Resources

### Immediate Help
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix common issues
- **[FAQ.md](FAQ.md)** - Quick answers to frequent questions
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command reference

### Learning Resources
- **Sample Deals**: Practice with included test data
- **Demo Scripts**: Watch complete workflow demonstrations
- **Stage Specifications**: Understand analysis requirements
- **Best Practices**: Learn from successful implementations

### Technical Support
- System requirements and compatibility
- Installation and configuration assistance
- Integration with existing tools and processes
- Custom modifications and enhancements

---

## 🚀 Next Steps

### Ready to Start?
1. **Install** following [SETUP.md](SETUP.md)
2. **Learn** the workflow with [USER_GUIDE.md](USER_GUIDE.md)
3. **Practice** with sample deals
4. **Deploy** for real deal analysis

### Questions?
- Check [FAQ.md](FAQ.md) for common questions
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for technical issues
- Contact support for additional assistance

---

**🎯 Remember**: This system enhances your investment expertise—you remain in control of all decisions while the AI handles data processing and documentation. The goal is to make you more efficient, not to replace your professional judgment.

**Welcome to faster, more rigorous LIHTC preservation analysis!** 🏢✨
