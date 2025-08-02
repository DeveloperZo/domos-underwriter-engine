#!/usr/bin/env node

import { DealManager } from './deal-manager.js';
import { StageProcessor } from './stage-processor.js';
import { AuditLogger } from './audit-logger.js';
import { join } from 'path';

async function processToStage() {
  console.log('🎯 Domos Stage-Specific Processing');
  console.log('==================================\n');
  
  const dealManager = new DealManager();
  const stageProcessor = new StageProcessor();
  const auditLogger = new AuditLogger();
  
  // Parse command line arguments
  const dealPath = process.argv[2];
  const targetStage = parseInt(process.argv[3]);
  
  // Validate arguments
  if (!dealPath) {
    console.error('❌ Error: Deal path is required');
    showUsage();
    process.exit(1);
  }
  
  if (!targetStage || targetStage < 1 || targetStage > 6) {
    console.error('❌ Error: Valid stage number (1-6) is required');
    showUsage();
    process.exit(1);
  }
  
  try {
    console.log(`📁 Deal Path: ${dealPath}`);
    console.log(`🎯 Target Stage: ${targetStage} (${getStageName(targetStage)})`);
    
    // Step 1: Ensure deal structure is processed
    console.log('\n📋 Step 1: Ensuring deal structure is processed...');
    let dealStructure;
    try {
      dealStructure = await dealManager.processDealFromFolder(dealPath);
      console.log(`✅ Deal structure ready: ${dealStructure.structuredData.deal.propertyName}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Failed to process deal structure:', error.message);
      } else {
        console.error('❌ Failed to process deal structure:', error);
      }
      process.exit(1);
    }
    
    // Step 2: Check current stage status
    console.log('\n📊 Step 2: Checking current progress...');
    const currentStatus = await auditLogger.getCurrentStatus(dealPath);
    
    if (currentStatus) {
      console.log(`Current Stage: ${currentStatus.stage}`);
      console.log(`Current Status: ${currentStatus.status}`);
      
      if (currentStatus.stage >= targetStage) {
        console.log(`\n⚠️  Deal has already completed stage ${targetStage}`);
        console.log('Use --force flag to reprocess, or choose a higher stage number');
        
        // Show what's available
        await showCurrentProgress(dealPath, auditLogger);
        return;
      }
    } else {
      console.log('No previous processing found - starting fresh');
    }
    
    // Step 3: Process stages up to target
    console.log(`\n🔄 Step 3: Processing stages 1 through ${targetStage}...`);
    
    const startStage = currentStatus ? Math.max(1, currentStatus.stage + 1) : 1;
    console.log(`Starting from stage ${startStage}`);
    
    const stageResults = [];
    
    for (let stage = startStage; stage <= targetStage; stage++) {
      try {
        console.log(`\n🔄 Processing Stage ${stage}: ${getStageName(stage)}`);
        
        const result = await stageProcessor.processStage(dealPath, stage);
        stageResults.push(result);
        
        const emoji = getDecisionEmoji(result.decision.recommendation);
        console.log(`  ${emoji} Stage ${stage}: ${result.decision.recommendation}`);
        console.log(`     ${result.decision.reasoning}`);
        
        // If rejected or held, stop processing
        if (result.decision.recommendation === 'REJECT') {
          console.log(`\n❌ Deal rejected at Stage ${stage}. Processing stopped.`);
          break;
        } else if (result.decision.recommendation === 'HOLD') {
          console.log(`\n⏸️  Deal on hold at Stage ${stage}. Manual review required.`);
          break;
        }
        
      } catch (error) {
        console.error(`❌ Error at Stage ${stage}:`, error);
        break;
      }
    }
    
    // Step 4: Show final status
    console.log('\n📊 Step 4: Final Status');
    console.log('=======================');
    
    const finalStatus = await auditLogger.getCurrentStatus(dealPath);
    if (finalStatus) {
      console.log(`Current Stage: ${finalStatus.stage} (${getStageName(finalStatus.stage)})`);
      console.log(`Status: ${finalStatus.status}`);
      
      if (finalStatus.lastDecision) {
        console.log(`Last Decision: ${finalStatus.lastDecision.decision}`);
        console.log(`Reasoning: ${finalStatus.lastDecision.reasoning}`);
      }
    }
    
    // Step 5: Show generated files
    console.log('\n📂 Step 5: Generated Files');
    console.log('==========================');
    
    if (stageResults.length > 0) {
      console.log('New stage outputs created:');
      stageResults.forEach(result => {
        const stageNum = result.analysis.stage.toString().padStart(2, '0');
        console.log(`  ✅ Stage${stageNum}_${result.analysis.stageName.replace(/\\s+/g, '')}.md`);
      });
    }
    
    console.log(`\n📁 Check: ${dealPath}/Outputs/ for all stage reports`);
    console.log(`📁 Check: ${dealPath}/AnalysisJourney/auditLog.json for audit trail`);
    
    // Step 6: Show next steps
    if (finalStatus && finalStatus.status === 'ACTIVE' && finalStatus.stage < 6) {
      console.log('\n🔮 Next Steps');
      console.log('=============');
      console.log(`To continue processing: npm run process-to-stage ${dealPath} ${finalStatus.stage + 1}`);
      console.log(`To process all remaining: npm run demo-stages ${dealPath}`);
    }
    
    console.log('\n✅ Stage processing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in stage processing:', error);
    showUsage();
    process.exit(1);
  }
}

function getStageName(stage: number): string {
  const names: { [key: string]: string } = {
    '1': 'Strategic Qualification',
    '2': 'Market Intelligence', 
    '3': 'Due Diligence',
    '4': 'Financial Underwriting',
    '5': 'IC Review',
    '6': 'Final Approval'
  };
  return names[String(stage)] || 'Unknown';
}

function getDecisionEmoji(decision: string): string {
  switch (decision) {
    case 'ADVANCE': return '✅';
    case 'REJECT': return '❌';
    case 'HOLD': return '⏸️';
    case 'REQUEST_MORE_INFO': return '📋';
    default: return '❓';
  }
}

async function showCurrentProgress(dealPath: string, auditLogger: AuditLogger) {
  const auditLog = await auditLogger.loadAuditLog(dealPath);
  if (auditLog && auditLog.entries.length > 0) {
    console.log('\n📋 Current Progress:');
    auditLog.entries.forEach(entry => {
      const emoji = getDecisionEmoji(entry.decision);
      console.log(`  ${emoji} Stage ${entry.stage}: ${entry.stageName} - ${entry.decision}`);
    });
  }
}

function showUsage() {
  console.log('\n💡 Usage: npm run process-to-stage <deal-path> <stage-number>');
  console.log('\nExamples:');
  console.log('  npm run process-to-stage sample-deals 1    # Process to Strategic Qualification');
  console.log('  npm run process-to-stage sample-deals 3    # Process through Due Diligence');
  console.log('  npm run process-to-stage sample-deals 6    # Process to Final Approval');
  console.log('\nStages:');
  console.log('  1 - Strategic Qualification');
  console.log('  2 - Market Intelligence');
  console.log('  3 - Due Diligence');
  console.log('  4 - Financial Underwriting');
  console.log('  5 - IC Review');
  console.log('  6 - Final Approval');
  console.log('\nNote: Run "npm run process-deal <path>" first to parse documents');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processToStage().catch(console.error);
}

export { processToStage };
