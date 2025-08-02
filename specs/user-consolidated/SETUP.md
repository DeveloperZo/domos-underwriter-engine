# Setup Guide

## Purpose
This guide provides instructions for installing and configuring the Domos Underwriter Engine for LIHTC preservation deal analysis.

## Quick Start

### Prerequisites
- Node.js 18.0 or higher
- 4GB+ available disk space
- Windows, macOS, or Linux environment

### Installation Steps
```bash
# 1. Navigate to project directory
cd C:/Repos/domos-underwriter-engine

# 2. Install dependencies
npm install

# 3. Build the system
npm run build

# 4. Test installation
npm run demo-mcp
```

### Verify Installation
A successful installation will show:
```
🚀 Starting Domos MCP Server Demo
📋 Available MCP Tools:
  • processDeal: Process a deal from DueDiligence folder
  • analyzeStage: Load deal data and stage specification
  • completeAnalysis: Complete analysis and update audit trail
  • moveDeal: Move deal through pipeline folders
✅ Demo completed successfully!
```

## System Requirements

### Hardware
- **CPU**: Modern multi-core processor (Intel i5/AMD Ryzen 5 or better)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space (more for large deal volumes)

### Software
- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **Operating System**: Windows 10+, macOS 10.15+, or modern Linux
- **Optional**: Excel for viewing financial data, PDF reader for documents

## Directory Structure

After installation, your directory structure will include:

```
domos-underwriter-engine/
├── dist/                  # Compiled JavaScript
├── pipeline/              # Deal workflow stages
│   ├── A-initial-intake/
│   ├── B-preliminary-analysis/
│   └── [other stages]
├── processed-deals/       # Structured deal output
├── sample-deals/          # Test data
├── specs/                 # Analysis specifications
├── src/                   # Source code
└── package.json           # Project configuration
```

## Testing Your Installation

### Process Sample Deal
```bash
# Process the included sample deal
npm run mcp-process "sample-deals/DueDiligence"

# Expected output: Success message with deal path
```

### Run Complete Demo
```bash
# Test the complete workflow
npm run demo-mcp

# Expected output: Demonstration of all processing steps
```

## Troubleshooting Installation

### Common Issues

**"npm install" Fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules/` and `package-lock.json`, then retry
- Check Node.js version: `node --version`

**"npm run build" Fails**
- Verify TypeScript installation: `npx tsc --version`
- Check for syntax errors in source files
- Try: `npm install typescript@latest`

**File Operation Errors**
- Check file permissions on the project directory
- Ensure no files are open in other applications
- Verify sufficient disk space

### Installation Verification Checklist
- [ ] Node.js 18+ installed and working
- [ ] npm install completed without errors
- [ ] npm run build completed successfully
- [ ] dist/ folder contains compiled JavaScript files
- [ ] npm run demo-mcp runs successfully

## Updates and Maintenance

### Getting Updates
```bash
# Pull latest changes (if using Git)
git pull origin main

# Reinstall dependencies and rebuild
npm install
npm run build
```

### Backup Strategy
- **Critical data**: `processed-deals/` and `pipeline/` directories
- **Configuration**: `specs/` directory customizations
- **Frequency**: Daily for active use, weekly minimum

## Multi-User Setup

### Shared Installation
1. Install on shared server or network location
2. Set up access permissions for team members
3. Configure backup strategy for shared data
4. Establish naming conventions for deals

### Individual Installations
1. Each user installs locally following this guide
2. Share configurations via version control
3. Synchronize specifications across installations

## Next Steps

Once installation is successful:
1. Process a sample deal using `processDeal`
2. Review the User Guide for workflow details
3. Customize stage specifications as needed
4. Begin analyzing real deals

## Related Resources
- [User Guide](./USER_GUIDE.md) - Complete usage instructions
- [Quick Reference](./QUICK_REFERENCE.md) - Command summary

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Engineering Team  
**Status**: Active
