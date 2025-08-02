export interface Deal {
    id: string;
    propertyName: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    basicInfo: {
        totalUnits: number;
        yearBuilt: number;
        propertyType: string;
        askingPrice: number;
        pricePerUnit: number;
    };
    lihtcInfo: {
        currentlyLIHTC: boolean;
        placedInServiceDate: string;
        compliancePeriodEnd: string;
        extendedUseEnd: string;
        amiRestriction: number;
        setAsideRequirement: string;
        currentlyCompliant: boolean;
        violationHistory: string[];
    };
    financialData: {
        annualGrossRent: number;
        netOperatingIncome: number;
        operatingExpenses: number;
        expenseRatio: number;
        occupancyRate: number;
    };
    status: 'incoming' | 'processing' | 'completed' | 'rejected';
    createdAt: string;
    updatedAt: string;
}
export interface AnalysisResult {
    dealId: string;
    stage: string;
    stageName: string;
    analysisType: string;
    timestamp: string;
    recommendation: 'ADVANCE' | 'REJECT' | 'REQUEST_MORE_INFO' | 'REVISIONS_REQUIRED';
    confidence: number;
    keyFindings: string[];
    risks: string[];
    nextSteps: string[];
    pipelineLocation: {
        currentStage: string;
        currentSubstate: string;
        nextStage?: string;
    };
}
/**
 * Pipeline-aware agent that processes deals based on their location in the pipeline
 */
export declare class DealProcessor {
    private readonly specsPath;
    private readonly pipelinePath;
    private readonly templatesPath;
    private readonly stageMapping;
    private readonly stageNames;
    /**
     * Process all pending deals in the pipeline
     */
    processAllPendingDeals(): Promise<void>;
    /**
     * Scan pipeline for deals that need processing
     */
    private scanPipelineForPendingDeals;
    /**
     * Process a deal at a specific pipeline location
     */
    processDealAtLocation(dealInfo: {
        dealPath: string;
        stage: string;
        substate: string;
    }): Promise<void>;
    /**
     * Get specification file for a pipeline stage
     */
    private getSpecificationForStage;
    /**
     * Load deal data from JSON file
     */
    private loadDeal;
    /**
     * Run analysis following a specific specification file
     */
    private runAnalysisSpec;
    /**
     * Load and parse specification file
     */
    private loadSpec;
    /**
     * Analyze deal using specification guidance
     * This is where we would integrate with AI/LLM to follow the spec
     */
    private analyzeUsingSpec;
    /**
     * Simple recommendation logic based on deal characteristics and stage
     */
    private determineRecommendation;
    /**
     * Identify potential risks based on deal data
     */
    private identifyRisks;
    /**
     * Get stage-specific next steps
     */
    private getNextSteps;
    /**
     * Get next pipeline stage
     */
    private getNextStage;
    /**
     * Get stage number from stage name
     */
    private getStageNumber;
    /**
     * Move deal based on analysis result
     */
    private moveDealBasedOnResult;
    /**
     * Save analysis results to deal folder
     */
    private saveAnalysis;
}
//# sourceMappingURL=index.d.ts.map