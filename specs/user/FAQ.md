# Domos AI Investment Committee - Frequently Asked Questions

## 🤔 General Questions

### Q: What exactly does the Domos AI system do?
**A:** The Domos AI system is a hybrid human-AI tool for analyzing LIHTC preservation investment opportunities. You remain in complete control of all investment decisions, while the AI handles data processing, document analysis, and audit trail management. Think of it as an extremely sophisticated analytical assistant that never gets tired and never forgets to document decisions.

### Q: Will the AI make investment decisions for me?
**A:** No, absolutely not. You make every investment decision. The AI processes documents, extracts data, applies your analysis criteria, and presents information for your review. All investment judgments, risk assessments, and go/no-go decisions are made by you as the investment professional.

### Q: How does this integrate with our existing investment process?
**A:** The system maps to standard institutional investment workflows with gates at each stage. You can customize the stage specifications to match your firm's specific criteria. The output generates standard IC memos and presentations that integrate seamlessly with existing investment committee processes.

### Q: Is our deal data secure?
**A:** Yes, all processing happens locally in your environment. No deal data is transmitted externally. The system creates local files and maintains audit trails entirely within your secure infrastructure.

---

## 🔧 Technical Questions

### Q: What file formats does the system accept?
**A:** The system works best with:
- **Excel files** (.xlsx) for financial statements and rent rolls
- **PDF files** (text-searchable) for leases and legal documents  
- **Word documents** (.docx) for reports and memoranda
- **Image files** are supported but text extraction may be limited

### Q: How long does it take to process a deal?
**A:** Initial processing (converting DueDiligence to structured data) typically takes 5-15 minutes depending on document volume. Each stage analysis can be completed in 1-4 hours depending on complexity. Total time from intake to IC decision is usually 1-3 business days vs. weeks for manual analysis.

### Q: Can I modify the stage specifications?
**A:** Yes, all stage specifications are stored as markdown files in the `/specs/` directory. You can modify criteria, add requirements, or customize the analysis framework to match your firm's specific standards.

### Q: What if the AI makes an error in data extraction?
**A:** All extracted data is stored in editable JSON files. You can manually correct any errors and document the changes in the analysis journey. The system is designed to be transparent so you can always verify and override AI outputs.

### Q: How does the audit trail work?
**A:** Every action is automatically timestamped and recorded in an `AnalysisJourney.md` file. This includes your analysis notes, decisions, pipeline movements, and any data corrections. The result is a complete, human-readable audit trail for regulatory compliance and quality assurance.

---

## 💼 Investment Process Questions

### Q: What if a deal doesn't fit standard LIHTC preservation criteria?
**A:** You can create custom analysis paths by modifying stage specifications or adding special handling notes in the analysis journey. The system is flexible enough to handle non-standard deals while maintaining the audit trail and decision documentation.

### Q: How do I handle deals that need more information?
**A:** Use the `REQUEST_MORE_INFO` decision to keep the deal in the current stage while documenting what additional information is needed. The deal stays in the "in-progress" substate until you have what you need to make a decision.

### Q: Can multiple people work on the same deal?
**A:** Yes, the analysis journey maintains a record of all contributors and their inputs. Different team members can add analysis entries, and the system tracks who made which decisions and when.

### Q: What happens to rejected deals?
**A:** Rejected deals are moved to the "rejected" substate with the complete analysis journey preserved. This creates valuable intelligence about why deals fail and helps improve future screening criteria.

### Q: How do I generate Investment Committee materials?
**A:** The system provides all the structured data and analysis needed for IC presentations. You can export the analysis journey and financial summaries to create standard IC memos and presentation decks. Future versions may include automated IC deck generation.

---

## 📊 Data and Analysis Questions

### Q: How accurate is the financial data extraction?
**A:** Financial extraction accuracy depends on document quality. Well-formatted Excel files typically achieve 95%+ accuracy. PDF financial statements may require manual verification. Always review extracted financial data before relying on it for investment decisions.

### Q: What if the property information is wrong?
**A:** Property information can be corrected by editing the `deal.json` file directly. Document any changes in the analysis journey with the source of the corrected information. Consider re-processing if the source documents can be improved.

### Q: Can the system handle mixed-use properties?
**A:** Yes, the system handles various property types including mixed-use. Make sure to provide detailed rent rolls that separate residential and commercial components. The analysis may require custom modifications for complex mixed-use structures.

### Q: How does LIHTC compliance tracking work?
**A:** The system extracts LIHTC compliance information from available documents and tracks key dates like compliance period end and extended use expiration. You should verify this information against official LIHTC documents and update as needed.

### Q: What market data does the system use?
**A:** The system processes market data that you provide in the DueDiligence package. It does not automatically pull external market data, giving you control over data sources and ensuring consistency with your firm's market analysis standards.

---

## 🚀 Workflow Questions

### Q: Do I have to follow the stages in order?
**A:** The standard workflow is designed to be followed sequentially, with each stage building on the previous analysis. However, you can move deals directly to later stages if appropriate, or create custom stage sequences for special situations.

### Q: Can I go back to a previous stage?
**A:** Yes, you can move deals backward through the pipeline if additional analysis is needed. Document the reason for the move in the analysis journey to maintain a clear audit trail.

