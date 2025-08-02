#!/usr/bin/env node
import { readFile, readdir, writeFile, mkdir, copyFile } from 'fs/promises';
import { join, basename } from 'path';
import { DealManager } from './deal-manager.js';
/**
 * Simplified MCP Tools for Domos Underwriter Engine
 *
 * This provides exactly 4 tools to enable a clean human-in-the-loop workflow:
 * 1. processDeal - Creates structured files from due diligence
 * 2. analyzeStage - Loads deal + spec for human analysis
 * 3. updateAnalysisJourney - Appends analysis to journey
 * 4. moveDeal - Moves deal through pipeline stages
 */
export class DomosMCPServer {
    specsPath = './specs';
    processedDealsPath = './processed-deals';
    pipelinePath = './pipeline';
    // Stage mapping for specs
    stageSpecs = {
        'A-initial-intake': 'stage-1-initial-intake.md',
        'B-preliminary-analysis': 'stage-2-preliminary-analysis.md',
        'C-full-underwriting': 'stage-3-full-underwriting.md',
        'D-ic-review': 'ic-recommendation.md',
        'E-loi-psa': 'stage-5-legal-transaction.md',
        'F-final-approval': 'stage-6-final-approval.md',
        'G-closing': 'stage-7-closing.md'
    };
    stageNames = {
        'A-initial-intake': 'Initial Intake',
        'B-preliminary-analysis': 'Preliminary Analysis',
        'C-full-underwriting': 'Full Underwriting',
        'D-ic-review': 'IC Review',
        'E-loi-psa': 'LOI/PSA',
        'F-final-approval': 'Final Approval',
        'G-closing': 'Closing'
    };
    /**
     * Tool 1: Process Deal - Creates structured files from due diligence folder
     */
    async processDeal(dueDiligencePath) {
        try {
            console.log(`🔄 [MCP] Processing deal from: ${dueDiligencePath}`);
            const dealManager = new DealManager();
            const dealOutputPath = await dealManager.processDealFromFolder(dueDiligencePath);
            // Get deal info for response
            const dealJsonPath = join(dealOutputPath, 'deal.json');
            const dealData = JSON.parse(await readFile(dealJsonPath, 'utf-8'));
            const response = {
                content: [{
                        type: 'text',
                        text: `✅ **Deal Processed Successfully**

**Deal:** ${dealData.propertyName}
**Deal ID:** ${dealData.id}
**Output Path:** ${dealOutputPath}

**Files Created:**
- 📄 deal.json (structured deal data)
- 👥 tenants.json (tenant/rent roll data)  
- 💰 financialSummary.json (T12 financial data)
- 📝 AnalysisJourney.md (analysis tracking)

**Property Summary:**
- **Units:** ${dealData.basicInfo.totalUnits}
- **Type:** ${dealData.basicInfo.propertyType}
- **Year Built:** ${dealData.basicInfo.yearBuilt}
- **LIHTC Status:** ${dealData.lihtcInfo.currentlyLIHTC ? 'Active' : 'Preservation Opportunity'}

**Next Step:** Call \`analyzeStage(dealPath, "A-initial-intake")\` to begin analysis.`
                    }]
            };
            return response;
        }
        catch (error) {
            console.error('[MCP] processDeal error:', error);
            return {
                content: [{
                        type: 'text',
                        text: `❌ **Error Processing Deal**

Error: ${error instanceof Error ? error.message : String(error)}

Please check the due diligence path and try again.`
                    }]
            };
        }
    }
    /**
     * Tool 2: Analyze Stage - Loads deal data and stage specification, performs analysis, and updates journey
     */
    async analyzeStage(dealPath, stage, analysis) {
        try {
            console.log(`🔍 [MCP] Loading stage analysis: ${stage} for deal at ${dealPath}`);
            // Load deal data
            const dealJsonPath = join(dealPath, 'deal.json');
            const dealData = JSON.parse(await readFile(dealJsonPath, 'utf-8'));
            // Load stage specification
            const specFile = this.stageSpecs[stage];
            if (!specFile) {
                throw new Error(`No specification found for stage: ${stage}`);
            }
            const specPath = join(this.specsPath, specFile);
            const specContent = await readFile(specPath, 'utf-8');
            // Load current analysis journey for context
            const journeyPath = join(dealPath, 'AnalysisJourney.md');
            let journeyContent = '';
            try {
                journeyContent = await readFile(journeyPath, 'utf-8');
            }
            catch {
                journeyContent = '(No analysis journey found)';
            }
            const stageName = this.stageNames[stage] || stage;
            // If analysis is provided, update the journey automatically
            if (analysis) {
                await this.updateAnalysisJourneyInternal(dealPath, analysis);
            }
            const response = {
                content: [{
                        type: 'text',
                        text: `📋 **Stage ${stageName} Analysis Ready**

## Deal Information
**Property:** ${dealData.propertyName}
**Deal ID:** ${dealData.id}
**Path:** ${dealPath}

## Current Deal Data
\`\`\`json
${JSON.stringify(dealData, null, 2)}
\`\`\`

## Stage Specification
**File:** ${specFile}

${specContent}

## Current Analysis Journey
${journeyContent}

---

${analysis ?
                            `✅ **Analysis Completed and Recorded**\n\n${analysis}\n\n**Next Step:** Call \`moveDeal()\` to advance based on this analysis.` :
                            `**Ready for Analysis:** This deal is loaded and ready for your assessment against the stage specification above.`}`
                    }]
            };
            return response;
        }
        catch (error) {
            console.error('[MCP] analyzeStage error:', error);
            return {
                content: [{
                        type: 'text',
                        text: `❌ **Error Loading Stage Analysis**

Error: ${error instanceof Error ? error.message : String(error)}

Available stages: ${Object.keys(this.stageSpecs).join(', ')}`
                    }]
            };
        }
    }
    /**
     * Internal method to update analysis journey (not exposed as MCP tool)
     */
    async updateAnalysisJourneyInternal(dealPath, stageAnalysis) {
        const journeyPath = join(dealPath, 'AnalysisJourney.md');
        // Read current journey
        let currentJourney = '';
        try {
            currentJourney = await readFile(journeyPath, 'utf-8');
        }
        catch {
            // File doesn't exist, start fresh
            currentJourney = `# Analysis Journey\n\n**Deal Path:** ${dealPath}  \n**Started:** ${new Date().toISOString()}\n\n---\n\n`;
        }
        // Append new analysis with timestamp
        const timestamp = new Date().toISOString();
        const analysisEntry = `\n## Claude Analysis Entry - ${timestamp}\n\n${stageAnalysis}\n\n---\n`;
        const updatedJourney = currentJourney + analysisEntry;
        // Save updated journey
        await writeFile(journeyPath, updatedJourney);
    }
    /**
     * Tool 3: Complete Analysis - Performs analysis and updates journey automatically
     */
    async completeAnalysis(dealPath, stage, analysis) {
        try {
            console.log(`📝 [MCP] Updating analysis journey for deal at: ${dealPath}`);
            const journeyPath = join(dealPath, 'AnalysisJourney.md');
            // Read current journey
            let currentJourney = '';
            try {
                currentJourney = await readFile(journeyPath, 'utf-8');
            }
            catch {
                // File doesn't exist, start fresh
                currentJourney = `# Analysis Journey\n\n**Deal Path:** ${dealPath}  \n**Started:** ${new Date().toISOString()}\n\n---\n\n`;
            }
            // Append new analysis with timestamp
            // Update the analysis journey
            await this.updateAnalysisJourneyInternal(dealPath, analysis);
            const timestamp = new Date().toISOString();
            const response = {
                content: [{
                        type: 'text',
                        text: `✅ **Analysis Completed and Recorded**

**Timestamp:** ${timestamp}
**Stage:** ${stage}
**Path:** ${dealPath}

**Analysis Recorded:**
${analysis}

**Next Step:** Call \`moveDeal()\` to advance the deal based on this analysis.`
                    }]
            };
            return response;
        }
        catch (error) {
            console.error('[MCP] updateAnalysisJourney error:', error);
            return {
                content: [{
                        type: 'text',
                        text: `❌ **Error Updating Analysis Journey**

Error: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    }
    /**
     * Tool 4: Move Deal - Moves deal through pipeline folders based on decision
     */
    async moveDeal(dealPath, fromStage, toStage, decision) {
        try {
            console.log(`📦 [MCP] Moving deal from ${fromStage} to ${toStage} with decision: ${decision}`);
            // Extract deal folder name
            const dealFolderName = basename(dealPath);
            // Determine target substate based on decision
            let targetSubstate;
            switch (decision.toLowerCase()) {
                case 'advance':
                    targetSubstate = 'not-started';
                    break;
                case 'reject':
                    targetSubstate = 'rejected';
                    break;
                case 'request_more_info':
                case 'revisions_required':
                    targetSubstate = 'in-progress';
                    break;
                default:
                    targetSubstate = 'not-started';
            }
            // Create pipeline structure if needed
            const targetStagePath = join(this.pipelinePath, toStage);
            const targetSubstatePath = join(targetStagePath, targetSubstate);
            const targetDealPath = join(targetSubstatePath, dealFolderName);
            await mkdir(targetSubstatePath, { recursive: true });
            // Copy deal folder to new location
            await this.copyDealFolder(dealPath, targetDealPath);
            // Update deal.json status
            const dealJsonPath = join(targetDealPath, 'deal.json');
            const dealData = JSON.parse(await readFile(dealJsonPath, 'utf-8'));
            dealData.status = decision.toLowerCase() === 'reject' ? 'rejected' : 'processing';
            dealData.updatedAt = new Date().toISOString();
            await writeFile(dealJsonPath, JSON.stringify(dealData, null, 2));
            // Add move entry to analysis journey
            const journeyPath = join(targetDealPath, 'AnalysisJourney.md');
            const moveEntry = `\n## Pipeline Move - ${new Date().toISOString()}\n\n**From:** ${fromStage} → **To:** ${toStage}  \n**Decision:** ${decision}  \n**Substate:** ${targetSubstate}  \n**New Path:** ${targetDealPath}\n\n---\n`;
            try {
                const currentJourney = await readFile(journeyPath, 'utf-8');
                await writeFile(journeyPath, currentJourney + moveEntry);
            }
            catch {
                // Create new journey if it doesn't exist
                await writeFile(journeyPath, `# Analysis Journey\n\n${moveEntry}`);
            }
            const stageName = this.stageNames[toStage] || toStage;
            const response = {
                content: [{
                        type: 'text',
                        text: `✅ **Deal Moved Successfully**

**From:** ${fromStage} → **To:** ${toStage} (${stageName})
**Decision:** ${decision}
**Substate:** ${targetSubstate}
**New Path:** ${targetDealPath}

**Status:** ${decision.toLowerCase() === 'reject' ? 'Rejected' : 'Processing'}

${decision.toLowerCase() === 'advance' ?
                            `**Next Step:** Call \`analyzeStage("${targetDealPath}", "${toStage}")\` to continue analysis.` :
                            decision.toLowerCase() === 'reject' ?
                                `**Result:** Deal has been rejected and moved to ${toStage}/rejected.` :
                                `**Next Step:** Address the feedback and continue with \`analyzeStage("${targetDealPath}", "${toStage}")\`.`}`
                    }]
            };
            return response;
        }
        catch (error) {
            console.error('[MCP] moveDeal error:', error);
            return {
                content: [{
                        type: 'text',
                        text: `❌ **Error Moving Deal**

Error: ${error instanceof Error ? error.message : String(error)}

Check that the stage names are valid and the deal path exists.`
                    }]
            };
        }
    }
    /**
     * Helper: Copy deal folder recursively
     */
    async copyDealFolder(sourcePath, targetPath) {
        await mkdir(targetPath, { recursive: true });
        const items = await readdir(sourcePath);
        for (const item of items) {
            const sourceItem = join(sourcePath, item);
            const targetItem = join(targetPath, item);
            const stats = await readFile(sourceItem).then(() => 'file').catch(() => 'dir');
            if (stats === 'file') {
                await copyFile(sourceItem, targetItem);
            }
            // For directories, we'd need recursive copy, but for MVP we'll just copy files
        }
    }
    /**
     * List available tools for MCP discovery
     */
    getTools() {
        return [
            {
                name: 'processDeal',
                description: 'Process a deal from due diligence folder, creating structured files in processed-deals/',
                inputSchema: {
                    type: 'object',
                    properties: {
                        dueDiligencePath: {
                            type: 'string',
                            description: 'Path to folder containing due diligence documents'
                        }
                    },
                    required: ['dueDiligencePath']
                }
            },
            {
                name: 'analyzeStage',
                description: 'Load deal data and stage specification for analysis (optionally complete analysis)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        dealPath: {
                            type: 'string',
                            description: 'Path to processed deal folder'
                        },
                        stage: {
                            type: 'string',
                            description: 'Pipeline stage to analyze (A-initial-intake, B-preliminary-analysis, C-full-underwriting, D-ic-review, E-loi-psa, F-final-approval, G-closing)'
                        },
                        analysis: {
                            type: 'string',
                            description: 'Optional: Claude analysis to record in audit trail'
                        }
                    },
                    required: ['dealPath', 'stage']
                }
            },
            {
                name: 'completeAnalysis',
                description: 'Complete analysis for a stage and automatically update audit trail',
                inputSchema: {
                    type: 'object',
                    properties: {
                        dealPath: {
                            type: 'string',
                            description: 'Path to deal folder'
                        },
                        stage: {
                            type: 'string',
                            description: 'Pipeline stage being analyzed'
                        },
                        analysis: {
                            type: 'string',
                            description: 'Claude analysis and assessment to record'
                        }
                    },
                    required: ['dealPath', 'stage', 'analysis']
                }
            },
            {
                name: 'moveDeal',
                description: 'Move deal through pipeline folders based on analysis decision',
                inputSchema: {
                    type: 'object',
                    properties: {
                        dealPath: {
                            type: 'string',
                            description: 'Current path to deal folder'
                        },
                        fromStage: {
                            type: 'string',
                            description: 'Current stage (A-initial-intake, B-preliminary-analysis, etc.)'
                        },
                        toStage: {
                            type: 'string',
                            description: 'Target stage to move to'
                        },
                        decision: {
                            type: 'string',
                            description: 'Analysis decision (ADVANCE, REJECT, REQUEST_MORE_INFO, REVISIONS_REQUIRED)'
                        }
                    },
                    required: ['dealPath', 'fromStage', 'toStage', 'decision']
                }
            }
        ];
    }
    /**
     * Handle MCP tool calls
     */
    async handleToolCall(toolName, args) {
        switch (toolName) {
            case 'processDeal':
                return await this.processDeal(args.dueDiligencePath);
            case 'analyzeStage':
                return await this.analyzeStage(args.dealPath, args.stage, args.analysis);
            case 'completeAnalysis':
                return await this.completeAnalysis(args.dealPath, args.stage, args.analysis);
            case 'moveDeal':
                return await this.moveDeal(args.dealPath, args.fromStage, args.toStage, args.decision);
            default:
                return {
                    content: [{
                            type: 'text',
                            text: `❌ Unknown tool: ${toolName}. Available tools: ${this.getTools().map(t => t.name).join(', ')}`
                        }]
                };
        }
    }
}
// CLI interface for testing
if (process.argv[2]) {
    const server = new DomosMCPServer();
    const command = process.argv[2];
    const args = process.argv.slice(3);
    switch (command) {
        case 'processDeal':
            if (args[0]) {
                server.processDeal(args[0]).then(result => {
                    console.log(result.content[0].text);
                }).catch(console.error);
            }
            else {
                console.log('Usage: node dist/mcp-server.js processDeal <dueDiligencePath>');
            }
            break;
        case 'analyzeStage':
            if (args[0] && args[1]) {
                server.analyzeStage(args[0], args[1]).then(result => {
                    console.log(result.content[0].text);
                }).catch(console.error);
            }
            else {
                console.log('Usage: node dist/mcp-server.js analyzeStage <dealPath> <stage>');
            }
            break;
        case 'tools':
            console.log('Available MCP Tools:');
            server.getTools().forEach(tool => {
                console.log(`- ${tool.name}: ${tool.description}`);
            });
            break;
        default:
            console.log('Domos MCP Server Commands:');
            console.log('  processDeal <path>     - Process deal from due diligence');
            console.log('  analyzeStage <path> <stage> - Load deal and spec for analysis');
            console.log('  tools                  - List available MCP tools');
    }
}
export default DomosMCPServer;
//# sourceMappingURL=mcp-server.js.map