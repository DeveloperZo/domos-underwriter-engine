#!/usr/bin/env node

import { DealManager } from './deal-manager';
import { join, basename } from 'path';
import { existsSync } from 'fs';

async function processSampleDeal() {
  console.log('🚀 Domos Deal Processing MVP Demo');
  console.log('=====================================\n');
  
  const dealManager = new DealManager();
  
  // Get source folder name (first parameter)
  const sourceFolderName = process.argv[2];
  
  // Get output folder name (second parameter, optional)
  const outputFolderName = process.argv[3];
  
  // Construct the sample-deals path using source folder name or default to entire sample-deals directory
  const sampleDealsPath = join(process.cwd(), 'sample-deals');
  const sourcePath = sourceFolderName ? join(sampleDealsPath, sourceFolderName) : sampleDealsPath;
  
  try {
    console.log(`Processing deal from: ${sourcePath}`);
    
    // Process the deal
    const dealStructure = await dealManager.processDealFromFolder(sourcePath, outputFolderName);
    
    console.log('\n📋 Deal Processing Summary:');
    console.log('============================');
    console.log(`Deal ID: ${dealStructure.dealId}`);
    console.log(`Property: ${dealStructure.structuredData.deal.propertyName}`);
    console.log(`Total Units: ${dealStructure.structuredData.deal.basicInfo.totalUnits}`);
    console.log(`Annual Gross Rent: ${dealStructure.structuredData.deal.financialData.annualGrossRent.toLocaleString()}`);
    console.log(`Net Operating Income: ${dealStructure.structuredData.deal.financialData.netOperatingIncome.toLocaleString()}`);
    console.log(`Occupancy Rate: ${dealStructure.structuredData.deal.financialData.occupancyRate.toFixed(1)}%`);
    console.log(`Estimated Price: ${dealStructure.structuredData.deal.basicInfo.askingPrice.toLocaleString()}`);
    console.log(`Price Per Unit: ${dealStructure.structuredData.deal.basicInfo.pricePerUnit.toLocaleString()}`);
    
    if (dealStructure.structuredData.tenants) {
      console.log(`\n🏠 Tenant Summary:`);
      console.log(`- Total Units: ${dealStructure.structuredData.tenants.summary.totalUnits}`);
      console.log(`- Occupied: ${dealStructure.structuredData.tenants.summary.occupiedUnits}`);
      console.log(`- Vacant: ${dealStructure.structuredData.tenants.summary.vacantUnits}`);
      console.log(`- Average Rent: ${dealStructure.structuredData.tenants.summary.averageRent.toFixed(0)}`);
    }
    
    if (dealStructure.structuredData.financialSummary) {
      console.log(`\n💰 Financial Summary (${dealStructure.structuredData.financialSummary.period}):`);
      console.log(`- Total Income: ${dealStructure.structuredData.financialSummary.income.totalIncome.toLocaleString()}`);
      console.log(`- Total Expenses: ${dealStructure.structuredData.financialSummary.expenses.totalExpenses.toLocaleString()}`);
      console.log(`- NOI: ${dealStructure.structuredData.financialSummary.netOperatingIncome.toLocaleString()}`);
      console.log(`- Expense Ratio: ${dealStructure.structuredData.financialSummary.keyMetrics.expenseRatio.toFixed(1)}%`);
    }
    
    console.log(`\n📁 Source Documents Found: ${dealStructure.sourceDocuments.length}`);
    dealStructure.sourceDocuments.forEach(doc => {
      console.log(`  - ${doc.fileName} (${doc.category})`);
    });
    
    console.log('\n✅ Deal processing completed successfully!');
    console.log(`\n📂 Results saved to: ${dealStructure.outputPath}`);
    
  } catch (error) {
    console.error('❌ Error processing deal:', error);
    console.log('\n💡 Usage: npm run process-deal [source-folder] [output-folder-name]');
    console.log('   Example: npm run process-deal "DueDiligence"');
    console.log('   Example: npm run process-deal "DueDiligence" "testMe"');
    process.exit(1);
  }
}

// Run the function when script is executed
processSampleDeal().catch(console.error);

export { processSampleDeal };
