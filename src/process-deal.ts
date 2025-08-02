#!/usr/bin/env node

import { DealManager } from './deal-manager.js';
import { join } from 'path';

async function processSampleDeal() {
  console.log('🚀 Domos Deal Processing MVP Demo');
  console.log('=====================================\n');
  
  const dealManager = new DealManager();
  
  // Get deal path from command line arguments or use default
  const dealPath = process.argv[2] || join(process.cwd(), 'sample-deals');
  
  try {
    console.log(`Processing deal from: ${dealPath}`);
    
    const dealStructure = await dealManager.processDealFromFolder(dealPath);
    
    console.log('\n📋 Deal Processing Summary:');
    console.log('============================');
    console.log(`Deal ID: ${dealStructure.dealId}`);
    console.log(`Property: ${dealStructure.structuredData.deal.propertyName}`);
    console.log(`Total Units: ${dealStructure.structuredData.deal.basicInfo.totalUnits}`);
    console.log(`Annual Gross Rent: $${dealStructure.structuredData.deal.financialData.annualGrossRent.toLocaleString()}`);
    console.log(`Net Operating Income: $${dealStructure.structuredData.deal.financialData.netOperatingIncome.toLocaleString()}`);
    console.log(`Occupancy Rate: ${dealStructure.structuredData.deal.financialData.occupancyRate.toFixed(1)}%`);
    console.log(`Estimated Price: $${dealStructure.structuredData.deal.basicInfo.askingPrice.toLocaleString()}`);
    console.log(`Price Per Unit: $${dealStructure.structuredData.deal.basicInfo.pricePerUnit.toLocaleString()}`);
    
    if (dealStructure.structuredData.tenants) {
      console.log(`\n🏠 Tenant Summary:`);
      console.log(`- Total Units: ${dealStructure.structuredData.tenants.summary.totalUnits}`);
      console.log(`- Occupied: ${dealStructure.structuredData.tenants.summary.occupiedUnits}`);
      console.log(`- Vacant: ${dealStructure.structuredData.tenants.summary.vacantUnits}`);
      console.log(`- Average Rent: $${dealStructure.structuredData.tenants.summary.averageRent.toFixed(0)}`);
    }
    
    if (dealStructure.structuredData.financialSummary) {
      console.log(`\n💰 Financial Summary (${dealStructure.structuredData.financialSummary.period}):`);
      console.log(`- Total Income: $${dealStructure.structuredData.financialSummary.income.totalIncome.toLocaleString()}`);
      console.log(`- Total Expenses: $${dealStructure.structuredData.financialSummary.expenses.totalExpenses.toLocaleString()}`);
      console.log(`- NOI: $${dealStructure.structuredData.financialSummary.netOperatingIncome.toLocaleString()}`);
      console.log(`- Expense Ratio: ${dealStructure.structuredData.financialSummary.keyMetrics.expenseRatio.toFixed(1)}%`);
    }
    
    console.log(`\n📁 Source Documents Found: ${dealStructure.sourceDocuments.length}`);
    dealStructure.sourceDocuments.forEach(doc => {
      console.log(`  - ${doc.fileName} (${doc.category})`);
    });
    
    console.log('\n✅ Deal processing completed successfully!');
    console.log(`\n📂 Check the following folders in ${dealPath}:`);
    console.log('  - SourceDocuments/ (original files)');
    console.log('  - Structured/ (parsed JSON data)');
    console.log('  - Outputs/ (stage analysis outputs - run demo-stages next)');
    console.log('  - AnalysisJourney/ (audit trail - run demo-stages next)');
    
  } catch (error) {
    console.error('❌ Error processing deal:', error);
    console.log('\n💡 Usage: npm run process-deal [deal-path]');
    console.log('   Example: npm run process-deal sample-deals');
    console.log('   Example: npm run process-deal /path/to/my-deal');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processSampleDeal().catch(console.error);
}

export { processSampleDeal };
