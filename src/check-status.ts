#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { join } from 'path';

interface AuditEntry {
  stage: number;
  stageName: string;
  decision: string;
  reasoning: string;
  timestamp: string;
  keyFindings?: string[];
}

interface AuditLog {
  entries: AuditEntry[];
}

interface DealStatus {
  status: string;
  stage: number;
  lastDecision?: {
    decision: string;
    reasoning: string;
  };
}

class AuditLogger {
  async auditLogExists(dealPath: string): Promise<boolean> {
    try {
      const auditPath = join(dealPath, 'AnalysisJourney', 'auditLog.json');
      await readFile(auditPath, 'utf-8');
      return true;
    } catch {
      return false;
    }
  }

  async loadAuditLog(dealPath: string): Promise<AuditLog | null> {
    try {
      const auditPath = join(dealPath, 'AnalysisJourney', 'auditLog.json');
      const content = await readFile(auditPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  async getCurrentStatus(dealPath: string): Promise<DealStatus | null> {
    const auditLog = await this.loadAuditLog(dealPath);
    if (!auditLog || auditLog.entries.length === 0) {
      return null;
    }

    const lastEntry = auditLog.entries[auditLog.entries.length - 1];
    let status = 'ACTIVE';
    
    if (lastEntry.decision === 'REJECT') {
      status = 'REJECTED';
    } else if (lastEntry.decision === 'HOLD') {
      status = 'ON_HOLD';
    } else if (lastEntry.stage === 6 && lastEntry.decision === 'ADVANCE') {
      status = 'COMPLETED';
    }

    return {
      status,
      stage: lastEntry.stage,
      lastDecision: {
        decision: lastEntry.decision,
        reasoning: lastEntry.reasoning
      }
    };
  }
}

async function checkDealStatus() {
  console.log('📊 Domos Deal Status Check');
  console.log('==========================\n');
  
  const auditLogger = new AuditLogger();
  
  // Get deal path from command line arguments
  const dealPath = process.argv[2];
  
  if (!dealPath) {
    console.error('❌ Error: Deal path is required');
    console.log('\n💡 Usage: npm run status <deal-path>');
    console.log('   Example: npm run status sample-deals');
    process.exit(1);
  }
  
  try {
    console.log(`📁 Deal Path: ${dealPath}`);
    
    // Load deal info
    let dealName = 'Unknown Deal';
    try {
      const dealJsonPath = join(dealPath, 'Structured', 'deal.json');
      const dealData = await readFile(dealJsonPath, 'utf-8');
      const deal = JSON.parse(dealData);
      dealName = deal.propertyName || deal.id;
    } catch {
      // Deal may not be processed yet
    }
    
    console.log(`🏢 Property: ${dealName}\n`);
    
    // Check if audit log exists
    const auditLogExists = await auditLogger.auditLogExists(dealPath);
    
    if (!auditLogExists) {
      console.log('📋 Status: Not Started');
      console.log('└─ No processing history found');
      console.log('\n🚀 Next Steps:');
      console.log(`   1. Parse documents: npm run process-deal ${dealPath}`);
      console.log(`   2. Start processing: npm run analyze-to-stage ${dealPath} 1`);
      return;
    }
    
    // Get current status
    const currentStatus = await auditLogger.getCurrentStatus(dealPath);
    
    if (currentStatus) {
      console.log(`📊 Current Status: ${currentStatus.status}`);
      console.log(`🎯 Current Stage: ${currentStatus.stage} (${getStageName(currentStatus.stage)})`);
      
      if (currentStatus.lastDecision) {
        const emoji = getDecisionEmoji(currentStatus.lastDecision.decision);
        console.log(`${emoji} Last Decision: ${currentStatus.lastDecision.decision}`);
        console.log(`💭 Reasoning: ${currentStatus.lastDecision.reasoning}`);
      }
    }
    
    // Show detailed history
    console.log('\n📋 Processing History:');
    console.log('======================');
    
    const auditLog = await auditLogger.loadAuditLog(dealPath);
    
    if (auditLog && auditLog.entries.length > 0) {
      auditLog.entries.forEach((entry: AuditEntry, index: number) => {
        const emoji = getDecisionEmoji(entry.decision);
        const date = new Date(entry.timestamp).toLocaleDateString();
        const time = new Date(entry.timestamp).toLocaleTimeString();
        
        console.log(`${emoji} Stage ${entry.stage}: ${entry.stageName}`);
        console.log(`   Decision: ${entry.decision} (${date} ${time})`);
        console.log(`   Reasoning: ${entry.reasoning}`);
        
        if (entry.keyFindings && entry.keyFindings.length > 0) {
          console.log(`   Key Findings: ${entry.keyFindings.slice(0, 2).join(', ')}${entry.keyFindings.length > 2 ? '...' : ''}`);
        }
        
        if (index < auditLog.entries.length - 1) {
          console.log('   │');
        }
      });
    } else {
      console.log('No processing history found');
    }
    
    // Show next steps
    if (currentStatus) {
      console.log('\n🔮 Next Steps:');
      console.log('=============');
      
      if (currentStatus.status === 'COMPLETED') {
        console.log('✅ Deal processing completed successfully!');
        console.log(`📁 Check outputs in: ${dealPath}/Outputs/`);
      } else if (currentStatus.status === 'REJECTED') {
        console.log('❌ Deal was rejected and requires manual review');
        console.log('   Consider revising deal terms or documentation');
      } else if (currentStatus.status === 'ON_HOLD') {
        console.log('⏸️  Deal is on hold pending additional information');
        console.log('   Review last decision reasoning for required actions');
      } else if (currentStatus.status === 'ACTIVE') {
        const nextStage = currentStatus.stage + 1;
        if (nextStage <= 6) {
          console.log(`🎯 Continue to Stage ${nextStage}: ${getStageName(nextStage)}`);
          console.log(`   Command: npm run analyze-to-stage ${dealPath} ${nextStage}`);
        }
        console.log(`🏃 Or process all remaining: npm run demo-stages ${dealPath}`);
      }
    }
    
    // Show file locations
    console.log('\n📂 File Locations:');
    console.log('==================');
    console.log(`📄 Structured Data: ${dealPath}/Structured/`);
    console.log(`📋 Stage Reports: ${dealPath}/Outputs/`);
    console.log(`📊 Audit Trail: ${dealPath}/AnalysisJourney/auditLog.json`);
    
  } catch (error) {
    console.error('❌ Error checking deal status:', error);
    process.exit(1);
  }
}

function getStageName(stage: number): string {
  const names: Record<number, string> = {
    1: 'Strategic Qualification',
    2: 'Market Intelligence', 
    3: 'DueDiligence',
    4: 'Financial Underwriting',
    5: 'IC Review',
    6: 'Final Approval'
  };
  return names[stage] || 'Unknown';
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

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDealStatus().catch(console.error);
}

export { checkDealStatus };