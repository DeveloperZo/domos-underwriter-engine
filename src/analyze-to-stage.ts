#!/usr/bin/env node

import { DealManager } from './deal-manager';
import { StageProcessor } from './stage-processor';
import { AuditLogger } from './audit-logger';
import { DealPipeline } from './deal-pipeline';
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
      status: 'in-progress' | 'completed' | 'rejected' | 'not-started';
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
  const dealPipeline = new DealPipeline();
  
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

    // Step 3: Check pipeline status
    console.log('\n🔍 Step 3: Checking pipeline status...');
    let pipelineStatus = null;
    
    try {
      // Attempt to find deal in pipeline using deal ID
      const dealId = dealStructure.structuredData.deal.id;
      pipelineStatus = await dealPipeline.getDealPipelineStatus(dealId);
      
      if (pipelineStatus) {
        console.log(`✅ Deal found in pipeline: ${pipelineStatus.stage}/${pipelineStatus.substate}`);
      } else {
        console.log(`ℹ️ Deal not found in pipeline yet. Will be added during processing.`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not determine pipeline status: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Step 4: Check current deal status and determine if analysis should proceed
    console.log('\n🔍 Step 4: Checking deal status...');
    
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
    
    // Step 5: Load audit log for stage processing
    console.log('\n📈 Step 5: Checking audit log...');
    let auditLog = await auditLogger.loadAuditLog(dealPath);
    if (!auditLog) {
      console.log('🆕 No audit log found. Initializing new audit log...');
      // Create a compatible deal object for the audit logger
      const auditDeal = {
        ...dealStructure.structuredData.deal,
        _meta: {
          stage: 'initial-intake' as const,
          createdAt: dealStructure.structuredData.deal._meta.createdAt,
          updatedAt: dealStructure.structuredData.deal._meta.updatedAt,
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
    
    // Step 6: Process stages
    console.log(`\n🔄 Step 6: Processing stages up to ${targetStage}...`);
    
    // Determine starting stage (continue from current stage unless forced)
    const startStage = force ? 1 : Math.max(1, metadata.currentStage + 1);
    console.log(`Starting from stage ${startStage}`);
    
    let stagesPrepared = 0;
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
        
        // Move deal to appropriate pipeline stage for analysis
        try {
          if (!pipelineStatus) {
            // If deal not in pipeline yet, move it from processed-deals to initial intake
            console.log(`📦 Moving deal to pipeline for stage ${stage} analysis...`);
            const newPath = await dealPipeline.moveDealToPipeline(dealPath, 'A-initial-intake', 'in-progress');
            // Update pipeline status
            pipelineStatus = await dealPipeline.getDealPipelineStatus(dealStructure.structuredData.deal.id);
            if (pipelineStatus) {
              console.log(`📂 Deal moved to ${pipelineStatus.stage}/${pipelineStatus.substate} for analysis`);
            }
          } else {
            // Deal is in pipeline, use startStageAnalysis to move to correct stage
            const newPath = await dealPipeline.startStageAnalysis(pipelineStatus.path, stage);
            // Update pipeline status
            pipelineStatus = await dealPipeline.getDealPipelineStatus(dealStructure.structuredData.deal.id);
            if (pipelineStatus) {
              console.log(`📂 Deal moved to ${pipelineStatus.stage}/${pipelineStatus.substate} for analysis`);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Pipeline update warning: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Prepare deal for agent analysis (no automatic processing)
        console.log(`📋 Deal prepared for Stage ${stage} analysis`);
        console.log(`🤖 Waiting for agent to analyze using stage_${stage.toString().padStart(2, '0')} specification`);
        
        // Update metadata to show stage is ready for analysis
        metadata.stageStatuses[stage.toString()] = {
          status: 'not-started',
          analyzedAt: new Date().toISOString(),
          issues: undefined
        };
        
        // Update deal.json to ensure _meta structure exists
        try {
          const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
          const deal = JSON.parse(dealData);
          
          // Ensure _meta structure exists
          if (!deal._meta) {
            deal._meta = {
              stage: 'initial-intake',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              currentStage: stage,
              stageStatuses: {},
              flags: {},
              lastAnalyzedAt: new Date().toISOString()
            };
          }
          
          // Ensure flags object exists
          if (!deal._meta.flags) {
            deal._meta.flags = {};
          }
          
          // Update current stage
          deal._meta.currentStage = stage;
          deal._meta.updatedAt = new Date().toISOString();
          
          // Save updated deal.json
          await writeFile(join(dealPath, 'deal.json'), JSON.stringify(deal, null, 2));
          console.log(`✅ Updated deal.json with stage ${stage} preparation`);
        } catch (error) {
          console.warn(`⚠️ Could not update deal.json: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        metadata.currentStage = stage;
        metadata.lastAnalyzedAt = new Date().toISOString();
        
        // Add to analysis history that stage is ready
        metadata.analysisHistory.push({
          timestamp: new Date().toISOString(),
          stage: stage,
          action: 'stage_prepared',
          result: 'ready_for_agent_analysis'
        });
        
        // Save updated metadata
        await saveDealMetadata(dealPath, metadata);
        
        console.log(`  📍 Stage ${stage} prepared and ready for agent analysis`);
        console.log(`     Use MCP tools to analyze this stage with an AI agent`);
        
        // Since we're not doing automatic analysis, we stop here
        // The agent will need to use MCP tools to complete the analysis
        stagesPrepared++;
        break;
        
      } catch (error) {
        console.error(`❌ Error at Stage ${stage}:`, error);
        
        // Record error in metadata
        metadata.stageStatuses[stage.toString()] = {
          status: 'in-progress',
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
    
    // Step 7: Show final status
    console.log('\n📊 Step 7: Final Status');
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
    
    // Step 8: Show preparation status
    console.log('\n📂 Step 8: Preparation Status');
    console.log('==============================');
    
    if (stagesPrepared > 0) {
      console.log('Stages prepared for agent analysis:');
      console.log(`  📍 Stage ${metadata.currentStage}: ${getStageName(metadata.currentStage)} - Ready for analysis`);
      console.log(`  📋 Use MCP tools to analyze with stage_${metadata.currentStage.toString().padStart(2, '0')} specification`);
    } else {
      console.log('No new stages were prepared. Deal may already be at the target stage.');
    }
    
    console.log(`\n📁 Check: ${dealPath}/Outputs/ for all stage reports`);
    console.log(`📁 Check: ${dealPath}/auditLog.json for audit trail`);
    console.log(`📁 Check: ${dealPath}/metadata.json for deal metadata`);
    
    // Show pipeline location
    if (pipelineStatus) {
      console.log(`\n📁 Current pipeline location: ${pipelineStatus.stage}/${pipelineStatus.substate}`);
    }
    
    // Step 9: Show next steps for agent analysis
    if (metadata.overallStatus === 'active' && metadata.currentStage < 9) {
      console.log('\n🔮 Next Steps - Agent Analysis Required');
      console.log('=======================================');
      console.log(`🤖 Stage ${metadata.currentStage}: ${getStageName(metadata.currentStage)}`);
      console.log(`📋 Specification: specs/stage_${metadata.currentStage.toString().padStart(2, '0')}/`);
      console.log(`🎯 Agent should analyze using the stage specification and complete the analysis`);
    } else if (metadata.overallStatus === 'approved') {
      console.log('\n🎉 Deal Approved');
      console.log('================');
      console.log('All stages have been successfully completed and the deal is approved.');
    } else if (metadata.overallStatus === 'rejected') {
      console.log('\n❌ Deal Rejected');
      console.log('================');
      console.log(`The deal was rejected at stage ${metadata.currentStage}.`);
      console.log('Use "--force" flag to override and continue analysis if needed.');
    } else if (metadata.overallStatus === 'on-hold') {
      console.log('\n⏸️  Deal On Hold');
      console.log('================');
      console.log(`The deal is on hold at stage ${metadata.currentStage} and requires manual review.`);
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
function mapDecisionToStatus(decision: string): 'in-progress' | 'completed' | 'rejected' | 'not-started' {
  switch (decision) {
    case 'ADVANCE': return 'completed';
    case 'REJECT': return 'rejected';
    case 'HOLD': return 'in-progress';
    case 'REQUEST_MORE_INFO': return 'in-progress';
    default: return 'not-started';
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
if (process.argv[1] && process.argv[1].endsWith('analyze-to-stage.ts')) {
  analyzeToStage().catch(console.error);
}

export { analyzeToStage };