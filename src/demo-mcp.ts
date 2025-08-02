#!/usr/bin/env node

import DomosMCPServer from './mcp-server.js';

/**
 * Demo script to test the MCP workflow end-to-end
 */
async function runMCPDemo() {
  console.log('🚀 Starting Domos MCP Server Demo\n');
  
  const server = new DomosMCPServer();
  
  try {
    // Step 1: List available tools
    console.log('📋 Available MCP Tools:');
    const tools = server.getTools();
    tools.forEach(tool => {
      console.log(`  • ${tool.name}: ${tool.description}`);
    });
    console.log();
    
    // Step 2: Process the sample deal
    console.log('🔄 Step 1: Processing sample deal...');
    const processResult = await server.handleToolCall('processDeal', {
      dueDiligencePath: 'sample-deals/DueDiligence'
    });
    console.log(processResult.content[0].text);
    console.log();
    
    // Extract deal path from the result (this is a bit hacky for demo purposes)
    const resultText = processResult.content[0].text;
    const pathMatch = resultText.match(/\*\*Output Path:\*\* (.+)/);
    if (!pathMatch) {
      throw new Error('Could not extract deal path from process result');
    }
    const dealPath = pathMatch[1];
    
    // Step 3: Analyze initial intake stage
    console.log('🔍 Step 2: Loading initial intake analysis...');
    const analyzeResult = await server.handleToolCall('analyzeStage', {
      dealPath,
      stage: 'A-initial-intake'
    });
    
    // Print just the deal info and spec header for demo
    const analyzeText = analyzeResult.content[0].text;
    const dealInfoSection = analyzeText.substring(0, analyzeText.indexOf('## Stage Specification') + 100);
    console.log(dealInfoSection + '...\n[Spec content truncated for demo]\n');
    
    // Step 4: Complete Claude analysis
    console.log('🤖 Step 3: Performing Claude analysis...');
    const mockClaudeAnalysis = `## Initial Intake Analysis

**Claude Analysis:** ${new Date().toISOString()}  
**Stage:** A-initial-intake  
**Recommendation:** ADVANCE

### Assessment Against Stage Specification
- ✅ Property meets basic LIHTC preservation criteria
- ✅ Financial structure appears viable for underwriting
- ✅ No immediate red flags in preliminary data
- ⚠️ Need complete T12 and rent roll for full analysis

### Key Findings
1. **The Frank** is a 45-unit mixed-use property in Atlanta
2. Historic renovation project built in 1960
3. Currently not LIHTC but excellent preservation opportunity
4. Located in strong market area with good fundamentals

### Risk Assessment
- Low: Property age manageable for renovation
- Medium: Incomplete financial data requires validation
- Low: Market location supports underwriting assumptions

### Recommendation
**ADVANCE** to B-preliminary-analysis stage

### Next Steps
- Gather complete T12 financial statements
- Obtain detailed rent roll with lease terms
- Schedule property inspection
- Preliminary market analysis

**Confidence Level:** 85%`;

    const completeResult = await server.handleToolCall('completeAnalysis', {
      dealPath,
      stage: 'A-initial-intake',
      analysis: mockClaudeAnalysis
    });
    console.log(completeResult.content[0].text);
    console.log();
    
    // Step 5: Move deal to next stage
    console.log('📦 Step 4: Moving deal to next stage...');
    const moveResult = await server.handleToolCall('moveDeal', {
      dealPath,
      fromStage: 'A-initial-intake',
      toStage: 'B-preliminary-analysis',
      decision: 'ADVANCE'
    });
    console.log(moveResult.content[0].text);
    console.log();
    
    console.log('✅ Demo completed successfully!');
    console.log('\n🎯 **Key Benefits of this MCP Approach:**');
    console.log('• Clean separation of file operations (MCP) vs analysis (Claude)');
    console.log('• Transparent audit trail in AnalysisJourney.md automatically updated');
    console.log('• Simple 4-tool interface that covers the full workflow');
    console.log('• Human controls workflow, Claude performs analysis');
    console.log('• Automated pipeline management and audit tracking');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('• Make sure sample-deals/DueDiligence exists');
    console.log('• Check that all dependencies are installed (npm install)');
    console.log('• Verify TypeScript compilation (npm run build)');
  }
}

// Run the demo
runMCPDemo();
