// Debug script for the process-deal command
// This script adds additional logging to understand the execution flow

import { DealManager } from './src/deal-manager.js';
import { join, basename } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

async function debugProcessDeal() {
  console.log('🔍 Domos Process-Deal Debug Tool');
  console.log('===============================\n');
  
  console.log('Environment:');
  console.log(`- Current working directory: ${process.cwd()}`);
  console.log(`- Node version: ${process.version}`);
  console.log(`- Arguments: ${process.argv.join(', ')}`);
  
  // Get source folder name (first parameter)
  const sourceFolderName = process.argv[2];
  console.log(`\nSource folder parameter: "${sourceFolderName}"`);
  
  // Get output folder name (second parameter, optional)
  const outputFolderName = process.argv[3];
  console.log(`Output folder parameter: "${outputFolderName}"`);
  
  // Construct the sample-deals path using source folder name or default to entire sample-deals directory
  const sampleDealsPath = join(process.cwd(), 'sample-deals');
  const sourcePath = sourceFolderName ? join(sampleDealsPath, sourceFolderName) : sampleDealsPath;
  
  console.log(`\nPath Analysis:`);
  console.log(`- Sample deals path: ${sampleDealsPath}`);
  console.log(`- Source path: ${sourcePath}`);
  console.log(`- Source path exists: ${existsSync(sourcePath)}`);
  
  // Check sample-deals directory
  if (existsSync(sampleDealsPath)) {
    console.log(`\nContents of sample-deals directory:`);
    try {
      const entries = readdirSync(sampleDealsPath);
      for (const entry of entries) {
        const entryPath = join(sampleDealsPath, entry);
        const stats = statSync(entryPath);
        console.log(`- ${entry} (${stats.isDirectory() ? 'Directory' : 'File'})`);
      }
    } catch (error) {
      console.error(`Error reading sample-deals directory: ${error.message}`);
    }
  } else {
    console.error(`❌ sample-deals directory not found`);
  }
  
  // Check processed-deals directory
  const processedDealsPath = join(process.cwd(), 'processed-deals');
  console.log(`\nProcessed deals path: ${processedDealsPath}`);
  console.log(`Processed deals path exists: ${existsSync(processedDealsPath)}`);
  
  if (existsSync(processedDealsPath)) {
    console.log(`\nContents of processed-deals directory:`);
    try {
      const entries = readdirSync(processedDealsPath);
      for (const entry of entries) {
        const entryPath = join(processedDealsPath, entry);
        const stats = statSync(entryPath);
        console.log(`- ${entry} (${stats.isDirectory() ? 'Directory' : 'File'})`);
      }
    } catch (error) {
      console.error(`Error reading processed-deals directory: ${error.message}`);
    }
  }
  
  if (!existsSync(sourcePath)) {
    console.error(`\n❌ Error: Source path does not exist: ${sourcePath}`);
    console.log(`\nWhat to try next:`);
    console.log(`- Make sure the directory structure matches what the script expects`);
    console.log(`- Check if the source folder name parameter matches a folder in sample-deals`);
    console.log(`- Try removing quotes from command parameters`);
    console.log(`\nCommand examples:`);
    console.log(`- npm run process-deal "DueDiligence" "testMe"`);
    console.log(`- npm run process-deal Due\\ Diligence testMe`);
    return;
  }
  
  // Continue with the deal processing if source path exists
  console.log(`\n✅ Source path exists, now attempting to process the deal...`);
  
  try {
    const dealManager = new DealManager();
    const dealStructure = await dealManager.processDealFromFolder(sourcePath, outputFolderName);
    
    console.log(`\n✅ Deal processed successfully!`);
    console.log(`- Deal ID: ${dealStructure.dealId}`);
    console.log(`- Output path: ${dealStructure.outputPath}`);
  } catch (error) {
    console.error(`\n❌ Error processing deal:`, error);
  }
}

// Run the debug script
debugProcessDeal().catch(console.error);
