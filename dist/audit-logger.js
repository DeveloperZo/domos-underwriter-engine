import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
export class AuditLogger {
    /**
     * Initialize audit log for a new deal
     */
    async initializeAuditLog(dealPath, deal) {
        const auditLog = {
            dealId: deal.id,
            propertyName: deal.propertyName,
            entries: [],
            currentStage: 1,
            currentStatus: 'ACTIVE',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        await this.saveAuditLog(dealPath, auditLog);
        console.log(`📋 Initialized audit log for ${deal.propertyName}`);
        return auditLog;
    }
    /**
     * Load existing audit log
     */
    async loadAuditLog(dealPath) {
        try {
            const auditLogPath = join(dealPath, 'AnalysisJourney', 'auditLog.json');
            const data = await readFile(auditLogPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.warn(`Could not load audit log: ${error}`);
            return null;
        }
    }
    /**
     * Add new entry to audit log
     */
    async logStageDecision(dealPath, entry) {
        const auditLog = await this.loadAuditLog(dealPath);
        if (!auditLog) {
            throw new Error('Audit log not found. Initialize first.');
        }
        const fullEntry = {
            ...entry,
            timestamp: new Date().toISOString()
        };
        auditLog.entries.push(fullEntry);
        auditLog.currentStage = entry.stage;
        auditLog.lastUpdated = new Date().toISOString();
        // Update status based on decision
        if (entry.decision === 'REJECT') {
            auditLog.currentStatus = 'REJECTED';
        }
        else if (entry.decision === 'HOLD') {
            auditLog.currentStatus = 'ON_HOLD';
        }
        else if (entry.stage >= 6 && entry.decision === 'ADVANCE') {
            auditLog.currentStatus = 'COMPLETED';
        }
        await this.saveAuditLog(dealPath, auditLog);
        const entryId = `${auditLog.dealId}_stage${entry.stage}_${Date.now()}`;
        console.log(`📝 Logged stage ${entry.stage} decision: ${entry.decision}`);
        return entryId;
    }
    /**
     * Get current deal status from audit log
     */
    async getCurrentStatus(dealPath) {
        const auditLog = await this.loadAuditLog(dealPath);
        if (!auditLog)
            return null;
        const lastEntry = auditLog.entries[auditLog.entries.length - 1];
        return {
            stage: auditLog.currentStage,
            status: auditLog.currentStatus,
            lastDecision: lastEntry
        };
    }
    /**
     * Generate audit trail summary
     */
    async generateAuditSummary(dealPath) {
        const auditLog = await this.loadAuditLog(dealPath);
        if (!auditLog)
            return 'No audit log found';
        let summary = `# Audit Trail Summary\\n\\n`;
        summary += `**Deal**: ${auditLog.propertyName} (${auditLog.dealId})\\n`;
        summary += `**Status**: ${auditLog.currentStatus}\\n`;
        summary += `**Current Stage**: ${auditLog.currentStage}\\n`;
        summary += `**Started**: ${new Date(auditLog.createdAt).toLocaleDateString()}\\n\\n`;
        summary += `## Stage History\\n\\n`;
        auditLog.entries.forEach((entry, index) => {
            summary += `### ${entry.stageName} (Stage ${entry.stage})\\n`;
            summary += `- **Decision**: ${entry.decision}\\n`;
            summary += `- **Date**: ${new Date(entry.timestamp).toLocaleDateString()}\\n`;
            summary += `- **Reasoning**: ${entry.reasoning}\\n`;
            if (entry.keyFindings.length > 0) {
                summary += `- **Key Findings**:\\n${entry.keyFindings.map(f => `  - ${f}`).join('\\n')}\\n`;
            }
            summary += `\\n`;
        });
        return summary;
    }
    /**
     * Save audit log to file
     */
    async saveAuditLog(dealPath, auditLog) {
        const auditLogPath = join(dealPath, 'AnalysisJourney', 'auditLog.json');
        await writeFile(auditLogPath, JSON.stringify(auditLog, null, 2));
    }
    /**
     * Check if audit log exists
     */
    async auditLogExists(dealPath) {
        try {
            const auditLogPath = join(dealPath, 'AnalysisJourney', 'auditLog.json');
            await access(auditLogPath);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=audit-logger.js.map