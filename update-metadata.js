#!/usr/bin/env node

/**
 * Technical Document Metadata Updater
 * 
 * This script updates the metadata section of technical documentation files
 * to ensure consistency and track document history.
 * 
 * Usage:
 *   node update-metadata.js path/to/document.md --version X.Y --owner "Team Name"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help') {
  console.log(`
Technical Document Metadata Updater

Usage:
  node update-metadata.js <file-path> [options]

Options:
  --version X.Y         Set document version (default: increment minor)
  --owner "Team Name"   Set document owner
  --status STATUS       Set document status (Draft/Active/Deprecated)
  --issues "#123,#456"  Set related issues
  --batch               Process all .md files in technical directory
  --help                Show this help message
  `);
  process.exit(0);
}

// Process a single file
function updateFileMetadata(filePath, options) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has a metadata section
  const metadataRegex = /---\s+\*\*Document Metadata\*\*\s+\*\*Last Updated\*\*: .*?\s+\*\*Document Version\*\*: .*?\s+\*\*Owner\*\*: .*?\s+\*\*Status\*\*: .*?(\s+\*\*Related Issues\*\*: .*?)?(\s+\*\*Fix Commit\*\*: .*?)?(\s*)$/s;
  
  const today = new Date().toISOString().split('T')[0];
  let version = options.version || '1.0';
  let owner = options.owner || 'Engineering Team';
  let status = options.status || 'Active';
  let issues = options.issues || '';
  
  // If metadata exists, update it
  if (metadataRegex.test(content)) {
    console.log(`Updating metadata in ${filePath}`);
    
    // Extract current version if we need to increment it
    if (!options.version) {
      const versionMatch = content.match(/\*\*Document Version\*\*: ([\d\.]+)/);
      if (versionMatch && versionMatch[1]) {
        const parts = versionMatch[1].split('.');
        if (parts.length >= 2) {
          version = `${parts[0]}.${parseInt(parts[1]) + 1}`;
        }
      }
    }
    
    // Extract current values for any unspecified options
    if (!options.owner) {
      const ownerMatch = content.match(/\*\*Owner\*\*: (.*?)(\s+\*\*Status\*\*)/);
      if (ownerMatch && ownerMatch[1]) {
        owner = ownerMatch[1].trim();
      }
    }
    
    if (!options.status) {
      const statusMatch = content.match(/\*\*Status\*\*: (.*?)(\s+\*\*Related Issues\*\*|\s+$)/);
      if (statusMatch && statusMatch[1]) {
        status = statusMatch[1].trim();
      }
    }
    
    if (!options.issues) {
      const issuesMatch = content.match(/\*\*Related Issues\*\*: (.*?)(\s+\*\*Fix Commit\*\*|\s+$)/);
      if (issuesMatch && issuesMatch[1]) {
        issues = issuesMatch[1].trim();
      }
    }
    
    // Create the updated metadata section
    let metadata = `---

**Document Metadata**  
**Last Updated**: ${today}  
**Document Version**: ${version}  
**Owner**: ${owner}  
**Status**: ${status}`;

    if (issues) {
      metadata += `  
**Related Issues**: ${issues}`;
    }
    
    // Check if there's a Fix Commit entry to preserve
    const commitMatch = content.match(/\*\*Fix Commit\*\*: (.*?)(\s+$)/);
    if (commitMatch && commitMatch[1]) {
      metadata += `  
**Fix Commit**: ${commitMatch[1].trim()}`;
    }
    
    // Replace the existing metadata section
    content = content.replace(metadataRegex, metadata + '$3');
  } else {
    // If no metadata exists, add it to the end of the file
    console.log(`Adding metadata section to ${filePath}`);
    
    // Ensure there's a proper ending to the document before adding metadata
    if (!content.endsWith('\n\n')) {
      if (content.endsWith('\n')) {
        content += '\n';
      } else {
        content += '\n\n';
      }
    }
    
    // Create the metadata section
    let metadata = `---

**Document Metadata**  
**Last Updated**: ${today}  
**Document Version**: ${version}  
**Owner**: ${owner}  
**Status**: ${status}`;

    if (issues) {
      metadata += `  
**Related Issues**: ${issues}`;
    }
    
    content += metadata + '\n';
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated metadata for ${path.basename(filePath)}`);
  return true;
}

// Extract options from command line arguments
const options = {};
let filePath = null;
let batchMode = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--batch') {
    batchMode = true;
  } else if (args[i] === '--version' && i + 1 < args.length) {
    options.version = args[++i];
  } else if (args[i] === '--owner' && i + 1 < args.length) {
    options.owner = args[++i];
  } else if (args[i] === '--status' && i + 1 < args.length) {
    options.status = args[++i];
  } else if (args[i] === '--issues' && i + 1 < args.length) {
    options.issues = args[++i];
  } else if (!filePath && !args[i].startsWith('--')) {
    filePath = args[i];
  }
}

if (batchMode) {
  // Process all .md files in the technical directory
  const technicalDir = path.resolve(__dirname);
  const files = fs.readdirSync(technicalDir)
    .filter(file => file.endsWith('.md') && file !== 'TEMPLATE.md' && file !== 'README.md');
  
  let successCount = 0;
  for (const file of files) {
    const fullPath = path.join(technicalDir, file);
    if (updateFileMetadata(fullPath, options)) {
      successCount++;
    }
  }
  
  console.log(`\nCompleted: Updated metadata for ${successCount} of ${files.length} files`);
} else if (filePath) {
  // Process a single file
  updateFileMetadata(filePath, options);
} else {
  console.error('Error: No file specified. Use --batch to process all files or provide a file path.');
  process.exit(1);
}
