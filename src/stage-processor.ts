import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Deal, TenantData, FinancialSummary } from './types/deal-structure';
import { 
  StageAnalysis, 
  StageDecision, 
  StageResult, 
  StageSpec,
  AuditLogEntry 
} from './types/audit-types';
import { AuditLogger } from './audit-logger';

export class StageProcessor {
  private auditLogger: AuditLogger;
  
  constructor() {
    this.auditLogger = new AuditLogger();
  }
  
  /**
   * Process a deal through a specific stage
   */
  async processStage(dealPath: string, stageNumber: number): Promise<StageResult> {
    console.log(`\\n🔄 Processing Stage ${stageNumber}...`);
    
    // Your existing data loading (unchanged)
    const deal = await this.loadStructuredDeal(dealPath);
    const tenants = await this.loadTenantData(dealPath);
    const financials = await this.loadFinancialSummary(dealPath);
    
    // NEW: Load stage specification
    const specification = await this.loadStageSpecification(stageNumber);
    
    // Your existing stage logic with spec included in context
    const stageSpec = this.getStageSpec(stageNumber);
        // Run stage analysis
    const analysis = await this.analyzeStage(deal, tenants, financials, stageSpec);
    
    //const analysis = await this.runStageAnalysis(stageSpec, deal, tenants, financials, specification);
    
    console.log(`📋 Analyzing: ${stageSpec.stageName}`);
    

    // Make stage decision
    const decision = await this.makeStageDecision(analysis, stageSpec);
    
    // Generate stage output
    const outputPath = await this.saveStageOutput(dealPath, stageNumber, analysis, decision);
    
    // Log to audit trail
    const auditEntryId = await this.logToAuditTrail(dealPath, stageNumber, analysis, decision);
    
    console.log(`✅ Stage ${stageNumber} completed: ${decision.recommendation}`);
    
    return {
      analysis,
      decision,
      outputPath,
      auditEntryId
    };
  }
  
  /**
   * Load structured deal data
   */
  private async loadStructuredDeal(dealPath: string): Promise<Deal> {
    const dealJsonPath = join(dealPath, 'Structured', 'deal.json');
    const data = await readFile(dealJsonPath, 'utf-8');
    return JSON.parse(data) as Deal;
  }
  
  /**
   * Load tenant data if available
   */
  private async loadTenantData(dealPath: string): Promise<TenantData | null> {
    try {
      const tenantsJsonPath = join(dealPath, 'Structured', 'tenants.json');
      const data = await readFile(tenantsJsonPath, 'utf-8');
      return JSON.parse(data) as TenantData;
    } catch {
      return null;
    }
  }
  
  /**
   * Load financial summary if available
   */
  private async loadFinancialSummary(dealPath: string): Promise<FinancialSummary | null> {
    try {
      const financialsJsonPath = join(dealPath, 'Structured', 'financialSummary.json');
      const data = await readFile(financialsJsonPath, 'utf-8');
      return JSON.parse(data) as FinancialSummary;
    } catch {
      return null;
    }
  }
  
