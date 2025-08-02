import { readdir, readFile, writeFile, mkdir, cp, stat, rm } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { AuditLogger } from './audit-logger.js';
import { Deal } from './types/deal-structure';

/**
 * Handles moving deals between pipeline stages and managing the workflow
 */
export class DealPipeline {
  private readonly pipelineRoot = './pipeline';
  private readonly processedDealsPath = './processed-deals';
  private readonly auditLogger: AuditLogger;
  
  // Define pipeline stages
  private readonly stages = [
    'A-initial-intake',
    'B-preliminary-analysis',
    'C-full-underwriting',
    'D-ic-review',
    'E-loi-psa',
    'F-final-approval',
    'G-closing'
  ];
  
  // Define substates
  private readonly substates = [
    'not-started',
    'in-progress',
    'completed',
    'rejected'
  ];
  
  // Map stage numbers to pipeline stages
  private readonly stageNumberToName: { [key: number]: string } = {
    1: 'A-initial-intake',
    2: 'B-preliminary-analysis',
    3: 'C-full-underwriting',
    4: 'D-ic-review',
    5: 'E-loi-psa',
    6: 'F-final-approval',
    7: 'G-closing'
  };
  
  // Map pipeline stages to stage numbers
  private readonly stageNameToNumber: { [key: string]: number } = {
    'A-initial-intake': 1,
    'B-preliminary-analysis': 2,
    'C-full-underwriting': 3,
    'D-ic-review': 4,
    'E-loi-psa': 5,
    'F-final-approval': 6,
    'G-closing': 7
  };
  
  constructor() {
    this.auditLogger = new AuditLogger();
  }
  
  /**
   * Get the path to a deal in the pipeline
   */
  async findDealInPipeline(dealId: string): Promise<string | null> {
    // First check processed-deals
    try {
      const processedDeals = await readdir(this.processedDealsPath);
      for (const dealDir of processedDeals) {
        try {
          const dealPath = join(this.processedDealsPath, dealDir);
          const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
          const deal = JSON.parse(dealData);
          
          if (deal.id === dealId) {
            return dealPath;
          }
        } catch (error) {
          // Continue to next deal
        }
      }
    } catch (error) {
      // Continue to pipeline check
    }
    
    // Check each stage and substate
    for (const stage of this.stages) {
      const stagePath = join(this.pipelineRoot, stage);
      
      for (const substate of this.substates) {
        const substatePath = join(stagePath, substate);
        
        try {
          const deals = await readdir(substatePath);
          
          for (const dealDir of deals) {
            try {
              const dealPath = join(substatePath, dealDir);
              const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
              const deal = JSON.parse(dealData);
              
              if (deal.id === dealId) {
                return dealPath;
              }
            } catch (error) {
              // Continue to next deal
            }
          }
        } catch (error) {
          // Continue to next substate
        }
      }
      
      // Check special substates for IC Review
      if (stage === 'D-ic-review') {
        const revisionsPath = join(stagePath, 'revisions-required');
        
        try {
          const deals = await readdir(revisionsPath);
          
          for (const dealDir of deals) {
            try {
              const dealPath = join(revisionsPath, dealDir);
              const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
              const deal = JSON.parse(dealData);
              
              if (deal.id === dealId) {
                return dealPath;
              }
            } catch (error) {
              // Continue to next deal
            }
          }
        } catch (error) {
          // Continue to next stage
        }
      }
    }
    
    return null;
  }
  
