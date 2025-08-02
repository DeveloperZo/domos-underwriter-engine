export interface AuditLogEntry {
    stage: number;
    stageName: string;
    timestamp: string;
    decision: 'ADVANCE' | 'REJECT' | 'HOLD' | 'REQUEST_MORE_INFO';
    reasoning: string;
    keyFindings: string[];
    nextAction: string;
    analyst?: string;
    confidenceScore?: number;
    redFlags?: string[];
    documentation?: string[];
}
export interface AuditLog {
    dealId: string;
    propertyName: string;
    entries: AuditLogEntry[];
    currentStage: number;
    currentStatus: 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'ON_HOLD';
    createdAt: string;
    lastUpdated: string;
}
export interface StageAnalysis {
    stage: number;
    stageName: string;
    dealId: string;
    findings: string[];
    metrics: Record<string, number>;
    risks: string[];
    opportunities: string[];
    recommendations: string[];
    nextSteps: string[];
}
export interface StageDecision {
    recommendation: 'ADVANCE' | 'REJECT' | 'HOLD' | 'REQUEST_MORE_INFO';
    reasoning: string;
    nextAction: string;
    requiredDocuments?: string[];
    conditions?: string[];
}
export interface StageResult {
    analysis: StageAnalysis;
    decision: StageDecision;
    outputPath: string;
    auditEntryId: string;
}
export interface StageSpec {
    stageNumber: number;
    stageName: string;
    description: string;
    objectives: string[];
    requiredInputs: string[];
    decisionCriteria: {
        advanceRequirements: string[];
        rejectConditions: string[];
        holdConditions: string[];
    };
    outputFormat: string;
}
//# sourceMappingURL=audit-types.d.ts.map