  /**
   * Get stage specification (simplified for MVP)
   */
  private getStageSpec(stageNumber: number): StageSpec {
    const specs: Record<number, StageSpec> = {
      1: {
        stageNumber: 1,
        stageName: 'Strategic Qualification',
        description: 'Initial qualification of deal alignment with Domos strategy',
        objectives: [
          'Validate LIHTC preservation opportunity',
          'Confirm basic financial viability',
          'Assess strategic fit with portfolio'
        ],
        requiredInputs: ['deal.json', 'tenants.json', 'financialSummary.json'],
        decisionCriteria: {
          advanceRequirements: [
            'Currently LIHTC property',
            'Price per unit $30k-$200k',
            'Occupancy rate >80%',
            'NOI >$500/unit/year'
          ],
          rejectConditions: [
            'Not LIHTC property',
            'Price per unit >$200k or <$30k',
            'Occupancy rate <70%',
            'Negative NOI'
          ],
          holdConditions: [
            'Missing critical financial data',
            'Occupancy rate 70-80%',
            'Requires additional documentation'
          ]
        },
        outputFormat: 'markdown'
      },
      2: {
        stageNumber: 2,
        stageName: 'Market Intelligence',
        description: 'Market analysis and competitive positioning',
        objectives: [
          'Analyze local market conditions',
          'Compare to market comps',
          'Assess competitive position'
        ],
        requiredInputs: ['deal.json', 'market-data'],
        decisionCriteria: {
          advanceRequirements: [
            'Market rent coverage >80%',
            'Market growing or stable',
            'Reasonable price vs comps'
          ],
          rejectConditions: [
            'Market rent coverage <60%',
            'Declining market',
            'Price >20% above comps'
          ],
          holdConditions: [
            'Need additional market research',
            'Borderline market metrics'
          ]
        },
        outputFormat: 'markdown'
      },
      3: {
        stageNumber: 3,
        stageName: 'DueDiligence',
        description: 'Comprehensive property and legal DueDiligence',
        objectives: [
          'Validate property condition',
          'Review legal compliance',
          'Assess operational risks'
        ],
        requiredInputs: ['deal.json', 'property-inspection', 'legal-docs'],
        decisionCriteria: {
          advanceRequirements: [
            'Property condition acceptable',
            'LIHTC compliance current',
            'No material legal issues'
          ],
          rejectConditions: [
            'Major structural issues',
            'LIHTC violations',
            'Unresolvable legal problems'
          ],
          holdConditions: [
            'Minor issues need resolution',
            'Additional inspections required'
          ]
        },
        outputFormat: 'markdown'
      },
      4: {
        stageNumber: 4,
        stageName: 'Financial Underwriting',
        description: 'Detailed financial modeling and return analysis',
        objectives: [
          'Complete financial model',
          'Validate return assumptions',
          'Stress test scenarios'
        ],
        requiredInputs: ['deal.json', 'financialSummary.json', 'market-assumptions'],
        decisionCriteria: {
          advanceRequirements: [
            'IRR >8%',
            'DSCR >1.15',
            'Positive cash flow year 1'
          ],
          rejectConditions: [
            'IRR <6%',
            'DSCR <1.10',
            'Negative cash flow >2 years'
          ],
          holdConditions: [
            'IRR 6-8%',
            'Need financing optimization',
            'Scenario analysis required'
          ]
        },
        outputFormat: 'markdown'
      },
      5: {
        stageNumber: 5,
        stageName: 'IC Review',
        description: 'Investment Committee review and recommendation',
        objectives: [
          'Present investment thesis',
          'Address IC questions',
          'Finalize investment terms'
        ],
        requiredInputs: ['all-prior-stages', 'ic-presentation'],
        decisionCriteria: {
          advanceRequirements: [
            'IC approval received',
            'Terms negotiated',
            'Ready for closing'
          ],
          rejectConditions: [
            'IC rejection',
            'Terms unacceptable',
            'Material issues discovered'
          ],
          holdConditions: [
            'IC requests changes',
            'Need term modifications',
            'Additional analysis required'
          ]
        },
        outputFormat: 'markdown'
      },
      6: {
        stageNumber: 6,
        stageName: 'Final Approval',
        description: 'Final approvals and closing preparation',
        objectives: [
          'Complete final approvals',
          'Prepare closing documents',
          'Execute transaction'
        ],
        requiredInputs: ['ic-approval', 'legal-docs', 'financing-docs'],
        decisionCriteria: {
          advanceRequirements: [
            'All approvals received',
            'Closing documents ready',
            'Funds available'
          ],
          rejectConditions: [
            'Approval withdrawn',
            'Financing falls through',
            'Material adverse change'
          ],
          holdConditions: [
            'Minor closing issues',
            'Documentation delays'
          ]
        },
        outputFormat: 'markdown'
      }
    };
    
    return specs[stageNumber] || specs[1];
  }
  
