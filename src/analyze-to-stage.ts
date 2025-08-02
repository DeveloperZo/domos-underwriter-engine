#!/usr/bin/env node

import { DealManager } from './deal-manager';
import { StageProcessor } from './stage-processor';
import { AuditLogger } from './audit-logger';
import { join } from 'path';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { AuditLog } from './types/audit-types';

/**
 * Enhanced deal metadata interface
 */
interface DealMetadata {
  dealId: string;
  propertyName: string;
  currentStage: number;
  stageStatuses: {
    [key: string]: {
      status: 'pending' | 'approved' | 'rejected' | 'needs-review';
      analyzedAt: string;
      issues?: string[];
    }
  };
  overallStatus: 'active' | 'rejected' | 'approved' | 'on-hold';
  lastAnalyzedAt: string;
  analysisHistory: {
    timestamp: string;
    stage: number;
    action: string;
    result: string;
    user?: string;
  }[];
}

/**
 * Main analyze-to-stage function with enhanced metadata tracking
 */
async function analyzeToStage() {
  console.log('🎯 Domos Deal Analysis Pipeline');
  console.log('================================\n');
  
  const dealManager = new DealManager();
  const stageProcessor = new StageProcessor();
  const auditLogger = new AuditLogger();
  
  // Parse command line arguments
  const dealPath = process.argv[2];
  const targetStage = parseInt(process.argv[3]);
  const force = process.argv.includes('--force');
  
  // Validate arguments
  if (!dealPath) {
    console.error('❌ Error: Deal path is required');
    showUsage();
    process.exit(1);
  }
  
  if (!targetStage || targetStage < 1 || targetStage > 9) {
    console.error('❌ Error: Valid stage number (1-9) is required');
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
    
    // Step 2: Load or initialize deal metadata
    console.log('\n📊 Step 2: Loading deal metadata...');
    let metadata = await loadDealMetadata(dealPath);
    if (!metadata) {
      console.log('🆕 No existing metadata found. Initializing new metadata...');
      metadata = await initializeDealMetadata(dealPath, dealStructure.structuredData.deal);
      console.log('✅ Metadata initialized');
    } else {
      console.log(`✅ Loaded existing metadata for ${metadata.propertyName}`);
    }

    // Step 3: Check current deal status and determine if analysis should proceed
    console.log('\n🔍 Step 3: Checking deal status...');
    
    if (metadata.overallStatus === 'rejected' && !force) {
      console.log(`⚠️  Deal was previously rejected at stage ${findRejectionStage(metadata)}`);
      console.log('To override and re-analyze, use the --force flag');
      showCurrentProgress(metadata);
      return;
    }
    
    if (metadata.currentStage >= targetStage && !force) {
      console.log(`⚠️  Deal has already been analyzed through stage ${metadata.currentStage}`);
      console.log('To re-analyze, use the --force flag');
      showCurrentProgress(metadata);
      return;
    }
    
    if (targetStage > metadata.currentStage + 1) {
      console.log(`⚠️  Warning: You're skipping stages (from ${metadata.currentStage} to ${targetStage})`);
      console.log('This may result in incomplete analysis');
      
      if (!force) {
        console.log('To skip stages, use the --force flag');
        return;
      }
    }
    
    // Step 4: Load audit log for stage processing
    console.log('\n📈 Step 4: Checking audit log...');
    let auditLog = await auditLogger.loadAuditLog(dealPath);
    if (!auditLog) {
      console.log('🆕 No audit log found. Initializing new audit log...');
      // Create a compatible deal object for the audit logger
      const auditDeal = {
        ...dealStructure.structuredData.deal,
        _meta: {
          stage: 'initial-intake' as const,
          createdAt: dealStructure.structuredData.deal.createdAt,
          updatedAt: dealStructure.structuredData.deal.updatedAt,
          currentStage: 1,
          stageStatuses: {},
          analysisHistory: [],
          flags: {},
          lastAnalyzedAt: new Date().toISOString()
        }
      };
      auditLog = await auditLogger.initializeAuditLog(dealPath, auditDeal);
      console.log('✅ Audit log initialized');
    } else {
      console.log(`✅ Loaded existing audit log (Current stage: ${auditLog.currentStage}, Status: ${auditLog.currentStatus})`);
    }
    
    // Step 5: Process stages
    console.log(`\n🔄 Step 5: Processing stages up to ${targetStage}...`);
    
    // Determine starting stage (continue from current stage unless forced)
    const startStage = force ? 1 : Math.max(1, metadata.currentStage + 1);
    console.log(`Starting from stage ${startStage}`);
    
    const stageResults = [];
    let exitEarly = false;
    
    for (let stage = startStage; stage <= targetStage; stage++) {
      if (exitEarly) break;
      
      try {
        console.log(`\n🔄 Processing Stage ${stage}: ${getStageName(stage)}`);
        
        // Record analysis start in history
        metadata.analysisHistory.push({
          timestamp: new Date().toISOString(),
          stage: stage,
          action: 'start_analysis',
          result: 'in_progress'
        });
        await saveDealMetadata(dealPath, metadata);
        
        // Process the stage
        const result = await stageProcessor.processStage(dealPath, stage);
        stageResults.push(result);
        
        // Update metadata with stage result
        metadata.stageStatuses[stage.toString()] = {
          status: mapDecisionToStatus(result.decision.recommendation),
          analyzedAt: new Date().toISOString(),
          issues: result.decision.recommendation !== 'ADVANCE' ? [result.decision.reasoning] : undefined
        };
        
        metadata.currentStage = stage;
        metadata.lastAnalyzedAt = new Date().toISOString();
        
        // Add to analysis history
        metadata.analysisHistory.push({
          timestamp: new Date().toISOString(),
          stage: stage,
          action: 'complete_analysis',
          result: result.decision.recommendation
        });
        
        // Update overall status based on decision
        if (result.decision.recommendation === 'REJECT') {
          metadata.overallStatus = 'rejected';
          exitEarly = true;
        } else if (result.decision.recommendation === 'HOLD') {
          metadata.overallStatus = 'on-hold';
          exitEarly = true;
        } else if (stage === 9 && result.decision.recommendation === 'ADVANCE') {
          metadata.overallStatus = 'approved';
        }
        
        // Save updated metadata
        await saveDealMetadata(dealPath, metadata);
        
        const emoji = getDecisionEmoji(result.decision.recommendation);
        console.log(`  ${emoji} Stage ${stage}: ${result.decision.recommendation}`);
        console.log(`     ${result.decision.reasoning}`);
        
        // If rejected or held, stop processing
        if (exitEarly) {
          const statusText = metadata.overallStatus === 'rejected' ? 'rejected' : 'on hold';
          console.log(`\n${emoji} Deal is now ${statusText} at Stage ${stage}. Processing stopped.`);
        }
        
      } catch (error) {
        console.error(`❌ Error at Stage ${stage}:`, error);
        
        // Record error in metadata
        metadata.stageStatuses[stage.toString()] = {
          status: 'needs-review',
          analyzedAt: new Date().toISOString(),
          issues: [error instanceof Error ? error.message : String(error)]
        };
        
        metadata.analysisHistory.push({
          timestamp: new Date().toISOString(),
          stage: stage,
          action: 'error_in_analysis',
          result: error instanceof Error ? error.message : String(error)
        });
        
        await saveDealMetadata(dealPath, metadata);
        break;
      }
    }
    
    // Step 6: Show final status
    console.log('\n📊 Step 6: Final Status');
    console.log('=======================');
    
    // Refresh metadata after all processing
    metadata = await loadDealMetadata(dealPath) || metadata;
    
    console.log(`Current Stage: ${metadata.currentStage} (${getStageName(metadata.currentStage)})`);
    console.log(`Overall Status: ${metadata.overallStatus.toUpperCase()}`);
    
    // Show last stage status
    const lastStageStatus = metadata.stageStatuses[metadata.currentStage.toString()];
    if (lastStageStatus) {
      console.log(`Last Stage Status: ${lastStageStatus.status.toUpperCase()}`);
      if (lastStageStatus.issues && lastStageStatus.issues.length > 0) {
        console.log(`Issues: ${lastStageStatus.issues[0]}`);
      }
    }
    
    // Step 7: Show generated files
    console.log('\n📂 Step 7: Generated Files');
    console.log('==========================');
    
    if (stageResults.length > 0) {
      console.log('New stage outputs created:');
      stageResults.forEach(result => {
        const stageNum = result.analysis.stage.toString().padStart(2, '0');
        console.log(`  ✅ Stage${stageNum}_${result.analysis.stageName.replace(/\s+/g, '')}.md`);
        
        // Show Glass Box outputs for enhanced transparency
        console.log(`     📋 DecisionSummary.md`);
        console.log(`     📋 InputTrace.md`);
        console.log(`     📋 RedFlagsRaised.md`);
        if (result.decision.recommendation !== 'ADVANCE') {
          console.log(`     📋 OverrideNotes.md`);
        }
      });
    }
    
    console.log(`\n📁 Check: ${dealPath}/Outputs/ for all stage reports`);
    console.log(`📁 Check: ${dealPath}/AnalysisJourney/auditLog.json for audit trail`);
    console.log(`📁 Check: ${dealPath}/metadata.json for deal metadata`);
    
    // Step 8: Show next steps
    if (metadata.overallStatus === 'active' && metadata.currentStage < 9) {
      console.log('\n🔮 Next Steps');
      console.log('=============');
      console.log(`To continue analysis: npm run analyze-to-stage ${dealPath} ${metadata.currentStage + 1}`);
      console.log(`To analyze all remaining stages: npm run analyze-to-stage ${dealPath} 9`);
    } else if (metadata.overallStatus === 'approved') {
      console.log('\n🎉 Deal Approved');
      console.log('================');
      console.log('All stages have been successfully completed and the deal is approved.');
      console.log('Use "npm run generate-ic-deck" to create an Investment Committee presentation.');
    } else if (metadata.overallStatus === 'rejected') {
      console.log('\n❌ Deal Rejected');
      console.log('================');
      console.log(`The deal was rejected at stage ${metadata.currentStage}.`);
      console.log('Use "--force" flag to override and continue analysis if needed.');
    } else if (metadata.overallStatus === 'on-hold') {
      console.log('\n⏸️  Deal On Hold');
      console.log('================');
      console.log(`The deal is on hold at stage ${metadata.currentStage} and requires manual review.`);
      console.log('Use "npm run review-hold" to provide manual review input.');
    }
    
    console.log('\n✅ Stage analysis completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in stage analysis:', error);
    showUsage();
    process.exit(1);
  }
}

