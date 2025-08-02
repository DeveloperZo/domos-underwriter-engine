// Audit logging and decision tracking types
export interface AuditLogEntry {
  stage: number;
  stageName: string;
  decision: 'ADVANCE' | 'REJECT' | 'HOLD' | 'REQUEST_MORE_INFO';
  reasoning: string;
  confidence: number;
  timestamp: string;
  keyFindings?: string[];
  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  financialMetrics?: Record<string, number>;
  transparencyData?: TransparencyData;
}

export interface AuditLog {
  dealId: string;
  entries: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface TransparencyData {
  decisionSummary: string;
  inputTrace: string[];
  benchmarkContext: string;
  anomalyFlags: string[];
}

export interface DecisionContext {
  stage: number;
  inputs: Record<string, any>;
  thresholds: Record<string, number>;
  benchmarks: Record<string, number>;
  flags: string[];
}

export interface StageMetrics {
  processingTime: number;
  dataQuality: number;
  confidenceScore: number;
  riskScore: number;
  recommendationCount: number;
}