  /**
   * Move a deal to a specific pipeline stage and substate
   */
  async moveDealToPipeline(
    dealPath: string, 
    targetStage: string, 
    targetSubstate: string
  ): Promise<string> {
    console.log(`🔄 Moving deal to pipeline: ${targetStage}/${targetSubstate}`);
    
    // Read deal data
    const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
    const deal = JSON.parse(dealData);
    
    // Create target directory
    const targetDir = join(this.pipelineRoot, targetStage, targetSubstate, basename(dealPath));
    await mkdir(targetDir, { recursive: true });
    
    // Copy all files from source to target
    const files = await readdir(dealPath);
    for (const file of files) {
      const sourcePath = join(dealPath, file);
      const targetPath = join(targetDir, file);
      
      // Skip directories by checking if it's a file
      try {
        const stats = await stat(sourcePath);
        if (stats.isFile()) {
          await cp(sourcePath, targetPath, { recursive: true });
        } else {
          // If it's a directory, create it and copy contents
          await mkdir(targetPath, { recursive: true });
          await cp(sourcePath, targetPath, { recursive: true });
        }
      } catch (error) {
        console.error(`Error copying ${file}:`, error);
      }
    }
    
    // Update deal _meta with new location
    if (!deal._meta) {
      // Initialize _meta if it doesn't exist
      deal._meta = {
        stage: this.mapPipelineStageToMetaStage(targetStage),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStage: this.stageNameToNumber[targetStage] || 1,
        stageStatuses: {},
        flags: {},
        lastAnalyzedAt: new Date().toISOString(),
        pipelineStage: targetStage,
        pipelineSubstate: targetSubstate
      };
    } else {
      // Update existing _meta
      deal._meta.pipelineStage = targetStage;
      deal._meta.pipelineSubstate = targetSubstate;
      deal._meta.updatedAt = new Date().toISOString();
      
      // Make sure other required fields exist
      if (!deal._meta.flags) deal._meta.flags = {};
      if (!deal._meta.stageStatuses) deal._meta.stageStatuses = {};
      deal._meta.stage = this.mapPipelineStageToMetaStage(targetStage);
    }
    
    // Add to analysis history
    if (!deal._meta.analysisHistory) {
      deal._meta.analysisHistory = [];
    }
    
    deal._meta.analysisHistory.push({
      timestamp: new Date().toISOString(),
      stage: this.stageNameToNumber[targetStage] || 0,
      action: `moved_to_${targetStage}_${targetSubstate}`,
      result: 'success'
    });
    
    // Save updated deal.json to target
    await writeFile(
      join(targetDir, 'deal.json'),
      JSON.stringify(deal, null, 2)
    );
    
    // Update the Analysis Journey
    await this.updateAnalysisJourney(targetDir, deal, targetStage, targetSubstate);
    
    console.log(`✅ Deal moved to: ${targetDir}`);
    
    return targetDir;
  }
  
  /**
   * Move a deal to the next pipeline stage based on analysis result
   */
  async moveDealBasedOnResult(
    dealPath: string,
    result: {
      recommendation: 'ADVANCE' | 'REJECT' | 'HOLD' | 'REQUEST_MORE_INFO';
      reasoning: string;
    }
  ): Promise<string> {
    // Read deal data
    const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
    const deal = JSON.parse(dealData);
    
    // Determine current stage and location
    const currentStage = deal._meta.pipelineStage || '';
    const currentSubstate = deal._meta.pipelineSubstate || '';
    
    // If deal is not in pipeline yet (still in processed-deals)
    if (!currentStage || !currentSubstate) {
      if (result.recommendation === 'ADVANCE') {
        // Move to first stage in-progress
        return this.moveDealToPipeline(dealPath, 'A-initial-intake', 'in-progress');
      } else if (result.recommendation === 'REJECT') {
        // Move directly to first stage rejected
        return this.moveDealToPipeline(dealPath, 'A-initial-intake', 'rejected');
      } else {
        // Keep in processed-deals but update metadata
        if (!deal._meta) {
          deal._meta = {
            stage: 'initial-intake',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentStage: 0,
            stageStatuses: {},
            flags: {},
            analysisHistory: [],
            lastAnalyzedAt: new Date().toISOString()
          };
        } else {
          deal._meta.updatedAt = new Date().toISOString();
        }
        
        // Ensure analysis history exists
        if (!deal._meta.analysisHistory) {
          deal._meta.analysisHistory = [];
        }
        
        deal._meta.analysisHistory.push({
          timestamp: new Date().toISOString(),
          stage: 0,
          action: 'analyze_result',
          result: result.recommendation
        });
        
        await writeFile(
          join(dealPath, 'deal.json'),
          JSON.stringify(deal, null, 2)
        );
        
        return dealPath;
      }
    }
    
    // Deal is already in pipeline
    const currentStageIndex = this.stages.indexOf(currentStage);
    
    if (currentStageIndex === -1) {
      throw new Error(`Invalid pipeline stage: ${currentStage}`);
    }
    
    if (result.recommendation === 'ADVANCE') {
      // If at the last stage, move to completed
      if (currentStageIndex === this.stages.length - 1) {
        return this.moveDealToPipeline(dealPath, currentStage, 'completed');
      }
      
      // Move to next stage not-started
      const nextStage = this.stages[currentStageIndex + 1];
      return this.moveDealToPipeline(dealPath, nextStage, 'not-started');
    } else if (result.recommendation === 'REJECT') {
      // Move to current stage rejected
      return this.moveDealToPipeline(dealPath, currentStage, 'rejected');
    } else if (result.recommendation === 'HOLD') {
      // If in IC Review, move to revisions-required
      if (currentStage === 'D-ic-review') {
        return this.moveDealToPipeline(dealPath, currentStage, 'revisions-required');
      }
      
      // Otherwise, keep in current stage/substate but update metadata
      deal._meta.updatedAt = new Date().toISOString();
      
      // Ensure analysis history exists
      if (!deal._meta.analysisHistory) {
        deal._meta.analysisHistory = [];
      }
      
      deal._meta.analysisHistory.push({
        timestamp: new Date().toISOString(),
        stage: this.stageNameToNumber[currentStage] || 0,
        action: 'analyze_result',
        result: result.recommendation
      });
      
      await writeFile(
        join(dealPath, 'deal.json'),
        JSON.stringify(deal, null, 2)
      );
      
      return dealPath;
    } else {
      // REQUEST_MORE_INFO: Keep in current stage/substate but update metadata
      deal._meta.updatedAt = new Date().toISOString();
      
      // Ensure analysis history exists
      if (!deal._meta.analysisHistory) {
        deal._meta.analysisHistory = [];
      }
      
      deal._meta.analysisHistory.push({
        timestamp: new Date().toISOString(),
        stage: this.stageNameToNumber[currentStage] || 0,
        action: 'analyze_result',
        result: result.recommendation
      });
      
      await writeFile(
        join(dealPath, 'deal.json'),
        JSON.stringify(deal, null, 2)
      );
      
      return dealPath;
    }
  }
  
