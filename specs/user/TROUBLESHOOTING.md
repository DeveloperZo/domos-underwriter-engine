# Domos AI Investment Committee - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### 1. Deal Processing Issues

#### Problem: `processDeal` fails with "No valid documents found"
**Symptoms:**
- Tool returns error about missing documents
- No structured files created
- Process terminates early

**Solutions:**
1. **Check File Formats**
   - Ensure PDFs are text-searchable (not just scanned images)
   - Convert Excel files to .xlsx format if needed
   - Verify Word documents are in .docx format

2. **Validate Folder Structure**
   ```
   sample-deals/DueDiligence/
   ├── Financial Statements/
   │   ├── T12 Income Statement.xlsx
   │   └── Rent Roll.xlsx
   ├── Leases/
   │   └── [lease documents]
   └── Property Info/
       └── [property documents]
   ```

3. **Check File Permissions**
   - Ensure files are not password-protected
   - Verify read permissions on all documents
   - Close any Excel files that might be open

#### Problem: Financial data extraction incomplete
**Symptoms:**
- deal.json shows $0 for financial metrics
- financialSummary.json is empty or minimal
- Missing key financial ratios

**Solutions:**
1. **Provide Standard T12 Format**
   - Use Excel format for income statements
   - Include monthly data for 12 months
   - Separate income and expense line items clearly

2. **Include Detailed Rent Roll**
   - Unit-by-unit rent information
   - Lease start/end dates
   - Tenant names and contact info
   - Security deposits and fees

3. **Add Supporting Documents**
   - Operating expense breakdown
   - Utility bills and statements
   - Property tax assessments
   - Insurance documentation

### 2. Stage Analysis Issues

#### Problem: `analyzeStage` shows incomplete data
**Symptoms:**
- Missing property information
- Incomplete stage specification
- Error loading deal or spec files

**Solutions:**
1. **Verify Deal Path**
   ```bash
   # Correct format
   analyzeStage("processed-deals/property-name-timestamp", "A-initial-intake")
   
   # Check that path exists and contains deal.json
   ```

2. **Confirm Stage Names**
   - Use exact stage codes: `A-initial-intake`, `B-preliminary-analysis`, etc.
   - Check spelling and capitalization
   - Verify stage specification exists in `/specs/`

3. **Regenerate Deal if Needed**
   - If data appears corrupted, re-run `processDeal`
   - Check for file system issues
   - Ensure sufficient disk space

#### Problem: Stage specification not loading
**Symptoms:**
- "No specification found for stage" error
- Missing analysis requirements
- Empty stage content

**Solutions:**
1. **Check Specs Directory**
   ```
   specs/
   ├── stage_01/stage-1-initial-intake.md
   ├── stage_02/stage-2-preliminary-analysis.md
   ├── stage_03/stage-3-full-underwriting.md
   └── ic-recommendation.md
   ```

2. **Verify File Names**
   - Ensure exact file name matches stage mapping
   - Check for typos in file names
   - Confirm markdown format (.md extension)

3. **Validate File Content**
   - Open spec files manually to check content
   - Ensure proper markdown formatting
   - Verify all required sections are present

### 3. Analysis Recording Issues

#### Problem: `completeAnalysis` doesn't update AnalysisJourney.md
**Symptoms:**
- Analysis text not appearing in journey file
- Timestamps not updating
- File appears unchanged

**Solutions:**
1. **Check File Permissions**
   - Ensure AnalysisJourney.md is not read-only
   - Verify write permissions to deal folder
   - Close file if open in other applications

2. **Validate Analysis Format**
   - Provide analysis as plain text or markdown
   - Avoid special characters that might break formatting
   - Keep analysis length reasonable (< 10,000 characters)

3. **Manual Recovery**
   ```markdown
   # Add this to AnalysisJourney.md manually if needed
   
   ## Analysis Entry - [current timestamp]
   
   **Stage:** [stage name]
   **Analyst:** [your name]
   **Recommendation:** [ADVANCE/REJECT/etc.]
   
   [Your analysis content]
   
   ---
   ```

### 4. Pipeline Movement Issues

#### Problem: `moveDeal` fails to move deal
**Symptoms:**
- Deal stays in current stage
- "Error moving deal" message
- Pipeline folders not created

**Solutions:**
1. **Check Stage Transitions**
   ```
   Valid progressions:
   A-initial-intake → B-preliminary-analysis
   B-preliminary-analysis → C-full-underwriting
   C-full-underwriting → D-ic-review
   D-ic-review → E-loi-psa
   ```

2. **Verify Decision Codes**
   - Use exact codes: `ADVANCE`, `REJECT`, `REQUEST_MORE_INFO`, `REVISIONS_REQUIRED`
   - Check capitalization
   - Avoid extra spaces or characters

3. **Check Pipeline Structure**
   ```
   pipeline/
   ├── A-initial-intake/
   │   ├── not-started/
   │   ├── in-progress/
   │   ├── completed/
   │   └── rejected/
   ```

