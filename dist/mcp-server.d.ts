#!/usr/bin/env node
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
}
export interface MCPResponse {
    content: Array<{
        type: 'text';
        text: string;
    }>;
}
/**
 * Simplified MCP Tools for Domos Underwriter Engine
 *
 * This provides exactly 4 tools to enable a clean human-in-the-loop workflow:
 * 1. processDeal - Creates structured files from due diligence
 * 2. analyzeStage - Loads deal + spec for human analysis
 * 3. updateAnalysisJourney - Appends analysis to journey
 * 4. moveDeal - Moves deal through pipeline stages
 */
export declare class DomosMCPServer {
    private readonly specsPath;
    private readonly processedDealsPath;
    private readonly pipelinePath;
    private readonly stageSpecs;
    private readonly stageNames;
    /**
     * Tool 1: Process Deal - Creates structured files from due diligence folder
     */
    processDeal(dueDiligencePath: string): Promise<MCPResponse>;
    /**
     * Tool 2: Analyze Stage - Loads deal data and stage specification, performs analysis, and updates journey
     */
    analyzeStage(dealPath: string, stage: string, analysis?: string): Promise<MCPResponse>;
    /**
     * Internal method to update analysis journey (not exposed as MCP tool)
     */
    private updateAnalysisJourneyInternal;
    /**
     * Tool 3: Complete Analysis - Performs analysis and updates journey automatically
     */
    completeAnalysis(dealPath: string, stage: string, analysis: string): Promise<MCPResponse>;
    /**
     * Tool 4: Move Deal - Moves deal through pipeline folders based on decision
     */
    moveDeal(dealPath: string, fromStage: string, toStage: string, decision: string): Promise<MCPResponse>;
    /**
     * Helper: Copy deal folder recursively
     */
    private copyDealFolder;
    /**
     * List available tools for MCP discovery
     */
    getTools(): MCPTool[];
    /**
     * Handle MCP tool calls
     */
    handleToolCall(toolName: string, args: any): Promise<MCPResponse>;
}
export default DomosMCPServer;
//# sourceMappingURL=mcp-server.d.ts.map