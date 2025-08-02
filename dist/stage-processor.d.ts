import { StageResult } from './types/audit-types';
export declare class StageProcessor {
    private auditLogger;
    constructor();
    /**
     * Process a deal through a specific stage
     */
    processStage(dealPath: string, stageNumber: number): Promise<StageResult>;
    /**
     * Load structured deal data
     */
    private loadStructuredDeal;
    /**
     * Load tenant data if available
     */
    private loadTenantData;
    /**
     * Load financial summary if available
     */
    private loadFinancialSummary;
    /**
     * Get stage specification (simplified for MVP)
     */
    private getStageSpec;
    /**
     * Analyze deal at specific stage
     */
    private analyzeStage;
    /**
     * Make decision based on analysis and stage criteria
     */
    private makeStageDecision;
    /**
     * Save stage output to markdown file
     */
    private saveStageOutput;
    /**
     * Log decision to audit trail
     */
    private logToAuditTrail;
    private loadStageSpecification;
}
//# sourceMappingURL=stage-processor.d.ts.map