  /**
   * Start the analysis of a specific stage
   * Moves the deal to the appropriate in-progress folder
   */
  async startStageAnalysis(dealPath: string, stageNumber: number): Promise<string> {
    // Read deal data
    const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
    const deal = JSON.parse(dealData);
    
    // Get the pipeline stage name
    const stageName = this.stageNumberToName[stageNumber];
    
    if (!stageName) {
      throw new Error(`Invalid stage number: ${stageNumber}`);
    }
    
    // If the deal is not in the pipeline yet (still in processed-deals)
    if (!deal._meta.pipelineStage || !deal._meta.pipelineSubstate) {
      if (stageNumber === 1) {
        // For stage 1, move from processed-deals to A-initial-intake/in-progress
        return this.moveDealToPipeline(dealPath, stageName, 'in-progress');
      } else {
        throw new Error(`Deal must go through stage 1 first before analyzing stage ${stageNumber}`);
      }
    }
    
    // If the deal is already in the pipeline
    const currentStage = deal._meta.pipelineStage;
    const currentSubstate = deal._meta.pipelineSubstate;
    const currentStageNumber = this.stageNameToNumber[currentStage] || 0;
    
    // If trying to analyze a previous stage
    if (stageNumber < currentStageNumber) {
      throw new Error(`Deal has already progressed past stage ${stageNumber}`);
    }
    
    // If trying to skip stages
    if (stageNumber > currentStageNumber + 1) {
      throw new Error(`Cannot skip stages: trying to analyze stage ${stageNumber} but deal is at stage ${currentStageNumber}`);
    }
    
    // If deal is in the right stage but not in in-progress
    if (stageName === currentStage && currentSubstate !== 'in-progress') {
      return this.moveDealToPipeline(dealPath, currentStage, 'in-progress');
    }
    
    // If deal is ready for the next stage
    if (stageNumber === currentStageNumber + 1) {
      // Make sure current stage is completed
      if (currentSubstate !== 'completed') {
        throw new Error(`Deal must complete stage ${currentStageNumber} before analyzing stage ${stageNumber}`);
      }
      
      // Move to next stage in-progress
      return this.moveDealToPipeline(dealPath, stageName, 'in-progress');
    }
    
    // If deal is already in the right stage and substate, just return the path
    return dealPath;
  }
  
