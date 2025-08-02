# Domos AI Investment Committee - Training Checklist

## 🎓 User Training Program

This checklist ensures systematic onboarding for new users of the Domos AI Investment Committee system. Complete each section to build proficiency from basic operations to advanced workflow management.

---

## 📋 Pre-Training Setup

### System Requirements Check
- [ ] Node.js 18+ installed and verified (`node --version`)
- [ ] 8GB+ RAM available
- [ ] 10GB+ free disk space
- [ ] Claude with MCP tools configured
- [ ] Access permissions to project directory

### Initial Installation
- [ ] Project dependencies installed (`npm install`)
- [ ] System built successfully (`npm run build`)
- [ ] Demo runs without errors (`npm run demo-mcp`)
- [ ] MCP tools discoverable (`npm run mcp-tools`)

### Documentation Access
- [ ] All user documentation available in `specs/user/`
- [ ] [USER_GUIDE.md](USER_GUIDE.md) reviewed
- [ ] [QUICK_REFERENCE.md](QUICK_REFERENCE.md) bookmarked
- [ ] [TROUBLESHOOTING.md](TROUBLESHOOTING.md) accessible

---

## 🎯 Level 1: Basic Operations (Target: 2 hours)

### Understanding the System
- [ ] **Read**: System overview and architecture
- [ ] **Understand**: Human-AI hybrid approach
- [ ] **Review**: 4-tool MCP interface design
- [ ] **Identify**: File structure and data flow

### Tool Familiarization
- [ ] **processDeal**: Understand input → output transformation
- [ ] **analyzeStage**: Learn deal + spec loading process
- [ ] **completeAnalysis**: Practice analysis recording
- [ ] **moveDeal**: Understand pipeline movement logic

### Sample Deal Processing
- [ ] **Process** sample deal: `processDeal("sample-deals/DueDiligence")`
- [ ] **Examine** output files: deal.json, tenants.json, financialSummary.json
- [ ] **Review** initial AnalysisJourney.md structure
- [ ] **Understand** data extraction quality and limitations

### Basic Analysis Practice
- [ ] **Load** sample deal: `analyzeStage(dealPath, "A-initial-intake")`
- [ ] **Review** stage specification requirements
- [ ] **Practice** investment assessment against criteria
- [ ] **Record** analysis: `completeAnalysis(dealPath, stage, analysis)`

### Pipeline Management
- [ ] **Move** deal forward: `moveDeal(dealPath, "A-initial-intake", "B-preliminary-analysis", "ADVANCE")`
- [ ] **Verify** proper folder structure creation
- [ ] **Check** audit trail updates
- [ ] **Understand** substate management (not-started, in-progress, etc.)

### Level 1 Assessment
- [ ] Can process a sample deal from start to finish
- [ ] Understands all 4 MCP tools and their purposes
- [ ] Can navigate file structure and find key information
- [ ] Recognizes data quality issues and limitations
- [ ] Completes basic workflow in under 30 minutes

---

## 🔍 Level 2: Intermediate Skills (Target: 1 day)

### Real Deal Processing
- [ ] **Select** simple real deal for practice
- [ ] **Organize** DueDiligence documents properly
- [ ] **Process** deal and validate output quality
- [ ] **Identify** and correct data extraction errors
- [ ] **Document** corrections in analysis journey

### Stage Analysis Mastery
- [ ] **Complete** analysis for 3 different pipeline stages
- [ ] **Apply** investment criteria consistently
- [ ] **Reference** previous deal analyses for benchmarking
- [ ] **Escalate** appropriate issues to senior team members
- [ ] **Make** clear go/no-go recommendations

### Quality Control
- [ ] **Verify** financial data accuracy against source documents
- [ ] **Cross-check** LIHTC compliance information
- [ ] **Validate** property information and market data
- [ ] **Review** analysis logic and reasoning
- [ ] **Maintain** consistent analysis standards

### Documentation Excellence
- [ ] **Write** clear, detailed analysis entries
- [ ] **Include** specific risk assessments
- [ ] **Reference** key source documents
- [ ] **Explain** investment reasoning clearly
- [ ] **Set** appropriate confidence levels

### Pipeline Workflow
- [ ] **Manage** multiple deals at different stages
- [ ] **Prioritize** deals based on urgency and quality
- [ ] **Track** deal progress and bottlenecks
- [ ] **Communicate** status updates to team
- [ ] **Handle** rejected deals appropriately

### Level 2 Assessment
- [ ] Can process real deals with minimal supervision
- [ ] Produces consistent, high-quality analysis
- [ ] Maintains complete and accurate audit trails
- [ ] Manages multiple concurrent deals effectively
- [ ] Identifies and resolves common issues independently

---

## 🚀 Level 3: Advanced Proficiency (Target: 1 week)

