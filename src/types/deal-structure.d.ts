export interface Deal {
    id: string;
    propertyName?: string;
    address?: string;
    stage: number;
    status: 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'ON_HOLD';
    financials?: FinancialSummary;
    tenants?: TenantData[];
    documents?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface FinancialSummary {
    totalRevenue: number;
    totalExpenses: number;
    netOperatingIncome: number;
    capRate?: number;
    debtServiceCoverage?: number;
    occupancyRate: number;
    monthlyRent: number;
    yearlyRent: number;
}
export interface TenantData {
    unitNumber: string;
    tenantName?: string;
    monthlyRent: number;
    leaseStart?: string;
    leaseEnd?: string;
    securityDeposit?: number;
    occupancyStatus: 'OCCUPIED' | 'VACANT' | 'NOTICE';
}
export interface PropertyDetails {
    propertyType: string;
    yearBuilt?: number;
    totalUnits: number;
    totalSqft?: number;
    lotSize?: number;
    parking?: number;
    amenities?: string[];
}
export interface AnalysisResult {
    stage: number;
    stageName: string;
    decision: 'ADVANCE' | 'REJECT' | 'HOLD' | 'REQUEST_MORE_INFO';
    reasoning: string;
    confidence: number;
    keyFindings: string[];
    risks: string[];
    opportunities: string[];
    recommendations: string[];
    financialMetrics?: Record<string, number>;
    nextSteps?: string[];
}
export interface DealStructure {
    deal: Deal;
    propertyDetails?: PropertyDetails;
    marketData?: any;
    comparables?: any[];
    analysis?: AnalysisResult[];
}
//# sourceMappingURL=deal-structure.d.ts.map