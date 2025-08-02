# Common Issues

## Purpose
This document addresses frequently encountered issues when using the Domos Underwriter Engine and provides practical solutions.

## Document Processing Issues

### Issue: Processing Deal Fails
**Symptoms**:
- Error message during `mcp-process` command
- Incomplete structured data output
- Missing JSON files in processed-deals directory

**Solutions**:
1. **Check document formats**:
   - Ensure financial data is in Excel format (.xlsx, .xls)
   - Verify PDFs are text-based, not scanned images
   - Check file permissions and accessibility

2. **Process individual documents**:
   ```bash
   npm run mcp-process-doc "sample-deals/deal-name/financial.xlsx"
   ```

3. **Verify folder structure**:
   - Ensure documents are in the correct folder
   - Check for spaces or special characters in file names
   - Verify correct path in command

4. **Check for file corruption**:
   - Open files to verify they can be read
   - Re-save in standard formats if needed
   - Check for password protection

### Issue: Missing Financial Data
**Symptoms**:
- financialSummary.json has incomplete metrics
- Warning about missing financial information
- Zero values for key metrics

**Solutions**:
1. **Provide T12 in proper format**:
   - Use Excel with clear row/column headers
   - Include monthly breakdown if available
   - Ensure standard financial categories

2. **Check rent roll completeness**:
   - Include unit-by-unit breakdown
   - Provide occupancy status for all units
   - Include lease terms and rent amounts

3. **Add operating expense details**:
   - Break down by standard categories
   - Include historical data if available
   - Provide capital expenditure history

4. **Manual data entry if needed**:
   ```bash
   npm run mcp-edit-financial "processed-deals/deal-path"
   ```

## Analysis Issues

### Issue: Incomplete Analysis
**Symptoms**:
- Difficulty assessing all stage criteria
- Analysis seems superficial or missing key aspects
- Uncertainty about recommendation

**Solutions**:
1. **Review stage specification thoroughly**:
   - Check `/specs/stage_XX/` for detailed criteria
   - Ensure you understand all requirements
   - Note which areas need deeper analysis

2. **Break analysis into components**:
   - Focus on one criterion at a time
   - Provide specific evidence for each
   - Address each requirement explicitly

3. **Use structured approach**:
   - Start with financial metrics
   - Add market assessment
   - Include risk identification
   - End with clear recommendation

4. **Request clarification if needed**:
   - Consult with team members
   - Review sample analyses
   - Check stage requirements documentation

### Issue: Unable to Make Decision
**Symptoms**:
- Conflicting indicators in the analysis
- Borderline performance against criteria
- Insufficient confidence in recommendation

**Solutions**:
1. **Quantify the uncertainty**:
   - Calculate ranges for key metrics
   - Perform sensitivity analysis
   - Identify specific information gaps

2. **Use REQUEST_MORE_INFO appropriately**:
   - Specify exactly what additional data would help
   - Explain why it's needed for decision
   - Set clear expectations for follow-up

3. **Elevate for team review**:
   - Document the key decision points
   - Present options with pros/cons
   - Request input from senior team members

4. **Document your reasoning process**:
   - Show your work even if inconclusive
   - Explain competing considerations
   - Provide confidence level assessment

## Pipeline Movement Issues

### Issue: Move Deal Command Fails
**Symptoms**:
- Error message during `mcp-move` command
- Deal remains in current stage/state
- Pipeline structure not updated

**Solutions**:
1. **Verify exact stage names**:
   - Stage codes are case-sensitive (e.g., "A-initial-intake")
   - Check for typos or extra spaces
   - Use tab completion when available

2. **Confirm decision code is valid**:
   - Must be exactly: ADVANCE, REJECT, REQUEST_MORE_INFO, or REVISIONS_REQUIRED
   - Check for typos or case differences
   - Verify quotation marks if using in command

3. **Check deal path accuracy**:
   - Ensure path points to valid deal directory
   - Verify no typos in timestamp portion
   - Use tab completion for accurate paths

4. **Verify folder permissions**:
   - Ensure write access to pipeline directories
   - Check for locked files
   - Verify sufficient disk space

### Issue: Deal in Wrong Pipeline Stage
**Symptoms**:
- Deal appears in incorrect pipeline stage
- Analysis sequence disrupted
- Status inconsistency in tracking

**Solutions**:
1. **Assess the situation**:
   - Determine correct stage location
   - Check deal.json for current status
   - Review AnalysisJourney.md for history

2. **Use special move command**:
   ```bash
   npm run mcp-force-move "processed-deals/deal-path" "incorrect-stage" "correct-stage"
   ```

3. **Document correction**:
   - Add note to AnalysisJourney.md explaining change
   - Update any tracking spreadsheets
   - Notify team members if needed

4. **Verify correct positioning**:
   - Run status check to confirm placement
   - Ensure deal appears in expected location
   - Verify deal.json status is updated

## Audit Trail Issues

### Issue: Missing Analysis History
**Symptoms**:
- AnalysisJourney.md incomplete or missing entries
- Cannot track decision process
- Gaps in analysis documentation

**Solutions**:
1. **Check for file corruption**:
   - Open AnalysisJourney.md directly
   - Verify file permissions
   - Check for editing conflicts

2. **Add missing analysis**:
   ```bash
   npm run mcp-append-analysis "processed-deals/deal-path" "stage-code" "Missing analysis text..."
   ```

3. **Recreate if necessary**:
   - Use deal.json status history
   - Check commit history if using version control
   - Consult team records and notes

4. **Prevent future issues**:
   - Always use proper commands for analysis
   - Avoid direct file editing
   - Create backups of critical analysis

### Issue: Conflicting Analysis
**Symptoms**:
- Multiple conflicting entries in AnalysisJourney.md
- Unclear final recommendation
- Inconsistent decision rationale

**Solutions**:
1. **Review full history**:
   - Note timestamp of each entry
   - Identify most recent authoritative analysis
   - Understand reasoning for changes

2. **Add clarification entry**:
   ```bash
   npm run mcp-complete "processed-deals/deal-path" "stage-code" "Clarification: The final recommendation is X because..."
   ```

3. **Document resolution process**:
   - Explain which analysis takes precedence
   - Note factors that resolved the conflict
   - Provide clear path forward

4. **Implement process improvements**:
   - Establish clear analysis ownership
   - Create review process for significant changes
   - Document final decisions explicitly

## System Performance Issues

### Issue: Slow Processing
**Symptoms**:
- Commands take longer than expected
- System unresponsive during operations
- Timeout errors during processing

**Solutions**:
1. **Check system resources**:
   - Verify sufficient memory and CPU
   - Close other resource-intensive applications
   - Check disk space and I/O performance

2. **Process smaller batches**:
   - Break large document sets into smaller groups
   - Process one document type at a time
   - Use incremental processing options

3. **Optimize file sizes**:
   - Compress large PDFs
   - Split very large Excel files
   - Remove unnecessary attachments

4. **Update system dependencies**:
   - Ensure Node.js is current version
   - Update npm packages: `npm update`
   - Check for system updates

## Related Documents
- [Core Commands](./CORE_COMMANDS.md) - Complete command reference
- [Getting Started](./GETTING_STARTED.md) - Installation troubleshooting

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Support Team  
**Status**: Active
