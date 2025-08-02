# Domos AI Investment Committee - Setup & Installation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- 4GB+ available disk space
- Claude with MCP tools enabled
- Windows, macOS, or Linux environment

### Installation (5 minutes)
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

### First Deal (10 minutes)
```bash
# Process the sample deal
npm run mcp-process "sample-deals/DueDiligence"

# Follow the output path and begin analysis
# Use the path shown in the results for next steps
```

---

## 📋 System Requirements

### Hardware Requirements
- **CPU**: Modern multi-core processor (Intel i5/AMD Ryzen 5 or better)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space (more for large deal volumes)
- **Network**: Internet connection for initial setup

### Software Requirements
- **Node.js**: Version 18.0 or higher ([Download here](https://nodejs.org/))
- **Operating System**: Windows 10+, macOS 10.15+, or modern Linux
- **Text Editor**: VS Code, Notepad++, or similar for file viewing
- **MCP Client**: Claude with MCP tools enabled

### Optional Components
- **Git**: For version control and updates
- **Excel**: For viewing/editing financial data files
- **PDF Reader**: For reviewing source documents

---

## 🔧 Detailed Installation

### Step 1: Node.js Installation
1. **Download** Node.js from https://nodejs.org/
2. **Install** using the default options
3. **Verify** installation:
   ```bash
   node --version  # Should show v18.0.0 or higher
   npm --version   # Should show package manager version
   ```

### Step 2: Project Setup
1. **Navigate** to the project directory:
   ```bash
   cd C:/Repos/domos-underwriter-engine
   ```

2. **Install** dependencies:
   ```bash
   npm install
   ```
   This will download and install all required packages.

3. **Build** the system:
   ```bash
   npm run build
   ```
   This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 3: Verify Installation
1. **Run** the demo:
   ```bash
   npm run demo-mcp
   ```

2. **Expected output**:
   ```
   🚀 Starting Domos MCP Server Demo
   
   📋 Available MCP Tools:
     • processDeal: Process a deal from DueDiligence folder
     • analyzeStage: Load deal data and stage specification
     • completeAnalysis: Complete analysis and update audit trail
     • moveDeal: Move deal through pipeline folders
   
   🔄 Step 1: Processing sample deal...
   ✅ Deal Processed Successfully
   [... additional output ...]
   ✅ Demo completed successfully!
   ```

3. **If errors occur**, check the troubleshooting section below.

### Step 4: MCP Integration
1. **Configure Claude MCP** to point to this directory
2. **Test tool discovery**:
   ```bash
   npm run mcp-tools
   ```
3. **Verify** Claude can call the 4 MCP tools

---

## 📁 Directory Structure

After installation, your directory structure should look like:

```
domos-underwriter-engine/
├── dist/                    # Compiled JavaScript (auto-generated)
│   ├── mcp-server.js       # Main MCP server
│   ├── deal-manager.js     # Deal processing logic
│   └── [other compiled files]
├── node_modules/           # Dependencies (auto-generated)
├── pipeline/               # Deal workflow stages
│   ├── A-initial-intake/
│   │   ├── not-started/
│   │   ├── in-progress/
│   │   ├── completed/
│   │   └── rejected/
│   ├── B-preliminary-analysis/
│   └── [other stages]
├── processed-deals/        # Structured deal output
├── sample-deals/          # Test data
│   └── DueDiligence/
├── specs/                 # Analysis specifications
│   ├── stage_01/
│   ├── stage_02/
│   ├── user/             # User documentation
│   └── [other specs]
├── src/                  # Source TypeScript files
├── package.json          # Project configuration
└── README.md            # Project overview
```

---

## ⚙️ Configuration

### Environment Setup
The system works out-of-the-box with default settings. For customization:

1. **Stage Specifications**: Modify files in `specs/stage_*/`
2. **Pipeline Structure**: Customize folders in `pipeline/`
3. **Analysis Templates**: Update templates in `specs/templates/`

### File Permissions
Ensure the system can read/write to:
- `processed-deals/` - For deal output
- `pipeline/` - For workflow management
- `specs/` - For specification updates

### Storage Configuration
- **Default location**: All data stored locally in project directory
- **Custom paths**: Modify paths in configuration files if needed
- **Backup location**: Set up regular backups of `processed-deals/` and `pipeline/`

---

## 🧪 Testing Installation

### Basic Functionality Test
```bash
# Test MCP server
npm run mcp-tools

# Expected output: List of 4 available tools
```

### Sample Deal Processing Test
```bash
# Process sample deal
npm run mcp-process "sample-deals/DueDiligence"

# Expected output: Success message with deal path
```

### End-to-End Workflow Test
```bash
# Run complete demo
npm run demo-mcp

# Expected output: Complete workflow demonstration
```

### Individual Component Tests
```bash
# Test deal parsing
npm run test-parsing

# Test specs engine
npm run test-specs

# Check system status
npm run status
```

---

## 🔧 Troubleshooting Installation

### Common Issues

#### "npm install" fails
**Symptoms**: Error messages during dependency installation
**Solutions**:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules/` and `package-lock.json`, then retry
3. Check Node.js version: `node --version`
4. Try with elevated permissions (Windows: Run as Administrator)

#### "npm run build" fails
**Symptoms**: TypeScript compilation errors
**Solutions**:
1. Verify TypeScript installation: `npx tsc --version`
2. Check for syntax errors in source files
3. Ensure all dependencies installed correctly
4. Try: `npm install typescript@latest`

#### Demo fails with file errors
**Symptoms**: Cannot read/write files during demo
**Solutions**:
1. Check file permissions on project directory
2. Ensure no files are open in other applications
3. Verify sufficient disk space
4. Check antivirus software isn't blocking file operations

#### MCP tools not discovered
**Symptoms**: Claude can't find the 4 MCP tools
**Solutions**:
1. Verify `npm run build` completed successfully
2. Check that `dist/mcp-server.js` exists
3. Confirm MCP configuration points to correct directory
4. Test tools manually: `node dist/mcp-server.js tools`

### Installation Verification Checklist
- [ ] Node.js 18+ installed and working
- [ ] npm install completed without errors
- [ ] npm run build completed successfully
- [ ] dist/ folder contains compiled JavaScript files
- [ ] npm run demo-mcp runs successfully
- [ ] npm run mcp-tools shows 4 available tools
- [ ] Sample deal processing works
- [ ] All directory permissions correct

---

## 🔄 Updates and Maintenance

### Getting Updates
```bash
# Pull latest changes (if using Git)
git pull origin main

# Reinstall dependencies
npm install

# Rebuild system
npm run build
```

### Regular Maintenance
- **Weekly**: Clear old processed deals if needed
- **Monthly**: Update stage specifications as requirements evolve
- **Quarterly**: Review and optimize performance

### Backup Strategy
1. **Critical data**: `processed-deals/` and `pipeline/` directories
2. **Configuration**: `specs/` directory customizations
3. **Frequency**: Daily for active use, weekly minimum
4. **Tools**: File system backup or cloud sync

---

## 🌐 Multi-User Setup

### Shared Installation
For team environments:

1. **Install on shared server** or network location
2. **Set up access permissions** for team members
3. **Configure backup strategy** for shared data
4. **Establish naming conventions** for deals and analysis

### Individual Installations
For distributed teams:

1. **Each user installs locally** following this guide
2. **Share configurations** via version control
3. **Synchronize specifications** across installations
4. **Coordinate deal assignments** to avoid conflicts

---

## 📞 Getting Help

### Self-Service Resources
1. **User Guide**: `specs/user/USER_GUIDE.md`
2. **Troubleshooting**: `specs/user/TROUBLESHOOTING.md`
3. **FAQ**: `specs/user/FAQ.md`
4. **Quick Reference**: `specs/user/QUICK_REFERENCE.md`

### Technical Support
If installation issues persist:

1. **Gather information**:
   - Operating system and version
   - Node.js version
   - Complete error messages
   - Steps that lead to the error

2. **Check logs**:
   - npm debug logs
   - System error messages
   - File permission issues

3. **Contact support** with detailed information

### Community Resources
- Check documentation for common solutions
- Review sample configurations and setups
- Share solutions with team members

---

## ✅ Installation Complete

Once installation is successful, you're ready to:

1. **Process your first real deal** using `processDeal`
2. **Customize stage specifications** for your investment criteria
3. **Train team members** on the workflow
4. **Integrate with existing processes** and tools

**Next Steps**: Review the User Guide and try processing a sample deal to familiarize yourself with the workflow.

**🎯 Success Indicator**: You should be able to process the sample deal and see structured output files created in `processed-deals/` with a complete audit trail in `AnalysisJourney.md`.
