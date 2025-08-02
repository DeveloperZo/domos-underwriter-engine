import { AuditLog, AuditLogEntry } from './types/audit-types';
import { Deal } from './types/deal-structure';
export declare class AuditLogger {
    /**
     * Initialize audit log for a new deal
     */
    initializeAuditLog(dealPath: string, deal: Deal): Promise<AuditLog>;
    /**
     * Load existing audit log
     */
    loadAuditLog(dealPath: string): Promise<AuditLog | null>;
    /**
     * Add new entry to audit log
     */
    logStageDecision(dealPath: string, entry: Omit<AuditLogEntry, 'timestamp'>): Promise<string>;
    /**
     * Get current deal status from audit log
     */
    getCurrentStatus(dealPath: string): Promise<{
        stage: number;
        status: string;
        lastDecision?: AuditLogEntry;
    } | null>;
    /**
     * Generate audit trail summary
     */
    generateAuditSummary(dealPath: string): Promise<string>;
    /**
     * Save audit log to file
     */
    private saveAuditLog;
    /**
     * Check if audit log exists
     */
    auditLogExists(dealPath: string): Promise<boolean>;
}
//# sourceMappingURL=audit-logger.d.ts.map