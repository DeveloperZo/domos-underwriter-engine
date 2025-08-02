export interface StageAnalysis {
    dealId: string;
    stage: string;
    stageName: string;
    timestamp: string;
    recommendation: 'ADVANCE' | 'REJECT' | 'REQUEST_MORE_INFO' | 'REVISIONS_REQUIRED';
    confidence: number;
    reasoning: string;
    keyFindings: string[];
    redFlags: string[];
    nextSteps: string[];
    specUsed: string;
    analysisData: any;
}
export declare class SpecsEngine {
    private readonly specsPath;
    private readonly stageToSpecMapping;
    private readonly stageNames;
    /**
     * Apply specification analysis to deal based on pipeline stage
     */
    analyzeWithSpec(stage: string, dealData: any, tenantData: any[], financialData: any): Promise<StageAnalysis>;
    /**
     * Get spec file for pipeline stage (MVP: Simple mapping)
     */
    private getSpecFileForStage;
    /**
     * Load specification markdown file
     */
    private loadSpecification;
    /**
     * Run analysis for specific stage (MVP: Rule-based decisions)
     */
    private runStageAnalysis;
    /**
     * Stage 1: Initial Intake Analysis (MVP implementation)
     */
    private analyzeInitialIntake;
    /**
     * Stage 2: Preliminary Analysis (Simplified for MVP)
     */
    private analyzePreliminary;
    /**
     * Stage 3: Full Underwriting (Simplified for MVP)
     */
    private analyzeFullUnderwriting;
    /**
     * Generic analysis for other stages (MVP placeholder)
     */
    private analyzeGeneric;
}
export default SpecsEngine;
//# sourceMappingURL=specs-engine.d.ts.map