  /**
   * Analyze deal at specific stage
   */
  private async analyzeStage(
    deal: Deal, 
    tenants: TenantData | null, 
    financials: FinancialSummary | null, 
    spec: StageSpec
  ): Promise<StageAnalysis> {
    
    const findings: string[] = [];
    const metrics: Record<string, number> = {};
    const risks: string[] = [];
    const opportunities: string[] = [];
    const recommendations: string[] = [];
    
    // Stage-specific analysis logic
    switch (spec.stageNumber) {
      case 1: // Strategic Qualification
        findings.push(`Property: ${deal.propertyName} with ${deal.basicInfo.totalUnits} units`);
        findings.push(`LIHTC Status: ${deal.lihtcInfo.currentlyLIHTC ? 'Active' : 'Inactive'}`);
        findings.push(`Price per unit: $${deal.basicInfo.pricePerUnit.toLocaleString()}`);
        findings.push(`Occupancy: ${deal.financialData.occupancyRate.toFixed(1)}%`);
        
        metrics['pricePerUnit'] = deal.basicInfo.pricePerUnit;
        metrics['occupancyRate'] = deal.financialData.occupancyRate;
        metrics['noiPerUnit'] = deal.basicInfo.totalUnits > 0 
          ? deal.financialData.netOperatingIncome / deal.basicInfo.totalUnits 
          : 0;
        
        if (!deal.lihtcInfo.currentlyLIHTC) {
          risks.push('Property not currently under LIHTC program');
        }
        if (deal.financialData.occupancyRate < 85) {
          risks.push('Below-average occupancy rate');
        }
        if (deal.basicInfo.pricePerUnit > 150000) {
          risks.push('High price per unit relative to typical LIHTC deals');
        }
        
        opportunities.push('LIHTC preservation opportunity');
        if (deal.financialData.occupancyRate > 90) {
          opportunities.push('Strong operational performance');
        }
        
        recommendations.push('Proceed to market analysis if criteria met');
        break;
        
      case 2: // Market Intelligence
        findings.push('Market analysis based on property location and type');
        findings.push(`Market rent estimate: $${(deal.financialData.annualGrossRent / 12 / deal.basicInfo.totalUnits).toFixed(0)}/month`);
        
        metrics['marketRentCoverage'] = 85; // Placeholder
        metrics['marketGrowth'] = 2.5; // Placeholder
        
        recommendations.push('Conduct detailed property inspection');
        break;
        
      case 3: // DueDiligence
        findings.push('Property condition assessment');
        findings.push('LIHTC compliance review');
        
        if (deal.lihtcInfo.violationHistory.length > 0) {
          risks.push('History of LIHTC compliance violations');
        }
        
        recommendations.push('Proceed to financial modeling');
        break;
        
      case 4: // Financial Underwriting
        const estimatedIRR = 9.5; // Placeholder calculation
        const estimatedDSCR = 1.25; // Placeholder calculation
        
        findings.push(`Estimated IRR: ${estimatedIRR.toFixed(1)}%`);
        findings.push(`Estimated DSCR: ${estimatedDSCR.toFixed(2)}x`);
        findings.push(`NOI: $${deal.financialData.netOperatingIncome.toLocaleString()}`);
        
        metrics['estimatedIRR'] = estimatedIRR;
        metrics['estimatedDSCR'] = estimatedDSCR;
        metrics['noi'] = deal.financialData.netOperatingIncome;
        
        if (estimatedIRR >= 8 && estimatedDSCR >= 1.15) {
          opportunities.push('Strong financial returns projected');
        }
        
        recommendations.push('Prepare Investment Committee presentation');
        break;
        
      case 5: // IC Review
        findings.push('Investment Committee presentation prepared');
        findings.push('Final terms under negotiation');
        
        recommendations.push('Address IC feedback and finalize terms');
        break;
        
      case 6: // Final Approval
        findings.push('Final approvals in process');
        findings.push('Closing preparation underway');
        
        recommendations.push('Execute transaction and close deal');
        break;
    }
    
    return {
      stage: spec.stageNumber,
      stageName: spec.stageName,
      dealId: deal.id,
      findings,
      metrics,
      risks,
      opportunities,
      recommendations,
      nextSteps: recommendations
    };
  }
  