### System Customization
- [ ] **Modify** stage specifications for firm-specific criteria
- [ ] **Customize** analysis templates and formats
- [ ] **Adapt** workflow for special deal types
- [ ] **Configure** quality control procedures
- [ ] **Optimize** personal productivity techniques

### Complex Deal Handling
- [ ] **Analyze** mixed-use properties with multiple components
- [ ] **Handle** incomplete or poor-quality DueDiligence
- [ ] **Process** portfolio acquisitions or bulk deals
- [ ] **Manage** deals with unusual structures or timing
- [ ] **Coordinate** with external consultants and advisors

### Team Leadership
- [ ] **Train** junior analysts on system usage
- [ ] **Establish** team standards and best practices
- [ ] **Review** and calibrate analysis quality across team
- [ ] **Mentor** new users through complex deals
- [ ] **Lead** process improvement initiatives

### Integration and Optimization
- [ ] **Connect** with existing investment committee processes
- [ ] **Export** data for external reporting and analysis
- [ ] **Integrate** with property management and accounting systems
- [ ] **Develop** custom reporting formats
- [ ] **Optimize** workflow for maximum efficiency

### Troubleshooting and Support
- [ ] **Diagnose** and resolve technical issues independently
- [ ] **Provide** user support and training to colleagues
- [ ] **Document** solutions to common problems
- [ ] **Escalate** complex technical issues appropriately
- [ ] **Contribute** to system improvement and feature requests

### Level 3 Assessment
- [ ] Can handle any deal type with confidence
- [ ] Customizes system to meet specific business needs
- [ ] Leads team adoption and training efforts
- [ ] Contributes to process improvement and optimization
- [ ] Serves as subject matter expert for the organization

---

## 🏆 Certification Levels

### Bronze Certification - Basic User
**Requirements:**
- [ ] Complete Level 1 training checklist
- [ ] Process 3 sample deals successfully
- [ ] Demonstrate 4-tool workflow proficiency
- [ ] Pass basic knowledge assessment
- [ ] Complete supervised real deal analysis

**Capabilities:**
- Process standard deals with supervision
- Follow established analysis procedures
- Maintain basic audit trail compliance
- Identify when to escalate issues

### Silver Certification - Proficient User
**Requirements:**
- [ ] Complete Level 2 training checklist
- [ ] Process 10 real deals independently
- [ ] Demonstrate consistent analysis quality
- [ ] Handle complex deal scenarios
- [ ] Mentor at least one new user

**Capabilities:**
- Analyze deals independently with high quality
- Customize system for specific deal types
- Resolve common technical issues
- Train and support other users

### Gold Certification - Expert User
**Requirements:**
- [ ] Complete Level 3 training checklist
- [ ] Lead team implementation project
- [ ] Customize system specifications successfully
- [ ] Demonstrate advanced troubleshooting skills
- [ ] Contribute to system improvements

**Capabilities:**
- Handle any deal type or complexity
- Lead system customization and optimization
- Provide technical support and training
- Drive process improvements and best practices

---

## 📚 Training Resources

### Documentation
- [ ] **USER_GUIDE.md** - Comprehensive workflow guide
- [ ] **QUICK_REFERENCE.md** - Daily command reference
- [ ] **FAQ.md** - Common questions and answers
- [ ] **TROUBLESHOOTING.md** - Issue resolution guide
- [ ] **SETUP.md** - Installation and configuration

### Practice Materials
- [ ] **Sample Deals** - Test data in `sample-deals/`
- [ ] **Demo Scripts** - Automated workflow demonstrations
- [ ] **Stage Specifications** - Analysis criteria and requirements
- [ ] **Example Outputs** - Reference analysis examples

### Hands-On Exercises
1. **Exercise 1**: Process sample deal end-to-end
2. **Exercise 2**: Handle data quality issues
3. **Exercise 3**: Customize stage specifications
4. **Exercise 4**: Manage multiple concurrent deals
5. **Exercise 5**: Train another user

### Assessment Tools
- [ ] **Knowledge Quiz** - Test understanding of concepts
- [ ] **Practical Evaluation** - Observe real deal processing
- [ ] **Quality Review** - Assess analysis output quality
- [ ] **Troubleshooting Simulation** - Handle common issues
- [ ] **Peer Review** - Feedback from experienced users

---

## 🕐 Training Schedule Templates

### Intensive 1-Day Program
**Morning (4 hours)**
- System overview and setup (30 min)
- Tool demonstration and practice (90 min)
- Sample deal processing (60 min)
- Break and Q&A (30 min)

**Afternoon (4 hours)**
- Real deal practice (2 hours)
- Advanced features and customization (60 min)
- Troubleshooting and support (30 min)
- Assessment and certification (30 min)

### Extended 1-Week Program
**Day 1**: Setup and basic operations
**Day 2**: Sample deal processing and analysis
**Day 3**: Real deal practice with supervision
**Day 4**: Independent deal processing
**Day 5**: Advanced features and assessment

