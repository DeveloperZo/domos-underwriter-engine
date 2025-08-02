/**
 * Due Diligence to testMe direct processor
 * 
 * This script directly processes the "Due Diligence" folder to a "testMe" output folder
 * without relying on command-line arguments. It can be run directly with:
 * 
 * node due-diligence-to-testme.js
 */

import { DealManager } from './src/deal-manager.js';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function processDirectly() {
  console.log('🚀 Processing Due Diligence to testMe');
  console.log('=====================================\n');
  
  // Hard-coded parameters for direct processing
  const sourceFolderName = 'Due Diligence';
  const outputFolderName = 'testMe';
  
  // Paths
  const sampleDealsPath = join(process.cwd(), 'sample-deals');
  const sourcePath = join(sampleDealsPath, sourceFolderName);
  const processedDealsPath = join(process.cwd(), 'processed-deals');
  
  console.log(`Source path: ${sourcePath}`);
  console.log(`Output folder name: ${outputFolderName}`);
  
  // Create processed-deals directory if it doesn't exist
  if (!existsSync(processedDealsPath)) {
    console.log(`Creating processed-deals directory...`);
    mkdirSync(processedDealsPath, { recursive: true });
  }
  
  try {
    // Check if sample-deals directory exists
    if (!existsSync(sampleDealsPath)) {
      throw new Error(`Sample deals directory not found: ${sampleDealsPath}`);
    }
    
    // Check if Due Diligence directory exists
    if (!existsSync(sourcePath)) {
      throw new Error(`Due Diligence directory not found: ${sourcePath}`);
    }
    
    // Process the deal
    console.log(`Processing deal...`);
    const dealManager = new DealManager();
    const dealStructure = await dealManager.processDealFromFolder(sourcePath, outputFolderName);
    
    console.log(`\n✅ Deal processed successfully!`);
    console.log(`📂 Results saved to: ${dealStructure.outputPath}`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.stack) {
      console.error(`\nStack trace:\n${error.stack}`);
    }
    process.exit(1);
  }
}

// Run the script
processDirectly().catch(console.error);