4. **Manual Move Process**
   ```bash
   # If automatic move fails, do manually:
   1. Copy deal folder to target location
   2. Update deal.json status field
   3. Add entry to AnalysisJourney.md
   4. Remove from old location
   ```

### 5. Data Quality Issues

#### Problem: Inaccurate property information
**Symptoms:**
- Wrong unit count or property type
- Missing address information
- Incorrect year built or property details

**Solutions:**
1. **Improve Source Documents**
   - Provide property deed or title documents
   - Include detailed property surveys
   - Add property management reports
   - Supply accurate unit count documentation

2. **Manual Corrections**
   - Edit deal.json directly for critical corrections
   - Document changes in AnalysisJourney.md
   - Note source of corrected information

3. **Re-process if Needed**
   - If errors are extensive, start over with better documents
   - Clean up source documents before re-processing
   - Ensure all key documents are included

#### Problem: LIHTC compliance information missing
**Symptoms:**
- currentlyLIHTC shows as unknown
- Missing compliance dates
- Unclear AMI restrictions

**Solutions:**
1. **Gather LIHTC Documents**
   - Original LIHTC allocation documents
   - Current compliance monitoring reports
   - Extended use agreements
   - AMI income certification records

2. **Contact Current Owner**
   - Request LIHTC compliance history
   - Get current set-aside percentages
   - Verify any compliance violations
   - Obtain income restriction details

### 6. Performance Issues

#### Problem: Slow processing or analysis
**Symptoms:**
- Tools take unusually long to complete
- System appears frozen
- Timeout errors

**Solutions:**
1. **Check System Resources**
   - Ensure sufficient RAM and CPU available
   - Close unnecessary applications
   - Check for background processes consuming resources

2. **Optimize Document Size**
   - Compress large PDF files
   - Remove unnecessary documents from DueDiligence
   - Split very large Excel files into smaller ones

3. **Process in Batches**
   - Handle one deal at a time
   - Break large analysis into smaller pieces
   - Use incremental processing for complex deals

### 7. Audit Trail Issues

#### Problem: Missing or incomplete audit trail
**Symptoms:**
- AnalysisJourney.md doesn't show complete history
- Missing timestamps or decision rationale
- Gaps in analysis progression

**Solutions:**
1. **Reconstruct from Available Data**
   - Check deal.json for status history
   - Review pipeline folder locations
   - Look for backup files or previous versions

2. **Implement Going Forward**
   - Ensure every analysis is recorded
   - Add manual entries for any missing pieces
   - Double-check audit trail after each stage

3. **Backup Strategy**
   - Regularly backup processed-deals folder
   - Export analysis journeys to separate files
   - Maintain version control of important decisions

---

## 🔍 Diagnostic Commands

### Check System Status
```bash
# Verify all directories exist
ls -la specs/
ls -la processed-deals/
ls -la pipeline/

# Check for recent deal processing
ls -la processed-deals/ | head -10

# Verify stage specifications
ls -la specs/stage_*/
```

### Validate Deal Structure
```javascript
// Check deal.json structure
{
  "id": "should be unique",
  "propertyName": "should not be empty",
  "basicInfo": {
    "totalUnits": "should be > 0",
    "yearBuilt": "should be reasonable year"
  },
  "lihtcInfo": {
    "currentlyLIHTC": "should be true/false"
  }
}
```

### Test MCP Tools
```bash
# Test basic functionality
npm run demo-mcp

# Test individual tools
npm run mcp-tools
npm run mcp-process "sample-deals/DueDiligence"
```

---

## 📞 Getting Help

### Before Contacting Support
1. **Check this troubleshooting guide** for your specific issue
2. **Review the user guide** for detailed workflow instructions
3. **Test with sample data** to isolate the problem
4. **Check system requirements** and dependencies

### Information to Provide
When reporting issues, include:
- Exact error messages
- Steps to reproduce the problem
- System configuration details
- Sample files (if possible)
- Screenshots of error conditions

### Escalation Path
1. **Self-service**: Troubleshooting guide and user documentation
2. **Technical support**: For system or integration issues
3. **Process support**: For workflow or analysis questions
4. **Development team**: For feature requests or bugs

---

## 🛠️ Maintenance Tasks

### Regular Maintenance
- **Weekly**: Clean up old processed deals
- **Monthly**: Review and update stage specifications
- **Quarterly**: Audit analysis quality and consistency

### System Health Checks
- Monitor disk space in processed-deals and pipeline folders
- Verify all stage specifications are current
- Test sample deal processing regularly
- Check audit trail completeness

### Performance Optimization
- Archive old deals to reduce folder size
- Optimize document formats for faster processing
- Update system resources as needed
- Monitor for memory leaks or performance degradation

---

**🎯 Remember**: Most issues can be resolved by checking file formats, permissions, and following the exact naming conventions. When in doubt, start with a simple test case using the sample data.