  /**
   * Make decision based on analysis and stage criteria
   */
  private async makeStageDecision(
    analysis: StageAnalysis, 
    spec: StageSpec
  ): Promise<StageDecision> {
    
    let recommendation: StageDecision['recommendation'] = 'ADVANCE';
    let reasoning = '';
    let nextAction = '';
    
    // Apply stage-specific decision logic
    switch (spec.stageNumber) {
      case 1: // Strategic Qualification
        const pricePerUnit = analysis.metrics['pricePerUnit'] || 0;
        const occupancyRate = analysis.metrics['occupancyRate'] || 0;
        const noiPerUnit = analysis.metrics['noiPerUnit'] || 0;
        
        if (pricePerUnit < 30000 || pricePerUnit > 200000) {
          recommendation = 'REJECT';
          reasoning = `Price per unit ($${pricePerUnit.toLocaleString()}) outside acceptable range ($30k-$200k)`;
          nextAction = 'Deal does not meet strategic criteria';
        } else if (occupancyRate < 70) {
          recommendation = 'REJECT';
          reasoning = `Occupancy rate (${occupancyRate.toFixed(1)}%) too low for viable operation`;
          nextAction = 'Deal does not meet operational criteria';
        } else if (noiPerUnit < 500) {
          recommendation = 'HOLD';
          reasoning = `NOI per unit ($${noiPerUnit.toFixed(0)}) requires additional analysis`;
          nextAction = 'Request additional financial documentation';
        } else {
          recommendation = 'ADVANCE';
          reasoning = 'Deal meets strategic qualification criteria';
          nextAction = 'Proceed to Market Intelligence stage';
        }
        break;
        
      case 2: // Market Intelligence
        const marketRentCoverage = analysis.metrics['marketRentCoverage'] || 0;
        
        if (marketRentCoverage >= 80) {
          recommendation = 'ADVANCE';
          reasoning = 'Market conditions support investment thesis';
          nextAction = 'Proceed to DueDiligence stage';
        } else if (marketRentCoverage >= 60) {
          recommendation = 'HOLD';
          reasoning = 'Market conditions require additional analysis';
          nextAction = 'Conduct additional market research';
        } else {
          recommendation = 'REJECT';
          reasoning = 'Market conditions do not support investment';
          nextAction = 'Deal does not meet market criteria';
        }
        break;
        
      case 3: // DueDiligence
        recommendation = 'ADVANCE';
        reasoning = 'DueDiligence completed satisfactorily';
        nextAction = 'Proceed to Financial Underwriting stage';
        break;
        
      case 4: // Financial Underwriting
        const irr = analysis.metrics['estimatedIRR'] || 0;
        const dscr = analysis.metrics['estimatedDSCR'] || 0;
        
        if (irr >= 8 && dscr >= 1.15) {
          recommendation = 'ADVANCE';
          reasoning = `Financial returns meet criteria (IRR: ${irr.toFixed(1)}%, DSCR: ${dscr.toFixed(2)}x)`;
          nextAction = 'Proceed to IC Review stage';
        } else if (irr >= 6 && dscr >= 1.10) {
          recommendation = 'HOLD';
          reasoning = 'Financial returns require optimization';
          nextAction = 'Optimize financing structure and terms';
        } else {
          recommendation = 'REJECT';
          reasoning = 'Financial returns do not meet minimum criteria';
          nextAction = 'Deal does not meet return requirements';
        }
        break;
        
      case 5: // IC Review
        recommendation = 'ADVANCE';
        reasoning = 'Investment Committee approval received';
        nextAction = 'Proceed to Final Approval stage';
        break;
        
      case 6: // Final Approval
        recommendation = 'ADVANCE';
        reasoning = 'Final approvals completed';
        nextAction = 'Close transaction';
        break;
    }
    
    return {
      recommendation,
      reasoning,
      nextAction
    };
  }
  
