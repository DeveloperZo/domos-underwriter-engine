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
    placedInServiceDate?: string;
    compliancePeriodEnd?: string;
    extendedUseEnd?: string;
    amiRestriction?: number;
    setAsideRequirement?: string;
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

export interface TenantData {
  dealId: string;
  units: UnitInfo[];
  summary: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    averageRent: number;
    totalMonthlyRent: number;
  };
}

export interface UnitInfo {
  unitNumber: string;
  unitType: string; // 1BR, 2BR, etc.
  squareFeet?: number;
  currentRent: number;
  marketRent?: number;
  tenantName?: string;
  leaseStart?: string;
  leaseEnd?: string;
  isOccupied: boolean;
  isLIHTC?: boolean;
  amiLevel?: number;
}

export interface FinancialSummary {
  dealId: string;
  period: string; // "T12" or date range
  income: {
    grossRentalIncome: number;
    otherIncome: number;
    totalIncome: number;
  };
  expenses: {
    management: number;
    maintenance: number;
    utilities: number;
    insurance: number;
    taxes: number;
    other: number;
    totalExpenses: number;
  };
  netOperatingIncome: number;
  keyMetrics: {
    expenseRatio: number;
    incomePerUnit: number;
    expensePerUnit: number;
    noiPerUnit: number;
  };
}

export interface SourceDocument {
  fileName: string;
  filePath: string;
  fileType: 'excel' | 'pdf' | 'other';
  size: number;
  lastModified: string;
  category: 'rentRoll' | 'financials' | 'legal' | 'dueDiligence' | 'other';
}

export interface StructuredData {
  deal: Deal;
  tenants?: TenantData;
  financialSummary?: FinancialSummary;
}

export interface DealStructure {
  dealId: string;
  dealPath: string;
  sourceDocuments: SourceDocument[];
  structuredData: StructuredData;
  createdAt: string;
}

export interface ParsedRentRoll {
  units: UnitInfo[];
  summary: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    totalMonthlyRent: number;
    averageRent: number;
  };
}

export interface ParsedFinancials {
  period: string;
  income: Record<string, number>;
  expenses: Record<string, number>;
  netOperatingIncome: number;
}
