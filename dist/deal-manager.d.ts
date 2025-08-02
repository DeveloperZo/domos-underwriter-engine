export interface SourceDocument {
    fileName: string;
    category: string;
    path: string;
    size: number;
    lastModified: string;
}
export interface DealStructure {
    dealId: string;
    structuredData: {
        deal: Deal;
        tenants?: {
            summary: {
                totalUnits: number;
                occupiedUnits: number;
                vacantUnits: number;
                averageRent: number;
            };
            details: Tenant[];
        };
        financialSummary?: {
            period: string;
            income: {
                totalIncome: number;
            };
            expenses: {
                totalExpenses: number;
            };
            netOperatingIncome: number;
            keyMetrics: {
                expenseRatio: number;
            };
        };
    };
    sourceDocuments: SourceDocument[];
    outputPath: string;
}
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
export interface Tenant {
    unitNumber: string;
    leaseStart: string;
    leaseEnd: string;
    monthlyRent: number;
    securityDeposit: number;
    tenantName: string;
    occupancyStatus: 'occupied' | 'vacant' | 'notice';
    unitType: string;
    sqft: number;
    lihtcQualified: boolean;
    amiLevel?: number;
}
export interface FinancialSummary {
    periodStart: string;
    periodEnd: string;
    totalRevenue: number;
    rentalIncome: number;
    commercialIncome: number;
    otherIncome: number;
    totalExpenses: number;
    operatingExpenses: {
        management: number;
        maintenance: number;
        utilities: number;
        insurance: number;
        taxes: number;
        marketing: number;
        administrative: number;
        other: number;
    };
    netOperatingIncome: number;
    debtService: number;
    cashFlow: number;
    occupancyMetrics: {
        totalUnits: number;
        occupiedUnits: number;
        occupancyRate: number;
        avgRentPerUnit: number;
    };
}
export declare class DealManager {
    private readonly outputPath;
    /**
     * Process a deal from a folder containing due diligence documents
     */
    processDealFromFolder(dueDiligencePath: string): Promise<DealStructure>;
    /**
     * Extract deal information from due diligence documents
     */
    private extractDealInfo;
    /**
     * Extract tenant information from rent rolls
     */
    private extractTenantInfo;
    /**
     * Extract financial information from financial statements
     */
    private extractFinancialInfo;
    /**
     * Save all deal data to structured JSON files
     */
    private saveDealData;
    /**
     * Catalog all source documents from the due diligence folder
     */
    private catalogSourceDocuments;
    /**
     * Create initial AnalysisJourney.md file
     */
    private createAnalysisJourney;
}
export default DealManager;
//# sourceMappingURL=deal-manager.d.ts.map