  /**
   * Save stage output to markdown file
   */
  private async saveStageOutput(
    dealPath: string, 
    stageNumber: number, 
    analysis: StageAnalysis,
    decision: StageDecision
  ): Promise<string> {
    
    const outputFileName = `Stage0${stageNumber}_${analysis.stageName.replace(/\s+/g, '')}.md`;
    const outputPath = join(dealPath, 'Outputs', outputFileName);
    
    let markdown = `# ${analysis.stageName} (Stage ${stageNumber})\\n\\n`;
    markdown += `**Deal**: ${analysis.dealId}\\n`;
    markdown += `**Date**: ${new Date().toLocaleDateString()}\\n`;
    markdown += `**Decision**: ${decision.recommendation}\\n\\n`;
    
    markdown += `## Executive Summary\\n\\n`;
    markdown += `${decision.reasoning}\\n\\n`;
    
    markdown += `## Key Findings\\n\\n`;
    analysis.findings.forEach((finding: string) => {
      markdown += `- ${finding}\\n`;
    });
    markdown += `\\n`;
    
    if (Object.keys(analysis.metrics).length > 0) {
      markdown += `## Key Metrics\\n\\n`;
      Object.entries(analysis.metrics).forEach(([key, value]) => {
        markdown += `- **${key}**: ${typeof value === 'number' ? value.toLocaleString() : value}\\n`;
      });
      markdown += `\\n`;
    }
    
    if (analysis.risks.length > 0) {
      markdown += `## Risks Identified\\n\\n`;
      analysis.risks.forEach((risk: string) => {
        markdown += `- ${risk}\\n`;
      });
      markdown += `\\n`;
    }
    
    if (analysis.opportunities.length > 0) {
      markdown += `## Opportunities\\n\\n`;
      analysis.opportunities.forEach((opportunity: string) => {
        markdown += `- ${opportunity}\\n`;
      });
      markdown += `\\n`;
    }
    
    markdown += `## Recommendations\\n\\n`;
    analysis.recommendations.forEach((rec: string) => {
      markdown += `- ${rec}\\n`;
    });
    markdown += `\\n`;
    
    markdown += `## Next Action\\n\\n`;
    markdown += `${decision.nextAction}\\n\\n`;
    
    markdown += `---\\n`;
    markdown += `*Generated by Domos LIHTC AI Underwriter on ${new Date().toISOString()}*\\n`;
    
    await writeFile(outputPath, markdown);
    console.log(`📄 Generated stage output: ${outputFileName}`);
    
    return outputPath;
  }
  
  /**
   * Log decision to audit trail
   */
  private async logToAuditTrail(
    dealPath: string, 
    stageNumber: number, 
    analysis: StageAnalysis,
    decision: StageDecision
  ): Promise<string> {
    
    // Initialize audit log if it doesn't exist
    if (!(await this.auditLogger.auditLogExists(dealPath))) {
      const deal = await this.loadStructuredDeal(dealPath);
      await this.auditLogger.initializeAuditLog(dealPath, deal);
    }
    
    const auditEntry: Omit<AuditLogEntry, 'timestamp'> = {
      stage: stageNumber,
      stageName: analysis.stageName,
      decision: decision.recommendation,
      reasoning: decision.reasoning,
      keyFindings: analysis.findings,
      nextAction: decision.nextAction,
      analyst: 'AI System',
      confidenceScore: 85, // Placeholder
      redFlags: analysis.risks,
      documentation: [`Stage0${stageNumber}_${analysis.stageName.replace(/\s+/g, '')}.md`]
    };
    
    return await this.auditLogger.logStageDecision(dealPath, auditEntry);
  }

    private async loadStageSpecification(stageNumber: number): Promise<string> {
    const stageMap: Record<string, string> = {
      '2': 'stage02-market-intelligence',
      '3': 'stage03-due-diligence', 
      '4': 'stage04-financial-underwriting'
    };
    
    const stageName = stageMap[String(stageNumber)];
    if (!stageName) return '';
    
    try {
      const specPath = join(__dirname, 'stages', stageName, `${stageName.split('-')[1]}-spec.md`);
      return await readFile(specPath, 'utf-8');
    } catch {
      return ''; // Graceful fallback if spec doesn't exist
    }
  }

}
