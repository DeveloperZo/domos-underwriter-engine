#!/usr/bin/env node

import { DealManager } from './deal-manager.js';
import { join } from 'path';
import { existsSync } from 'fs';

// Directly specify the paths for testing
const inputPath = join(process.cwd(), 'sample-deals', 'DueDiligence');
const outputFolderName = 'testMe';

console.log('=== Debug Process Deal ===');
console.log('Current directory:', process.cwd());
console.log('Input path:', inputPath);
console.log('Output folder name:', outputFolderName);
console.log('Input path exists:', existsSync(inputPath));

async function runTest() {
  try {
    const dealManager = new DealManager();
    console.log('DealManager initialized');
    
    console.log('Processing deal from:', inputPath);
    const dealStructure = await dealManager.processDealFromFolder(inputPath, outputFolderName);
    
    console.log('Deal processed successfully!');
    console.log('Output path:', dealStructure.outputPath);
    console.log('Deal ID:', dealStructure.dealId);
  } catch (error) {
    console.error('Error processing deal:', error);
  }
}

runTest().catch(console.error);
