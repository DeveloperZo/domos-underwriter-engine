#!/usr/bin/env node
import { DealManager } from './deal-manager.js';
import { StageProcessor } from './stage-processor.js';
import { AuditLogger } from './audit-logger.js';
import { join } from 'path';
async function demonstrateStageProcessing() {
    console.log('🚀 Domos Stage Processing Demo');
    console.log('==============================\\n');
    const dealManager = new DealManager();
    const stageProcessor = new StageProcessor();
    const auditLogger = new AuditLogger();
    const sampleDealPath = process.argv[2] || join(process.cwd(), 'sample-deals');
    try {
        // Step 1: Process deal structure (if not already done)
        console.log('📁 Step 1: Ensuring deal structure is processed...');
        const dealStructure = await dealManager.processDealFromFolder(sampleDealPath);
        console.log(`✅ Deal structure ready: ${dealStructure.structuredData.deal.propertyName}`);
        // Step 2: Process through all 6 stages
        console.log('\\n🔄 Step 2: Processing through all stages...');
        const stageResults = [];
        for (let stage = 1; stage <= 6; stage++) {
            try {
                const result = await stageProcessor.processStage(sampleDealPath, stage);
                stageResults.push(result);
                console.log(`  Stage ${stage}: ${result.decision.recommendation} - ${result.decision.reasoning}`);
                // If rejected or held, stop processing
                if (result.decision.recommendation === 'REJECT') {
                    console.log(`\\n❌ Deal rejected at Stage ${stage}. Processing stopped.`);
                    break;
                }
                else if (result.decision.recommendation === 'HOLD') {
                    console.log(`\\n⏸️  Deal on hold at Stage ${stage}. Manual review required.`);
                    break;
                }
            }
            catch (error) {
                console.error(`❌ Error at Stage ${stage}:`, error);
                break;
            }
        }
        // Step 3: Show audit trail
        console.log('\\n📋 Step 3: Audit Trail Summary');
        console.log('===============================');
        const auditSummary = await auditLogger.generateAuditSummary(sampleDealPath);
        console.log(auditSummary);
        // Step 4: Show current status
        console.log('\\n📊 Step 4: Current Deal Status');
        console.log('===============================');
        const currentStatus = await auditLogger.getCurrentStatus(sampleDealPath);
        if (currentStatus) {
            console.log(`Current Stage: ${currentStatus.stage}`);
            console.log(`Status: ${currentStatus.status}`);
            if (currentStatus.lastDecision) {
                console.log(`Last Decision: ${currentStatus.lastDecision.decision}`);
                console.log(`Last Reasoning: ${currentStatus.lastDecision.reasoning}`);
            }
        }
        // Step 5: Show generated files
        console.log('\\n📂 Step 5: Generated Files');
        console.log('===========================');
        console.log('Check the following directories:');
        console.log(`  📁 ${sampleDealPath}/Outputs/`);
        console.log('    - Stage01_StrategicQualification.md');
        console.log('    - Stage02_MarketIntelligence.md');
        console.log('    - Stage03_DueDiligence.md');
        console.log('    - Stage04_FinancialUnderwriting.md');
        console.log('    - Stage05_ICReview.md');
        console.log('    - Stage06_FinalApproval.md');
        console.log('');
        console.log(`  📁 ${sampleDealPath}/AnalysisJourney/`);
        console.log('    - auditLog.json (complete decision trail)');
        console.log('\\n✅ Stage processing demonstration completed!');
    }
    catch (error) {
        console.error('❌ Error in stage processing demo:', error);
        console.log('\n💡 Usage: npm run demo-stages [deal-path]');
        console.log('   Example: npm run demo-stages sample-deals');
        console.log('   Example: npm run demo-stages /path/to/my-deal');
        console.log('\n📝 Note: Run "npm run process-deal [path]" first to parse documents');
        process.exit(1);
    }
}
// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateStageProcessing().catch(console.error);
}
export { demonstrateStageProcessing };
//# sourceMappingURL=demo-stages.js.map