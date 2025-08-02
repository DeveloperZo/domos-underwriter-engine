import { readFile, readdir, stat, writeFile } from 'fs/promises';
import { join, dirname } from 'path';

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
export class DealProcessor {
  private readonly specsPath = './specs';
  private readonly pipelinePath = './pipeline';
  private readonly templatesPath = './templates';
  
  // Pipeline-to-specification mapping
  private readonly stageMapping = {
    'A-initial-intake': 'stage-1-initial-intake.md',
    'B-preliminary-analysis': 'stage-2-preliminary-analysis.md', 
    'C-full-underwriting': 'stage-3-full-underwriting.md',
    'D-ic-review': 'stage-4-ic-recommendation.md',
    'E-loi-psa': 'stage-5-legal-transaction.md',
    'F-final-approval': 'stage-6-final-approval.md',
    'G-closing': 'stage-7-closing.md'
  };
  
  private readonly stageNames = {
    'A-initial-intake': 'Initial Intake',
    'B-preliminary-analysis': 'Preliminary Analysis',
    'C-full-underwriting': 'Full Underwriting', 
    'D-ic-review': 'IC Review',
    'E-loi-psa': 'LOI/PSA',
    'F-final-approval': 'Final Approval',
    'G-closing': 'Closing'
  };
  
  /**
   * Process all pending deals in the pipeline
   */
  async processAllPendingDeals(): Promise<void> {
    console.log('🔍 Scanning pipeline for pending deals...');
    
    const pendingDeals = await this.scanPipelineForPendingDeals();
    console.log(`Found ${pendingDeals.length} pending deals`);
    
    for (const dealInfo of pendingDeals) {
      await this.processDealAtLocation(dealInfo);
    }
    
    console.log('✅ All pending deals processed!');
  }
  
  /**
   * Scan pipeline for deals that need processing
   */
  private async scanPipelineForPendingDeals(): Promise<Array<{
    dealPath: string;
    stage: string;
    substate: string;
  }>> {
    const pendingDeals = [];
    
    try {
      // Get all pipeline stages
      const stages = await readdir(this.pipelinePath);
      
      for (const stage of stages) {
        const stagePath = join(this.pipelinePath, stage);
        const stageStats = await stat(stagePath);
        
        if (!stageStats.isDirectory()) continue;
        
        // Check not-started and in-progress substates
        const substates = ['not-started', 'in-progress'];
        
        for (const substate of substates) {
          const substatePath = join(stagePath, substate);
          
          try {
            const deals = await readdir(substatePath);
            
            for (const dealFolder of deals) {
              const dealPath = join(substatePath, dealFolder);
              const dealStats = await stat(dealPath);
              
              if (dealStats.isDirectory()) {
                pendingDeals.push({
                  dealPath,
                  stage,
                  substate
                });
              }
            }
          } catch (error) {
            // Substate folder doesn't exist, skip
            continue;
          }
        }
      }
    } catch (error) {
      console.error('Error scanning pipeline:', error);
    }
    
    return pendingDeals;
  }
  