  /**
   * Map pipeline stage to _meta.stage string
   */
  private mapPipelineStageToMetaStage(pipelineStage: string): 'initial-intake' | 'preliminary-analysis' | 'full-underwriting' | 'ic-review' {
    if (['A-initial-intake', 'B-preliminary-analysis'].includes(pipelineStage)) {
      return 'initial-intake';
    } else if (['C-full-underwriting'].includes(pipelineStage)) {
      return 'preliminary-analysis';
    } else if (['D-ic-review', 'E-loi-psa'].includes(pipelineStage)) {
      return 'full-underwriting';
    } else {
      return 'ic-review';
    }
  }
  
  /**
   * Update the Analysis Journey with pipeline movement information
   */
  private async updateAnalysisJourney(
    dealPath: string, 
    deal: Deal, 
    stageName: string, 
    substate: string
  ): Promise<void> {
    try {
      // Ensure AnalysisJourney directory exists
      const journeyDir = join(dealPath, 'AnalysisJourney');
      await mkdir(journeyDir, { recursive: true });
      
      // Read existing journey if it exists
      let journeyContent = '';
      try {
        journeyContent = await readFile(join(journeyDir, 'AnalysisJourney.md'), 'utf-8');
      } catch (error) {
        // Create new journey if it doesn't exist
        journeyContent = `# Analysis Journey: ${deal.propertyName}\n\n`;
        journeyContent += `**Deal ID:** ${deal.id}  \n`;
        journeyContent += `**Created:** ${deal._meta?.createdAt || new Date().toISOString()}  \n`;
        journeyContent += `**Status:** ${deal._meta?.overallStatus || 'active'}\n\n`;
        journeyContent += `---\n\n`;
        journeyContent += `## Deal Processing Log\n\n`;
      }
      
      // Add pipeline movement entry
      const timestamp = new Date();
      journeyContent += `### Pipeline Movement - ${timestamp.toLocaleString()}\n`;
      journeyContent += `🔄 **Deal moved to ${stageName}/${substate}**\n`;
      journeyContent += `- Previous location: ${deal._meta?.pipelineStage || 'processed-deals'}/${deal._meta?.pipelineSubstate || 'N/A'}\n`;
      journeyContent += `- Current stage: ${this.stageNameToNumber[stageName] || 0}\n`;
      journeyContent += `- Status: ${substate.toUpperCase()}\n\n`;
      
      // Write updated journey
      await writeFile(
        join(journeyDir, 'AnalysisJourney.md'),
        journeyContent
      );
      
      console.log(`📝 Updated Analysis Journey with pipeline movement`);
    } catch (error) {
      console.error('Error updating Analysis Journey:', error);
    }
  }
  
  /**
   * Get all deals in a specific pipeline stage and substate
   */
  async getDealsInPipelineStage(stage: string, substate: string): Promise<string[]> {
    const stagePath = join(this.pipelineRoot, stage);
    const substatePath = join(stagePath, substate);
    
    try {
      const deals = await readdir(substatePath);
      return deals.map(deal => join(substatePath, deal));
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Get all deals in processed-deals
   */
  async getProcessedDeals(): Promise<string[]> {
    try {
      const deals = await readdir(this.processedDealsPath);
      return deals.map(deal => join(this.processedDealsPath, deal));
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Get the current pipeline stage and substate for a deal
   */
  async getDealPipelineStatus(dealId: string): Promise<{ 
    stage: string; 
    substate: string;
    path: string;
  } | null> {
    const dealPath = await this.findDealInPipeline(dealId);
    
    if (!dealPath) {
      return null;
    }
    
    try {
      const dealData = await readFile(join(dealPath, 'deal.json'), 'utf-8');
      const deal = JSON.parse(dealData);
      
      if (deal._meta.pipelineStage && deal._meta.pipelineSubstate) {
        return {
          stage: deal._meta.pipelineStage,
          substate: deal._meta.pipelineSubstate,
          path: dealPath
        };
      }
      
      // If not in pipeline, check if in processed-deals
      if (dealPath.includes(this.processedDealsPath)) {
        return {
          stage: 'processed-deals',
          substate: 'N/A',
          path: dealPath
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}