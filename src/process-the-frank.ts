#!/usr/bin/env tsx

import { DealManager } from './deal-manager.js';
import { join } from 'path';

async function processTheFrankDeal() {
  console.log('🚀 Processing The Frank Deal...\n');
  
  const dealManager = new DealManager();
  
  // Path to The Frank DueDiligence documents
  const dueDiligencePath = join(process.cwd(), 'sample-deals', 'DueDiligence');
  
  try {
    const outputPath = await dealManager.processDealFromFolder(dueDiligencePath);
    
    console.log('\n✅ Deal processing completed successfully!');
    console.log(`📁 Output location: ${outputPath}`);
    console.log('\n📋 Generated files:');
    console.log('   - deal.json (structured deal information)');
    console.log('   - tenants.json (tenant and lease data)');
    console.log('   - financialSummary.json (financial analysis)');
    console.log('   - AnalysisJourney.md (human-readable analysis log)');
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Review generated structured data');
    console.log('   2. Move deal to pipeline Stage 1 (Initial Intake)');
    console.log('   3. Run specs-based analysis');
    
  } catch (error) {
    console.error('\n❌ Deal processing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processTheFrankDeal();
}

export { processTheFrankDeal };