### Self-Paced Program
**Week 1**: Complete Level 1 training
**Week 2**: Practice with real deals
**Week 3**: Complete Level 2 training
**Week 4**: Advanced features and customization
**Month 2**: Ongoing practice and mentoring

---

## 📊 Progress Tracking

### Individual Progress
- [ ] **Training Start Date**: ___________
- [ ] **Level 1 Completion**: ___________
- [ ] **Level 2 Completion**: ___________
- [ ] **Level 3 Completion**: ___________
- [ ] **Certification Level**: ___________
- [ ] **Last Assessment Date**: ___________

### Skills Development
- [ ] **Technical Proficiency**: ⭐⭐⭐⭐⭐
- [ ] **Analysis Quality**: ⭐⭐⭐⭐⭐
- [ ] **Process Efficiency**: ⭐⭐⭐⭐⭐
- [ ] **Problem Solving**: ⭐⭐⭐⭐⭐
- [ ] **Team Collaboration**: ⭐⭐⭐⭐⭐

### Deals Processed
- [ ] **Sample Deals**: ___/5 completed
- [ ] **Real Deals**: ___/10 completed
- [ ] **Complex Deals**: ___/3 completed
- [ ] **Quality Score**: ___%
- [ ] **Error Rate**: ___%

### Training Notes
```
Date: _______
Activity: _________________
Outcome: _________________
Next Steps: ______________
_________________________

Date: _______
Activity: _________________
Outcome: _________________
Next Steps: ______________
_________________________
```

---

## 🎯 Success Metrics

### Individual Performance
- **Time to Proficiency**: Target < 1 week to Level 2
- **Analysis Quality**: 95%+ accuracy on key metrics
- **Process Speed**: 3x faster than manual analysis
- **Error Rate**: < 5% data extraction errors
- **User Satisfaction**: 4.5+ stars on training evaluation

### Team Performance
- **Adoption Rate**: 100% of analysts trained
- **Consistency**: Standard analysis quality across team
- **Productivity**: 10x improvement in deal throughput
- **Quality**: Improved investment decision accuracy
- **Compliance**: Zero audit findings on process documentation

### Organizational Impact
- **Deal Velocity**: Faster time from LOI to close
- **Resource Efficiency**: Better allocation of analyst time
- **Risk Management**: Earlier identification of problem deals
- **Competitive Advantage**: Faster response to market opportunities
- **Regulatory Compliance**: Complete audit trail documentation

---

## 🔄 Ongoing Development

### Continuous Learning
- [ ] **Monthly**: Review new system features and updates
- [ ] **Quarterly**: Participate in team calibration sessions
- [ ] **Annually**: Complete refresher training and assessment
- [ ] **Ongoing**: Share best practices and lessons learned
- [ ] **As Needed**: Additional training for new deal types

### Knowledge Sharing
- [ ] **Document** successful analysis techniques
- [ ] **Share** custom specifications and templates
- [ ] **Mentor** new team members
- [ ] **Contribute** to system improvement suggestions
- [ ] **Participate** in user community and feedback

### Career Development
- [ ] **Technical Skills**: Advanced system customization
- [ ] **Leadership Skills**: Team training and management
- [ ] **Industry Knowledge**: LIHTC and preservation expertise
- [ ] **Process Improvement**: Workflow optimization
- [ ] **Innovation**: New feature development and testing

---

## 📞 Training Support

### Internal Resources
- **Trainer**: _________________
- **Mentor**: _________________
- **Technical Support**: _________________
- **Manager**: _________________

### External Resources
- **Documentation**: All guides in `specs/user/`
- **Technical Support**: System developers and IT team
- **User Community**: Other organizations using the system
- **Training Materials**: Videos, webinars, and examples

### Emergency Contacts
- **System Issues**: _________________
- **Training Questions**: _________________
- **Process Problems**: _________________
- **Escalation**: _________________

---

## ✅ Training Completion

### Final Checklist
- [ ] All required training levels completed
- [ ] Certification achieved and documented
- [ ] Independent operation demonstrated
- [ ] Quality standards consistently met
- [ ] Able to train and support others

### Sign-Off
**Trainee**: _________________ Date: _______
**Trainer**: _________________ Date: _______
**Manager**: _________________ Date: _______

### Next Steps
- [ ] Begin independent deal processing
- [ ] Schedule first quality review (30 days)
- [ ] Plan advanced training for specialized deal types
- [ ] Identify opportunities for process improvement
- [ ] Set goals for continued professional development

---

**🎯 Remember**: Training is not a one-time event but an ongoing process. The system and markets evolve, so continuous learning and improvement are essential for maintaining expertise and delivering value.

**Congratulations on completing the Domos AI Investment Committee training program!** 🎉