/**
 * Initialize a new deal metadata file
 */
async function initializeDealMetadata(dealPath: string, deal: any): Promise<DealMetadata> {
  // Create metadata object
  const metadata: DealMetadata = {
    dealId: deal.id,
    propertyName: deal.propertyName,
    currentStage: 0,
    stageStatuses: {},
    overallStatus: 'active',
    lastAnalyzedAt: new Date().toISOString(),
    analysisHistory: [
      {
        timestamp: new Date().toISOString(),
        stage: 0,
        action: 'initialize_metadata',
        result: 'success'
      }
    ]
  };
  
  // Save to file
  await saveDealMetadata(dealPath, metadata);
  
  return metadata;
}

/**
 * Load deal metadata from file
 */
async function loadDealMetadata(dealPath: string): Promise<DealMetadata | null> {
  try {
    const metadataPath = join(dealPath, 'metadata.json');
    await access(metadataPath);
    const data = await readFile(metadataPath, 'utf-8');
    return JSON.parse(data) as DealMetadata;
  } catch (error) {
    return null;
  }
}

/**
 * Save deal metadata to file
 */
async function saveDealMetadata(dealPath: string, metadata: DealMetadata): Promise<void> {
  const metadataPath = join(dealPath, 'metadata.json');
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Map stage decision to metadata status
 */
function mapDecisionToStatus(decision: string): 'pending' | 'approved' | 'rejected' | 'needs-review' {
  switch (decision) {
    case 'ADVANCE': return 'approved';
    case 'REJECT': return 'rejected';
    case 'HOLD': return 'needs-review';
    case 'REQUEST_MORE_INFO': return 'needs-review';
    default: return 'pending';
  }
}

/**
 * Find at which stage a deal was rejected
 */
function findRejectionStage(metadata: DealMetadata): number {
  for (let i = 1; i <= 9; i++) {
    const stageStatus = metadata.stageStatuses[i.toString()];
    if (stageStatus && stageStatus.status === 'rejected') {
      return i;
    }
  }
  return 0;
}

/**
 * Show current progress of deal analysis
 */
function showCurrentProgress(metadata: DealMetadata) {
  console.log('\n📋 Current Progress:');
  
  for (let i = 1; i <= metadata.currentStage; i++) {
    const status = metadata.stageStatuses[i.toString()];
    if (status) {
      const emoji = getStatusEmoji(status.status);
      const date = new Date(status.analyzedAt).toLocaleDateString();
      console.log(`  ${emoji} Stage ${i}: ${getStageName(i)} - ${status.status.toUpperCase()} (${date})`);
      if (status.issues && status.issues.length > 0) {
        console.log(`     Issue: ${status.issues[0]}`);
      }
    }
  }
}

function getStageName(stage: number): string {
  const names: { [key: string]: string } = {
    '1': 'Strategic Qualification & Advantage',
    '2': 'Market Intelligence & Timing', 
    '3': 'Due Diligence & Bias Mitigation',
    '4': 'Financial Underwriting',
    '5': 'Legal & Regulatory Compliance',
    '6': 'Operational Feasibility',
    '7': 'Risk Mitigation Planning',
    '8': 'Portfolio Integration',
    '9': 'Investment Committee Recommendation'
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

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'approved': return '✅';
    case 'rejected': return '❌';
    case 'needs-review': return '⏸️';
    case 'pending': return '⏳';
    default: return '❓';
  }
}

function showUsage() {
  console.log('\n💡 Usage: npm run analyze-to-stage <deal-path> <stage-number> [--force]');
  console.log('\nExamples:');
  console.log('  npm run analyze-to-stage sample-deals/the-frank 1    # Analyze to Strategic Qualification');
  console.log('  npm run analyze-to-stage sample-deals/the-frank 3    # Analyze through Due Diligence');
  console.log('  npm run analyze-to-stage sample-deals/the-frank 9    # Analyze to IC Recommendation');
  console.log('  npm run analyze-to-stage sample-deals/the-frank 4 --force  # Force re-analysis through stage 4');
  console.log('\nStages:');
  console.log('  1 - Strategic Qualification & Advantage');
  console.log('  2 - Market Intelligence & Timing');
  console.log('  3 - Due Diligence & Bias Mitigation');
  console.log('  4 - Financial Underwriting');
  console.log('  5 - Legal & Regulatory Compliance');
  console.log('  6 - Operational Feasibility');
  console.log('  7 - Risk Mitigation Planning');
  console.log('  8 - Portfolio Integration');
  console.log('  9 - Investment Committee Recommendation');
  console.log('\nNote: Run "npm run process-deal <path>" first to parse documents');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeToStage().catch(console.error);
}

export { analyzeToStage };