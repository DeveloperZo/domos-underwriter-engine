import { readFile } from 'fs/promises';
import { join } from 'path';
export class SpecsEngine {
    specsPath = './specs';
    // Simple mapping from pipeline folder to spec file
    stageToSpecMapping = {
        'A-initial-intake': 'stage-1-initial-intake.md',
        'B-preliminary-analysis': 'stage-2-preliminary-analysis.md',
        'C-full-underwriting': 'stage-3-full-underwriting.md',
        'D-ic-review': 'ic-recommendation.md',
        'E-loi-psa': 'stage-5-legal-transaction.md',
        'F-final-approval': 'stage-6-final-approval.md',
        'G-closing': 'stage-7-closing.md'
    };
    stageNames = {
        'A-initial-intake': 'Initial Intake',
        'B-preliminary-analysis': 'Preliminary Analysis',
        'C-full-underwriting': 'Full Underwriting',
        'D-ic-review': 'IC Review',
        'E-loi-psa': 'LOI/PSA',
        'F-final-approval': 'Final Approval',
        'G-closing': 'Closing'
    };
    /**
     * Apply specification analysis to deal based on pipeline stage
     */
    async analyzeWithSpec(stage, dealData, tenantData, financialData) {
        console.log(`🔍 SpecsEngine analyzing ${dealData.propertyName} at stage: ${stage}`);
        // Get the spec file for this stage
        const specFile = this.getSpecFileForStage(stage);
        if (!specFile) {
            throw new Error(`No specification found for stage: ${stage}`);
        }
        console.log(`📋 Using specification: ${specFile}`);
        // Load the specification
        const spec = await this.loadSpecification(specFile);
        // Run analysis based on stage
        const analysis = await this.runStageAnalysis(stage, spec, dealData, tenantData, financialData);
        console.log(`✅ Analysis complete: ${analysis.recommendation}`);
        return analysis;
    }
    /**
     * Get spec file for pipeline stage (MVP: Simple mapping)
     */
    getSpecFileForStage(stage) {
        return this.stageToSpecMapping[stage] || null;
    }
    /**
     * Load specification markdown file
     */
    async loadSpecification(specFile) {
        const specPath = join(this.specsPath, specFile);
        return await readFile(specPath, 'utf-8');
    }
    /**
     * Run analysis for specific stage (MVP: Rule-based decisions)
     */
    async runStageAnalysis(stage, spec, dealData, tenantData, financialData) {
        // Extract key info for analysis
        const property = dealData.propertyName;
        const units = dealData.basicInfo.totalUnits;
        const isLIHTC = dealData.lihtcInfo.currentlyLIHTC;
        const pricePerUnit = dealData.basicInfo.pricePerUnit;
        let analysis;
        // Stage-specific analysis logic (MVP: Simple rules)
        switch (stage) {
            case 'A-initial-intake':
                analysis = this.analyzeInitialIntake(dealData, tenantData, financialData, spec);
                break;
            case 'B-preliminary-analysis':
                analysis = this.analyzePreliminary(dealData, tenantData, financialData, spec);
                break;
            case 'C-full-underwriting':
                analysis = this.analyzeFullUnderwriting(dealData, tenantData, financialData, spec);
                break;
            default:
                // Default analysis for other stages
                analysis = this.analyzeGeneric(stage, dealData, tenantData, financialData, spec);
                break;
        }
        return analysis;
    }
    /**
     * Stage 1: Initial Intake Analysis (MVP implementation)
     */
    analyzeInitialIntake(dealData, tenantData, financialData, spec) {
        console.log(`📊 Running Stage 1: Initial Intake analysis...`);
        const keyFindings = [];
        const redFlags = [];
        let recommendation = 'ADVANCE';
        // Basic screening criteria from spec
        // 1. Asset Class Check
        if (dealData.basicInfo.totalUnits >= 5) { // Simplified for MVP
            keyFindings.push(`Property has ${dealData.basicInfo.totalUnits} units (meets minimum threshold)`);
        }
        else {
            redFlags.push(`Property only has ${dealData.basicInfo.totalUnits} units (below 5-unit minimum)`);
            recommendation = 'REJECT';
        }
        // 2. LIHTC/Mission Alignment Check
        if (!dealData.lihtcInfo.currentlyLIHTC) {
            keyFindings.push('Preservation opportunity: Convert to LIHTC');
        }
        else {
            keyFindings.push('Current LIHTC property: Preserve affordability');
        }
        // 3. Price per Unit Check (if available)
        if (dealData.basicInfo.pricePerUnit > 0) {
            if (dealData.basicInfo.pricePerUnit > 200000) {
                redFlags.push(`Price per unit $${dealData.basicInfo.pricePerUnit.toLocaleString()} exceeds $200k threshold`);
                recommendation = 'REJECT';
            }
            else if (dealData.basicInfo.pricePerUnit < 30000) {
                redFlags.push(`Price per unit $${dealData.basicInfo.pricePerUnit.toLocaleString()} below $30k minimum`);
                recommendation = 'REJECT';
            }
            else {
                keyFindings.push(`Price per unit $${dealData.basicInfo.pricePerUnit.toLocaleString()} within acceptable range`);
            }
        }
        else {
            keyFindings.push('Price per unit TBD - need asking price');
        }
        // 4. Data Completeness Check
        const dataGaps = [];
        if (dealData.address.street.includes('TBD'))
            dataGaps.push('Property address');
        if (dealData.basicInfo.askingPrice === 0)
            dataGaps.push('Asking price');
        if (financialData.totalRevenue === 0)
            dataGaps.push('Financial data');
        if (dataGaps.length > 2) {
            recommendation = 'REQUEST_MORE_INFO';
            redFlags.push(`Multiple data gaps: ${dataGaps.join(', ')}`);
        }
        else if (dataGaps.length > 0) {
            keyFindings.push(`Minor data gaps: ${dataGaps.join(', ')}`);
        }
        // Determine final recommendation
        let reasoning = '';
        if (recommendation === 'ADVANCE') {
            reasoning = `${dealData.propertyName} meets initial intake criteria: adequate unit count, LIHTC alignment, and basic data availability. Ready for preliminary analysis.`;
        }
        else if (recommendation === 'REJECT') {
            reasoning = `${dealData.propertyName} fails basic screening criteria: ${redFlags.join('; ')}`;
        }
        else {
            reasoning = `${dealData.propertyName} requires additional information before proceeding: ${dataGaps.join(', ')}`;
        }
        return {
            dealId: dealData.id,
            stage: 'A-initial-intake',
            stageName: 'Initial Intake',
            timestamp: new Date().toISOString(),
            recommendation,
            confidence: redFlags.length > 0 ? 70 : 85,
            reasoning,
            keyFindings,
            redFlags,
            nextSteps: recommendation === 'ADVANCE'
                ? ['Move to Preliminary Analysis', 'Assign analyst', 'Request missing data']
                : recommendation === 'REQUEST_MORE_INFO'
                    ? ['Request missing information', 'Re-evaluate when complete']
                    : ['Politely decline', 'Maintain source relationship'],
            specUsed: 'stage-1-initial-intake.md',
            analysisData: {
                screeningResults: {
                    assetClass: dealData.basicInfo.totalUnits >= 5 ? 'PASS' : 'FAIL',
                    missionAlignment: 'PASS', // Always passes for LIHTC properties
                    basicFinancials: recommendation !== 'REJECT' ? 'PASS' : 'FAIL',
                    dataCompleteness: dataGaps.length <= 2 ? 'PASS' : 'PARTIAL'
                },
                missingElements: dataGaps,
                completenessScore: Math.max(0, 100 - (dataGaps.length * 25))
            }
        };
    }
    /**
     * Stage 2: Preliminary Analysis (Simplified for MVP)
     */
    analyzePreliminary(dealData, tenantData, financialData, spec) {
        console.log(`📊 Running Stage 2: Preliminary Analysis...`);
        const keyFindings = [];
        const redFlags = [];
        let recommendation = 'ADVANCE';
        // Simplified preliminary analysis
        keyFindings.push(`Property: ${dealData.propertyName} (${dealData.basicInfo.totalUnits} units)`);
        keyFindings.push('Preliminary market analysis: TBD - Coming Soon');
        keyFindings.push('Rent roll analysis: TBD - Coming Soon');
        keyFindings.push('Initial financing assessment: TBD - Coming Soon');
        return {
            dealId: dealData.id,
            stage: 'B-preliminary-analysis',
            stageName: 'Preliminary Analysis',
            timestamp: new Date().toISOString(),
            recommendation,
            confidence: 75,
            reasoning: `${dealData.propertyName} preliminary analysis complete. Property shows potential for LIHTC preservation. Recommend advancing to full underwriting.`,
            keyFindings,
            redFlags,
            nextSteps: ['Proceed to Full Underwriting', 'Commission property inspection', 'Detailed financial analysis'],
            specUsed: 'stage-2-preliminary-analysis.md',
            analysisData: {
                marketAnalysis: 'TBD - Coming Soon',
                rentAnalysis: 'TBD - Coming Soon',
                financialProjections: 'TBD - Coming Soon'
            }
        };
    }
    /**
     * Stage 3: Full Underwriting (Simplified for MVP)
     */
    analyzeFullUnderwriting(dealData, tenantData, financialData, spec) {
        console.log(`📊 Running Stage 3: Full Underwriting...`);
        const keyFindings = [];
        const redFlags = [];
        keyFindings.push(`Comprehensive underwriting for ${dealData.propertyName}`);
        keyFindings.push('Detailed financial modeling: TBD - Coming Soon');
        keyFindings.push('LIHTC compliance assessment: TBD - Coming Soon');
        keyFindings.push('Capital needs analysis: TBD - Coming Soon');
        return {
            dealId: dealData.id,
            stage: 'C-full-underwriting',
            stageName: 'Full Underwriting',
            timestamp: new Date().toISOString(),
            recommendation: 'ADVANCE',
            confidence: 80,
            reasoning: `${dealData.propertyName} full underwriting analysis supports investment thesis. LIHTC preservation opportunity validated.`,
            keyFindings,
            redFlags,
            nextSteps: ['Prepare IC presentation', 'Finalize investment committee materials', 'Schedule IC meeting'],
            specUsed: 'stage-3-full-underwriting.md',
            analysisData: {
                underwritingModel: 'TBD - Coming Soon',
                lihtcCompliance: 'TBD - Coming Soon',
                capitalNeeds: 'TBD - Coming Soon'
            }
        };
    }
    /**
     * Generic analysis for other stages (MVP placeholder)
     */
    analyzeGeneric(stage, dealData, tenantData, financialData, spec) {
        const stageName = this.stageNames[stage] || stage;
        return {
            dealId: dealData.id,
            stage,
            stageName,
            timestamp: new Date().toISOString(),
            recommendation: 'ADVANCE',
            confidence: 75,
            reasoning: `${dealData.propertyName} ${stageName.toLowerCase()} analysis complete.`,
            keyFindings: [`${stageName} processing for ${dealData.propertyName}`, 'Analysis: TBD - Coming Soon'],
            redFlags: [],
            nextSteps: ['Continue to next stage'],
            specUsed: this.stageToSpecMapping[stage] || 'generic',
            analysisData: {
                status: 'MVP placeholder - detailed analysis coming soon'
            }
        };
    }
}
export default SpecsEngine;
//# sourceMappingURL=specs-engine.js.map