### Q: What if I need to pause analysis on a deal?
**A:** Keep the deal in the "in-progress" substate of its current stage. Document the reason for the pause and any next steps in the analysis journey. The deal can be resumed at any time with full context preserved.

### Q: How do I prioritize multiple deals?
**A:** The system doesn't automatically prioritize deals, but you can use the pipeline folder structure and analysis journeys to track urgency, quality, and resource requirements. Consider adding priority fields to the deal.json structure if needed.

### Q: Can I batch process multiple deals?
**A:** Currently, each deal is processed individually to maintain quality and control. However, you can have multiple deals at different pipeline stages simultaneously. Future versions may support batch processing for similar deal types.

---

## 🔍 Quality Control Questions

### Q: How do I ensure consistent analysis across deals?
**A:** The stage specifications provide standardized criteria for all deals. Regular review and updates of these specifications ensure consistency. The analysis journey also allows you to reference previous similar deals for benchmarking.

### Q: What if team members analyze deals differently?
**A:** Use the stage specifications as the authoritative guide and encourage team members to document their reasoning clearly. Regular calibration sessions reviewing analysis journeys can help maintain consistency across the team.

### Q: How do I track analysis quality over time?
**A:** Review the analysis journeys of closed deals to identify patterns in successful vs. unsuccessful investments. Track metrics like time-to-decision, analysis accuracy, and post-investment performance against original underwriting.

### Q: Can I customize the analysis criteria?
**A:** Yes, all analysis criteria are defined in the stage specification files. You can modify these to match your firm's investment strategy, risk tolerance, and return requirements.

### Q: How do I handle edge cases or unusual deals?
**A:** Document special handling procedures in the analysis journey and consider creating custom stage specifications for recurring edge cases. The system's flexibility allows for non-standard analysis while maintaining audit trail integrity.

---

## 📈 Performance and Scaling Questions

### Q: How many deals can the system handle?
**A:** The system can handle hundreds of deals simultaneously, limited primarily by disk space for document storage. Performance is optimized for typical investment firm volumes (10-50 active deals).

### Q: Can multiple offices use the same system?
**A:** Yes, the system can be deployed across multiple locations with proper network setup. Consider implementing deal assignment and access controls for multi-office deployments.

### Q: How do I backup and archive deals?
**A:** Regular backups of the `processed-deals` and `pipeline` directories preserve all deal data and analysis journeys. Consider implementing automated backup procedures and archival policies for closed deals.

### Q: What are the system requirements?
**A:** The system requires Node.js 18+ and sufficient disk space for document storage. A modern computer with 8GB+ RAM and SSD storage provides optimal performance. Cloud deployment is possible for team access.

### Q: Can the system integrate with other software?
**A:** The system outputs standard JSON and markdown formats that can be integrated with other tools. API development is possible for custom integrations with property management, accounting, or portfolio management systems.

---

## 🎯 Getting Started Questions

### Q: How long does it take to learn the system?
**A:** Most investment professionals can learn the basic workflow in 1-2 hours. Becoming proficient with customization and advanced features typically takes a few days of practice with real deals.

### Q: Should I start with real deals or test data?
**A:** Start with the provided sample deals to learn the workflow without risk. Once comfortable, begin with simpler real deals before tackling complex transactions.

### Q: What training is available?
**A:** The system includes comprehensive documentation, sample deals, and step-by-step guides. Consider scheduling team training sessions to ensure consistent adoption across your organization.

### Q: How do I customize the system for my firm?
**A:** Begin by reviewing and modifying the stage specifications to match your investment criteria. Customize the analysis templates and add any firm-specific requirements. The system is designed to be adapted to your existing processes.

### Q: What ongoing maintenance is required?
**A:** Regular tasks include cleaning up old processed deals, updating stage specifications as your criteria evolve, and monitoring system performance. Most maintenance can be handled by your IT team or designated power users.

---

## 🆘 When Things Go Wrong

### Q: What if the system stops working?
**A:** Check the troubleshooting guide first, which covers common issues and solutions. Most problems are related to file permissions, formats, or naming conventions. The demo scripts can help identify system-level issues.

### Q: How do I recover lost data?
**A:** All deal data is stored in standard files that can be backed up and restored. If a deal is corrupted, you can re-process from the original DueDiligence documents. Regular backups prevent data loss.

### Q: What if I make a mistake in the analysis?
**A:** The analysis journey allows you to add correction entries explaining any changes or updates to previous analysis. You can also move deals backward through the pipeline if needed.

### Q: Who can help with technical issues?
**A:** Start with the troubleshooting guide and user documentation. For complex technical issues, contact your IT support team or the system developers with specific error messages and steps to reproduce the problem.

---

## 🔮 Future Development

### Q: What new features are planned?
**A:** Future development may include automated IC deck generation, external market data integration, portfolio-level analytics, and enhanced collaboration features. Feature priorities are driven by user feedback and requirements.

### Q: Can I request custom features?
**A:** Yes, the system is designed to be extensible. Document feature requests with specific use cases and business justification. Many customizations can be implemented through configuration changes rather than code development.

### Q: Will the AI capabilities improve over time?
**A:** The system is designed to incorporate advances in AI technology while maintaining the human-in-the-loop approach. Improvements in document processing, data extraction, and analysis support are continuously evaluated.

---

**💡 Don't see your question here?** Check the user guide for detailed information, or reach out with specific questions to improve this FAQ for future users.
