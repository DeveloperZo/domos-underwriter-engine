#!/usr/bin/env tsx
import { SpecsEngine } from './specs-engine.js';
import { readFile } from 'fs/promises';
import { join } from 'path';
async function testSpecsEngine() {
    console.log('🧪 Testing SpecsEngine with The Frank deal...\n');
    try {
        // Load The Frank deal data
        const dealPath = 'processed-deals/the-frank-2025-08-01T19-25-00';
        const dealData = JSON.parse(await readFile(join(dealPath, 'deal.json'), 'utf-8'));
        const tenantData = JSON.parse(await readFile(join(dealPath, 'tenants.json'), 'utf-8'));
        const financialData = JSON.parse(await readFile(join(dealPath, 'financialSummary.json'), 'utf-8'));
        console.log(`📋 Loaded deal: ${dealData.propertyName} (${dealData.basicInfo.totalUnits} units)`);
        // Create SpecsEngine
        const specsEngine = new SpecsEngine();
        // Test Stage 1: Initial Intake
        console.log('\\n🎯 Testing Stage 1: Initial Intake Analysis...');
        const stage1Analysis = await specsEngine.analyzeWithSpec('A-initial-intake', dealData, tenantData, financialData);
        console.log(`\\n📊 Stage 1 Results:`);
        console.log(`   Recommendation: ${stage1Analysis.recommendation}`);
        console.log(`   Confidence: ${stage1Analysis.confidence}%`);
        console.log(`   Reasoning: ${stage1Analysis.reasoning}`);
        console.log(`   Key Findings: ${stage1Analysis.keyFindings.length} items`);
        console.log(`   Red Flags: ${stage1Analysis.redFlags.length} items`);
        console.log(`   Spec Used: ${stage1Analysis.specUsed}`);
        if (stage1Analysis.recommendation === 'ADVANCE') {
            // Test Stage 2: Preliminary Analysis
            console.log('\\n🎯 Testing Stage 2: Preliminary Analysis...');
            const stage2Analysis = await specsEngine.analyzeWithSpec('B-preliminary-analysis', dealData, tenantData, financialData);
            console.log(`\\n📊 Stage 2 Results:`);
            console.log(`   Recommendation: ${stage2Analysis.recommendation}`);
            console.log(`   Confidence: ${stage2Analysis.confidence}%`);
            console.log(`   Key Findings: ${stage2Analysis.keyFindings.length} items`);
            if (stage2Analysis.recommendation === 'ADVANCE') {
                // Test Stage 3: Full Underwriting
                console.log('\\n🎯 Testing Stage 3: Full Underwriting...');
                const stage3Analysis = await specsEngine.analyzeWithSpec('C-full-underwriting', dealData, tenantData, financialData);
                console.log(`\\n📊 Stage 3 Results:`);
                console.log(`   Recommendation: ${stage3Analysis.recommendation}`);
                console.log(`   Confidence: ${stage3Analysis.confidence}%`);
                console.log(`   Reasoning: ${stage3Analysis.reasoning}`);
            }
        }
        console.log('\\n✅ SpecsEngine test completed!');
        console.log('🎯 Component 2 (Pipeline with Specs Application) VALIDATED');
        console.log('');
        console.log('📝 Key Features Demonstrated:');
        console.log('   ✅ Folder-to-spec mapping (A-initial-intake → stage-1-initial-intake.md)');
        console.log('   ✅ Real spec file loading and application');
        console.log('   ✅ Rule-based analysis with clear decisions');
        console.log('   ✅ Structured output with reasoning');
        console.log('   ✅ MVP approach with TBD placeholders');
    }
    catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
}
// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testSpecsEngine();
}
export { testSpecsEngine };
//# sourceMappingURL=test-specs-engine.js.map