  /**
   * Process a deal at a specific pipeline location
   */
  async processDealAtLocation(dealInfo: {
    dealPath: string;
    stage: string;
    substate: string;
  }): Promise<void> {
    console.log(`\n📍 Processing deal at: ${dealInfo.stage}/${dealInfo.substate}`);
    
    try {
      // Load the deal data
      const deal = await this.loadDeal(dealInfo.dealPath);
      console.log(`🏢 Deal: ${deal.propertyName}`);
      
      // Get the appropriate specification for this stage
      const specFile = this.getSpecificationForStage(dealInfo.stage);
      if (!specFile) {
        throw new Error(`No specification found for stage: ${dealInfo.stage}`);
      }
      
      console.log(`📋 Using specification: ${specFile}`);
      
      // Run the analysis
      const analysis = await this.runAnalysisSpec(specFile, deal, dealInfo);
      
      // Move deal based on analysis result
      await this.moveDealBasedOnResult(dealInfo, analysis);
      
      console.log(`✅ Deal processing completed: ${analysis.recommendation}`);
      
    } catch (error) {
      console.error(`❌ Error processing deal: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get specification file for a pipeline stage
   */
  private getSpecificationForStage(stage: string): string | null {
    return this.stageMapping[stage as keyof typeof this.stageMapping] || null;
  }
  
  /**
   * Load deal data from JSON file
   */
  private async loadDeal(dealPath: string): Promise<Deal> {
    const dealFile = join(dealPath, 'deal.json');
    const content = await readFile(dealFile, 'utf-8');
    return JSON.parse(content) as Deal;
  }
  
  /**
   * Run analysis following a specific specification file
   */
  private async runAnalysisSpec(
    specFile: string, 
    deal: Deal, 
    dealInfo: {
      dealPath: string;
      stage: string;
      substate: string;
    }
  ): Promise<AnalysisResult> {
    console.log(`\n📋 Running analysis: ${specFile}`);
    
    try {
      // Read the specification
      const spec = await this.loadSpec(specFile);
      console.log(`Loaded specification: ${specFile}`);
      
      // This is where the magic happens - analyze using the spec
      const analysis = await this.analyzeUsingSpec(spec, deal, dealInfo);
      
      // Save the analysis results
      await this.saveAnalysis(dealInfo.dealPath, specFile, analysis);
      
      console.log(`✅ Analysis completed: ${analysis.recommendation}`);
      
      return analysis;
      
    } catch (error) {
      console.error(`❌ Error in ${specFile}: ${error}`);
      throw error;
    }
  }
  
  /**
   * Load and parse specification file
   */
  private async loadSpec(specFile: string): Promise<string> {
    const specPath = join(this.specsPath, specFile);
    return await readFile(specPath, 'utf-8');
  }
  
  /**
   * Analyze deal using specification guidance
   * This is where we would integrate with AI/LLM to follow the spec
   */
  private async analyzeUsingSpec(
    spec: string, 
    deal: Deal, 
    dealInfo: {
      dealPath: string;
      stage: string;
      substate: string;
    }
  ): Promise<AnalysisResult> {
    // For now, this is a placeholder that demonstrates the structure
    // In a real implementation, this would:
    // 1. Parse the spec markdown to understand requirements
    // 2. Apply the spec logic to the deal data
    // 3. Generate analysis following the spec's output format
    
    console.log(`🤖 Analyzing ${deal.propertyName} using spec guidelines...`);
    
    // Extract stage number from stage name
    const stageNumber = this.getStageNumber(dealInfo.stage);
    
    // Simulate analysis based on deal characteristics and current stage
    const analysis: AnalysisResult = {
      dealId: deal.id,
      stage: stageNumber,
      stageName: this.stageNames[dealInfo.stage as keyof typeof this.stageNames] || dealInfo.stage,
      analysisType: spec.split('\n')[0].replace('# ', '').replace(' Specification', ''),
      timestamp: new Date().toISOString(),
      recommendation: this.determineRecommendation(deal, dealInfo.stage),
      confidence: 85,
      keyFindings: [
        `Property: ${deal.propertyName} (${deal.basicInfo.totalUnits} units)`,
        `Price: $${deal.basicInfo.askingPrice.toLocaleString()} ($${deal.basicInfo.pricePerUnit.toLocaleString()}/unit)`,
        `LIHTC Status: ${deal.lihtcInfo.currentlyLIHTC ? 'Active' : 'Inactive'}`,
        `NOI: $${deal.financialData.netOperatingIncome.toLocaleString()}`,
        `Current Stage: ${this.stageNames[dealInfo.stage as keyof typeof this.stageNames]}`
      ],
      risks: this.identifyRisks(deal),
      nextSteps: this.getNextSteps(dealInfo.stage),
      pipelineLocation: {
        currentStage: dealInfo.stage,
        currentSubstate: dealInfo.substate,
        nextStage: this.getNextStage(dealInfo.stage)
      }
    };
    
    return analysis;
  }
  
  /**
   * Simple recommendation logic based on deal characteristics and stage
   */
  private determineRecommendation(
    deal: Deal, 
    stage: string
  ): AnalysisResult['recommendation'] {
    // Basic screening logic that varies by stage
    switch (stage) {
      case 'A-initial-intake':
        if (!deal.lihtcInfo.currentlyLIHTC) return 'REJECT';
        if (deal.basicInfo.pricePerUnit > 200000) return 'REJECT';
        if (deal.basicInfo.pricePerUnit < 30000) return 'REJECT';
        if (deal.financialData.occupancyRate < 80) return 'REQUEST_MORE_INFO';
        return 'ADVANCE';
        
      case 'B-preliminary-analysis':
        if (deal.basicInfo.pricePerUnit > 150000) return 'REJECT';
        if (deal.financialData.expenseRatio > 50) return 'REQUEST_MORE_INFO';
        if (deal.financialData.occupancyRate < 85) return 'REQUEST_MORE_INFO';
        return 'ADVANCE';
        
      case 'C-full-underwriting':
        if (deal.financialData.expenseRatio > 45) return 'REVISIONS_REQUIRED';
        if (deal.financialData.occupancyRate < 90) return 'REVISIONS_REQUIRED';
        return 'ADVANCE';
        
      case 'D-ic-review':
        // IC review typically requires human decision
        return 'ADVANCE';
        
      default:
        return 'ADVANCE';
    }
  }
  
  /**
   * Identify potential risks based on deal data
   */
  private identifyRisks(deal: Deal): string[] {
    const risks: string[] = [];
    
    if (deal.basicInfo.yearBuilt < 1990) {
      risks.push('Older property may require significant capital improvements');
    }
    
    if (deal.financialData.expenseRatio > 45) {
      risks.push('High expense ratio may indicate operational inefficiencies');
    }
    
    const complianceEnd = new Date(deal.lihtcInfo.extendedUseEnd);
    const yearsRemaining = (complianceEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365);
    
    if (yearsRemaining < 5) {
      risks.push('Preservation urgency - less than 5 years remaining');
    }
    
    if (deal.lihtcInfo.violationHistory.length > 0) {
      risks.push('History of LIHTC compliance violations');
    }
    
    return risks;
  }
  
  /**
   * Get stage-specific next steps
   */
  private getNextSteps(stage: string): string[] {
    const nextStepsMap: Record<string, string[]> = {
      'A-initial-intake': ['Gather additional financial documents', 'Schedule property tour', 'Prepare for preliminary analysis'],
      'B-preliminary-analysis': ['Commission property condition assessment', 'Obtain detailed rent rolls', 'Prepare for full underwriting'],
      'C-full-underwriting': ['Finalize financing terms', 'Complete DueDiligence', 'Prepare IC presentation'],
      'D-ic-review': ['Address IC feedback', 'Prepare LOI documentation', 'Coordinate with legal team'],
      'E-loi-psa': ['Execute purchase agreement', 'Coordinate DueDiligence period', 'Prepare for closing'],
      'F-final-approval': ['Finalize all documentation', 'Coordinate closing logistics', 'Prepare transition plan'],
      'G-closing': ['Complete transaction', 'Transfer property management', 'Begin asset management']
    };
    
    return nextStepsMap[stage] || ['Continue to next stage'];
  }
  
  /**
   * Get next pipeline stage
   */
  private getNextStage(currentStage: string): string | undefined {
    const stageOrder = ['A-initial-intake', 'B-preliminary-analysis', 'C-full-underwriting', 'D-ic-review', 'E-loi-psa', 'F-final-approval', 'G-closing'];
    const currentIndex = stageOrder.indexOf(currentStage);
    
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      return stageOrder[currentIndex + 1];
    }
    
    return undefined; // Last stage or invalid stage
  }
  
  /**
   * Get stage number from stage name
   */
  private getStageNumber(stage: string): string {
    const stageNumbers: Record<string, string> = {
      'A-initial-intake': '1',
      'B-preliminary-analysis': '2',
      'C-full-underwriting': '3',
      'D-ic-review': '4',
      'E-loi-psa': '5',
      'F-final-approval': '6',
      'G-closing': '7'
    };
    
    return stageNumbers[stage] || '0';
  }
  
  /**
   * Move deal based on analysis result
   */
  private async moveDealBasedOnResult(
    dealInfo: { dealPath: string; stage: string; substate: string },
    analysis: AnalysisResult
  ): Promise<void> {
    console.log(`📦 Moving deal based on result: ${analysis.recommendation}`);
    
    const dealFolder = dealInfo.dealPath.split('/').pop() || dealInfo.dealPath.split('\\').pop();
    
    // For now, just log the intended move - actual file moving would require additional setup
    switch (analysis.recommendation) {
      case 'ADVANCE':
        if (analysis.pipelineLocation.nextStage) {
          console.log(`🎯 Would move deal to: ${analysis.pipelineLocation.nextStage}/not-started`);
        } else {
          console.log(`🏁 Would complete deal in final stage`);
        }
        break;
        
      case 'REJECT':
        console.log(`❌ Would move deal to: ${dealInfo.stage}/rejected`);
        break;
        
      case 'REQUEST_MORE_INFO':
        console.log(`🔄 Would move deal to: ${dealInfo.stage}/in-progress`);
        break;
        
      case 'REVISIONS_REQUIRED':
        if (dealInfo.stage === 'D-ic-review') {
          console.log(`📝 Would move deal to: ${dealInfo.stage}/revisions-required`);
        } else {
          console.log(`🔄 Would move deal to: ${dealInfo.stage}/in-progress (revisions needed)`);
        }
        break;
    }
  }
  
  /**
   * Save analysis results to deal folder
   */
  private async saveAnalysis(
    dealPath: string, 
    specFile: string, 
    analysis: AnalysisResult
  ): Promise<void> {
    const outputFile = join(dealPath, `${specFile.replace('.md', '')}-analysis.json`);
    
    await writeFile(outputFile, JSON.stringify(analysis, null, 2));
    console.log(`💾 Saved analysis: ${outputFile}`);
  }
}

// Enhanced CLI interface that supports pipeline processing
if (process.argv[2]) {
  const processor = new DealProcessor();
  
  if (process.argv[2] === 'scan') {
    // Process all pending deals in pipeline
    processor.processAllPendingDeals()
      .then(() => console.log('\n🎉 Pipeline processing complete!'))
      .catch(error => {
        console.error('\n💥 Pipeline processing failed:', error);
        process.exit(1);
      });
  } else {
    // Process specific deal (legacy mode)
    const dealPath = process.argv[2];
    
    // Try to determine stage from path
    const pathParts = dealPath.split('/').concat(dealPath.split('\\'));
    const stageIndex = pathParts.findIndex(part => part.startsWith('A-') || part.startsWith('B-') || part.startsWith('C-'));
    
    if (stageIndex >= 0) {
      const stage = pathParts[stageIndex];
      const substate = pathParts[stageIndex + 1] || 'not-started';
      
      processor.processDealAtLocation({
        dealPath,
        stage,
        substate
      })
        .then(() => console.log('\n🎉 Deal processing complete!'))
        .catch(error => {
          console.error('\n💥 Deal processing failed:', error);
          process.exit(1);
        });
    } else {
      console.error('❌ Could not determine pipeline stage from path');
      console.log('Usage: npm run dev scan  (process all pending deals)');
      console.log('   or: npm run dev pipeline/A-initial-intake/not-started/deal-folder');
      process.exit(1);
    }
  }
}