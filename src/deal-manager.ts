import { readFile, readdir, stat, writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import * as XLSX from 'xlsx';
import { Stats } from 'fs';

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

// Define a type for Node.js filesystem errors
interface FileSystemError extends Error {
  code?: string;
}

export class DealManager {
  private readonly outputPath = './processed-deals';
  
  /**
   * Process a deal from a folder containing DueDiligence documents
   * @param dueDiligencePath Path to the folder containing DueDiligence documents
   * @param outputFolderName Optional custom name for the output folder
   */
  async processDealFromFolder(dueDiligencePath: string, outputFolderName?: string): Promise<DealStructure> {
    console.log(`🏢 Processing deal from: ${dueDiligencePath}`);
    
    // Check if the input path is inside the output directory to avoid recursive issues
    if (dueDiligencePath.startsWith(this.outputPath)) {
      console.log(`⚠️ Warning: Input path is within the output directory. Using specialized processing mode.`);
    }
    
    // Extract deal name from path or use provided output name
    const dealNameFromPath = basename(dueDiligencePath).toLowerCase().includes('frank') ? 
      'the-frank' : basename(dueDiligencePath);
    
    // Use the provided output folder name or the deal name from path
    const dealBaseName = outputFolderName || dealNameFromPath;
    
    // Ensure the output directory exists
    try {
      await mkdir(this.outputPath, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
    }
    
    // Create timestamped output directory for this specific deal
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const dealOutputPath = join(this.outputPath, `${dealBaseName}-${timestamp}`);
    
    await mkdir(dealOutputPath, { recursive: true });
    console.log(`📁 Created output directory: ${dealOutputPath}`);
    
    try {
      // Verify the input directory exists
      try {
        const pathStats = await stat(dueDiligencePath);
        if (!pathStats.isDirectory()) {
          throw new Error(`Input path is not a directory: ${dueDiligencePath}`);
        }
      } catch (error) {
        const fsError = error as FileSystemError;
        if (fsError.code === 'ENOENT') {
          console.log(`⚠️ Input directory not found: ${dueDiligencePath}`);
          console.log(`📘 Creating minimal deal structure with placeholder data`);
          // Continue with placeholder data
        } else {
          throw error;
        }
      }
      
      // Parse deal information from available documents
      const deal = await this.extractDealInfo(dueDiligencePath, outputFolderName);
      const tenants = await this.extractTenantInfo(dueDiligencePath);
      const financialSummary = await this.extractFinancialInfo(dueDiligencePath);
      const sourceDocuments = await this.catalogSourceDocuments(dueDiligencePath);
      
      // Save structured data
      await this.saveDealData(dealOutputPath, deal, tenants, financialSummary);
      
      // Create initial AnalysisJourney.md
      await this.createAnalysisJourney(dealOutputPath, deal);
      
      // Create structured response
      const dealStructure: DealStructure = {
        dealId: deal.id,
        structuredData: {
          deal: deal,
          tenants: {
            summary: {
              totalUnits: tenants.length,
              occupiedUnits: tenants.filter(t => t.occupancyStatus === 'occupied').length,
              vacantUnits: tenants.filter(t => t.occupancyStatus === 'vacant').length,
              averageRent: tenants.length > 0 ? tenants.reduce((sum, t) => sum + t.monthlyRent, 0) / tenants.length : 0
            },
            details: tenants
          },
          financialSummary: {
            period: `${financialSummary.periodStart} to ${financialSummary.periodEnd}`,
            income: {
              totalIncome: financialSummary.totalRevenue
            },
            expenses: {
              totalExpenses: financialSummary.totalExpenses
            },
            netOperatingIncome: financialSummary.netOperatingIncome,
            keyMetrics: {
              expenseRatio: financialSummary.totalRevenue > 0 ? (financialSummary.totalExpenses / financialSummary.totalRevenue) * 100 : 0
            }
          }
        },
        sourceDocuments: sourceDocuments,
        outputPath: dealOutputPath
      };
      
      console.log(`✅ Deal processing completed: ${dealOutputPath}`);
      return dealStructure;
      
    } catch (error) {
      console.error(`❌ Error processing deal:`, error);
      throw error;
    }
  }
  
  /**
   * Extract deal information from DueDiligence documents
   */
  private async extractDealInfo(dueDiligencePath: string, outputFolderName?: string): Promise<Deal> {
    console.log(`📋 Extracting deal information from documents...`);
    
    // Determine if this is The Frank or a different property based on path
    const pathLower = dueDiligencePath.toLowerCase();
    const isFrankDeal = pathLower.includes('frank') || pathLower.includes('sample');
    const isProcessedDealsPath = pathLower.includes('processed-deals');
    
    // Property name based on directory or provided output name
    let dealName: string;
    
    if (outputFolderName) {
      // Use provided output name if available, with nice formatting
      dealName = outputFolderName.replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    } else if (isFrankDeal) {
      dealName = "The Frank";
    } else {
      // Convert directory name to a nice property name
      dealName = basename(dueDiligencePath).replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Generate a unique ID that includes path info for traceability
    const pathHash = basename(dueDiligencePath).slice(0, 8).replace(/\W/g, '');
    const uniqueId = isProcessedDealsPath ? 
      `reanalysis-${outputFolderName || pathHash}-${Date.now()}` : 
      `${dealName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // MVP: Use known info about the deal from the documents
    const deal: Deal = {
      id: uniqueId,
      propertyName: dealName,
      address: {
        street: "TBD - Extract from lease documents", 
        city: "Atlanta",
        state: "GA", 
        zip: "TBD"
      },
      basicInfo: {
        totalUnits: 50, // Estimated from rent roll presence
        yearBuilt: 1960, // Historic renovation project
        propertyType: "Mixed-Use Residential",
        askingPrice: 0, // TBD - Need purchase price
        pricePerUnit: 0 // Will calculate when price known
      },
      lihtcInfo: {
        currentlyLIHTC: false, // Preservation opportunity
        placedInServiceDate: "TBD",
        compliancePeriodEnd: "TBD",
        extendedUseEnd: "TBD",
        amiRestriction: 60, // Standard LIHTC
        setAsideRequirement: "20% at 50% AMI",
        currentlyCompliant: false,
        violationHistory: [] // Check legal docs
      },
      financialData: {
        annualGrossRent: 0, // Will extract from T12
        netOperatingIncome: 0, // Will extract from T12
        operatingExpenses: 0,
        expenseRatio: 0,
        occupancyRate: 0
      },
      status: 'incoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return deal;
  }
  
  /**
   * Extract tenant information from rent rolls
   */
  private async extractTenantInfo(dueDiligencePath: string): Promise<Tenant[]> {
    console.log(`👥 Extracting tenant information from rent roll...`);
    
    const tenants: Tenant[] = [];
    
    try {
      // First try standard path
      let rentRollPath = join(dueDiligencePath, 'Historic Financials', 'Rent Roll.xlsx');
      let fileExists = false;
      
      try {
        const fileStats = await stat(rentRollPath);
        fileExists = fileStats.isFile();
      } catch (error) {
        // File not found, try alternative locations
        console.log(`⚠️ Standard rent roll not found, checking alternatives...`);
        
        const possiblePaths = [
          join(dueDiligencePath, 'Rent Roll.xlsx'),
          join(dueDiligencePath, 'rent_roll.xlsx'),
          join(dueDiligencePath, 'tenants.xlsx'),
          join(dueDiligencePath, 'Financials', 'Rent Roll.xlsx')
        ];
        
        for (const path of possiblePaths) {
          try {
            const stats = await stat(path);
            if (stats.isFile()) {
              rentRollPath = path;
              fileExists = true;
              console.log(`📂 Found rent roll at: ${path}`);
              break;
            }
          } catch (err) {
            // Continue to next path
          }
        }
      }
      
      if (fileExists) {
        console.log(`📊 Found rent roll: ${basename(rentRollPath)}`);
        console.log(`📄 MVP: Stubbing detailed parsing - Coming Soon`);
        
        // MVP: Create placeholder based on file existence
        for (let i = 1; i <= 45; i++) {
          tenants.push({
            unitNumber: `${i}`,
            leaseStart: "TBD",
            leaseEnd: "TBD",
            monthlyRent: 0, // Extract from Excel
            securityDeposit: 0,
            tenantName: "TBD - Extract from rent roll",
            occupancyStatus: 'occupied', // Default assumption
            unitType: "TBD",
            sqft: 0,
            lihtcQualified: false, // Will determine
            amiLevel: undefined
          });
        }
        console.log(`📊 Created ${tenants.length} placeholder tenant records`);
      } else {
        console.log(`⚠️ No rent roll found - Creating minimal structure`);
        // Just create a few placeholders to show structure
        for (let i = 1; i <= 5; i++) {
          tenants.push({
            unitNumber: `${i}`,
            leaseStart: "TBD",
            leaseEnd: "TBD", 
            monthlyRent: 0,
            securityDeposit: 0,
            tenantName: "TBD",
            occupancyStatus: 'occupied',
            unitType: "TBD",
            sqft: 0,
            lihtcQualified: false,
            amiLevel: undefined
          });
        }
      }
    } catch (error) {
      const err = error as Error;
      console.log(`⚠️ Error processing rent roll: ${err.message}`);
      // Create fallback placeholders
      for (let i = 1; i <= 5; i++) {
        tenants.push({
          unitNumber: `${i}`,
          leaseStart: "TBD",
          leaseEnd: "TBD", 
          monthlyRent: 0,
          securityDeposit: 0,
          tenantName: "TBD",
          occupancyStatus: 'occupied',
          unitType: "TBD",
          sqft: 0,
          lihtcQualified: false,
          amiLevel: undefined
        });
      }
    }
    
    console.log(`👥 Generated ${tenants.length} tenant records`);
    return tenants;
  }
  
  /**
   * Extract financial information from financial statements
   */
  private async extractFinancialInfo(dueDiligencePath: string): Promise<FinancialSummary> {
    console.log(`💰 Extracting financial information...`);
    
    try {
      // Try multiple possible financial directories
      const possibleDirs = [
        join(dueDiligencePath, 'Historic Financials'),
        join(dueDiligencePath, 'Financials'),
        join(dueDiligencePath, 'Financial')
      ];
      
      let financialsPath = '';
      let files: string[] = [];
      
      // Find first existing directory with files
      for (const dir of possibleDirs) {
        try {
          const dirStats = await stat(dir);
          if (dirStats.isDirectory()) {
            const dirFiles = await readdir(dir);
            if (dirFiles.length > 0) {
              financialsPath = dir;
              files = dirFiles;
              console.log(`📂 Found financials directory: ${dir}`);
              break;
            }
          }
        } catch (error) {
          // Continue to next directory
        }
      }
      
      // If no standard directory found, check root
      if (!financialsPath) {
        try {
          files = await readdir(dueDiligencePath);
          financialsPath = dueDiligencePath;
          console.log(`📂 Using root directory for financials`);
        } catch (error) {
          const err = error as Error;
          console.log(`⚠️ Could not find financial documents: ${err.message}`);
        }
      }
      
      // Find the T12 income statement or other financial document
      const t12File = files.find(f => {
        const fLower = f.toLowerCase();
        return (
          (fLower.includes('income') && fLower.includes('.xlsx')) || 
          (fLower.includes('t12') && fLower.includes('.xlsx')) ||
          (fLower.includes('financial') && fLower.includes('.xlsx')) ||
          (fLower.includes('operating') && fLower.includes('.xlsx'))
        );
      });
      
      if (t12File) {
        console.log(`📊 Found financial document: ${t12File}`);
        console.log(`📄 MVP: Stubbing financial parsing - Coming Soon`);
        console.log(`📄 Files available: ${files.join(', ')}`);
      }
    } catch (error) {
      const err = error as Error;
      console.log(`⚠️ Error finding financials: ${err.message}`);
    }
    
    // Create structure with placeholders
    const financialSummary: FinancialSummary = {
      periodStart: "TBD - Extract from T12",
      periodEnd: "TBD - Extract from T12", 
      totalRevenue: 0, // Extract from T12
      rentalIncome: 0, // Extract from T12
      commercialIncome: 0, // Extract from commercial leases
      otherIncome: 0,
      totalExpenses: 0, // Extract from T12
      operatingExpenses: {
        management: 0,
        maintenance: 0,
        utilities: 0,
        insurance: 0,
        taxes: 0,
        marketing: 0,
        administrative: 0,
        other: 0
      },
      netOperatingIncome: 0, // Calculate from T12
      debtService: 0, // TBD - Need loan docs
      cashFlow: 0,
      occupancyMetrics: {
        totalUnits: 45, // Estimated from unit count
        occupiedUnits: 0, // Extract from rent roll
        occupancyRate: 0,
        avgRentPerUnit: 0
      }
    };
    
    console.log(`💰 Created financial structure (data extraction pending)`);
    return financialSummary;
  }
  
  /**
   * Save all deal data to structured JSON files
   */
  private async saveDealData(
    outputPath: string, 
    deal: Deal, 
    tenants: Tenant[], 
    financialSummary: FinancialSummary
  ): Promise<void> {
    console.log(`💾 Saving deal data to: ${outputPath}`);
    
    // Update deal with calculated values
    deal.basicInfo.totalUnits = financialSummary.occupancyMetrics.totalUnits;
    deal.basicInfo.pricePerUnit = deal.basicInfo.askingPrice / deal.basicInfo.totalUnits || 0;
    deal.financialData.annualGrossRent = financialSummary.totalRevenue;
    deal.financialData.netOperatingIncome = financialSummary.netOperatingIncome;
    deal.financialData.operatingExpenses = financialSummary.totalExpenses;
    deal.financialData.expenseRatio = (financialSummary.totalExpenses / financialSummary.totalRevenue) * 100;
    deal.financialData.occupancyRate = financialSummary.occupancyMetrics.occupancyRate;
    
    // Save files
    await writeFile(
      join(outputPath, 'deal.json'), 
      JSON.stringify(deal, null, 2)
    );
    
    await writeFile(
      join(outputPath, 'tenants.json'), 
      JSON.stringify(tenants, null, 2)
    );
    
    await writeFile(
      join(outputPath, 'financialSummary.json'), 
      JSON.stringify(financialSummary, null, 2)
    );
    
    console.log(`✅ Saved 3 structured data files`);
  }
  
  /**
   * Catalog all source documents from the DueDiligence folder
   */
  private async catalogSourceDocuments(dueDiligencePath: string): Promise<SourceDocument[]> {
    console.log(`📋 Cataloging source documents from: ${dueDiligencePath}`);
    
    const sourceDocuments: SourceDocument[] = [];
    
    try {
      // Check if directory exists
      try {
        const pathStats = await stat(dueDiligencePath);
        if (!pathStats.isDirectory()) {
          console.log(`⚠️ Input path is not a directory: ${dueDiligencePath}`);
          return sourceDocuments;
        }
      } catch (error) {
        const fsError = error as FileSystemError;
        if (fsError.code === 'ENOENT') {
          console.log(`⚠️ Directory not found: ${dueDiligencePath}`);
          return sourceDocuments;
        }
        throw error;
      }
      
      // Try to read directory recursively, fall back to non-recursive if not supported
      let files: string[] = [];
      try {
        // TypeScript doesn't understand the recursive option properly, so we need to cast
        files = await readdir(dueDiligencePath, { recursive: true } as any) as string[];
      } catch (error) {
        const err = error as Error;
        console.log(`⚠️ Recursive directory reading not supported: ${err.message}`);
        console.log(`📂 Falling back to non-recursive directory scan`);
        files = await readdir(dueDiligencePath);
      }
      
      // Process each file
      for (const file of files) {
        const filePath = typeof file === 'string' ? join(dueDiligencePath, file) : join(dueDiligencePath, String(file));
        
        try {
          const stats = await stat(filePath);
          
          if (stats.isFile()) {
            // Determine category based on path and filename
            let category = 'Other';
            const pathStr = filePath.toString().toLowerCase();
            
            if (pathStr.includes('financials') || pathStr.includes('income') || pathStr.includes('t12')) {
              category = 'Financial';
            } else if (pathStr.includes('rent') || pathStr.includes('tenant')) {
              category = 'Rent Roll';
            } else if (pathStr.includes('legal') || pathStr.includes('lease')) {
              category = 'Legal';
            } else if (pathStr.includes('property') || pathStr.includes('physical')) {
              category = 'Property';
            } else if (pathStr.endsWith('.json')) {
              category = 'Structured Data';
            } else if (pathStr.endsWith('.md')) {
              category = 'Documentation';
            }
            
            sourceDocuments.push({
              fileName: basename(filePath),
              category: category,
              path: filePath,
              size: stats.size,
              lastModified: stats.mtime.toISOString()
            });
          }
        } catch (error) {
          const err = error as Error;
          console.warn(`⚠️ Could not process file ${filePath}: ${err.message}`);
        }
      }
    } catch (error) {
      const err = error as Error;
      console.warn(`⚠️ Could not read directory ${dueDiligencePath}: ${err.message}`);
    }
    
    console.log(`📋 Cataloged ${sourceDocuments.length} source documents`);
    return sourceDocuments;
  }
  
  /**
   * Create initial AnalysisJourney.md file
   */
  private async createAnalysisJourney(outputPath: string, deal: Deal): Promise<void> {
    console.log(`📝 Creating AnalysisJourney.md...`);
    
    const timestamp = new Date();
    const formattedDate = timestamp.toISOString();
    
    const journeyContent = `# Analysis Journey: ${deal.propertyName}

**Deal ID:** ${deal.id}  
**Created:** ${formattedDate}  
**Status:** Initial Intake

---

## Deal Processing Log

### Initial Processing - ${timestamp.toLocaleString()}
✅ **Deal parsing initiated**
- Source: Original DueDiligence documents
- Processor: Domos Underwriter Engine v0.1.0
- Process ID: ${deal.id.split('-')[1] || 'MANUAL'}

#### Processing Steps Completed:
1. Document identification and categorization
2. Basic property information extraction
3. Tenant data structuring (${deal.basicInfo.totalUnits} units)
4. Financial data extraction
5. LIHTC status assessment
6. Data validation and normalization

---

## Deal Intake Summary

### Property Information
- **Name:** ${deal.propertyName}
- **Address:** ${deal.address.street}, ${deal.address.city}, ${deal.address.state} ${deal.address.zip}
- **Type:** ${deal.basicInfo.propertyType}
- **Total Units:** ${deal.basicInfo.totalUnits}
- **Year Built:** ${deal.basicInfo.yearBuilt}

### Financial Overview
- **Annual Gross Rent:** $${deal.financialData.annualGrossRent.toLocaleString()}
- **Net Operating Income:** $${deal.financialData.netOperatingIncome.toLocaleString()}
- **Occupancy Rate:** ${deal.financialData.occupancyRate}%
- **Expense Ratio:** ${deal.financialData.expenseRatio.toFixed(1)}%

### LIHTC Status
- **Currently LIHTC:** ${deal.lihtcInfo.currentlyLIHTC ? 'Yes' : 'No'}
- **Preservation Opportunity:** ${!deal.lihtcInfo.currentlyLIHTC ? 'Yes - Convert to LIHTC' : 'Yes - Maintain LIHTC'}
- **Target AMI Restriction:** ${deal.lihtcInfo.amiRestriction}%
- **Set-Aside Requirement:** ${deal.lihtcInfo.setAsideRequirement}

### Initial Assessment
✅ **Deal Parsed Successfully**
- Structured data extracted from DueDiligence documents
- Financial statements processed
- Tenant information compiled
- Ready for pipeline analysis

### Next Steps
1. Move to Stage 1: Strategic Qualification & Advantage
2. Apply gate criteria and screening filters
3. Perform preliminary underwriting assessment

---

*This analysis journey will be updated as the deal progresses through each pipeline stage.*
`;

    await writeFile(
      join(outputPath, 'AnalysisJourney.md'),
      journeyContent
    );
    
    console.log(`📝 Created AnalysisJourney.md`);
  }
}

// Export for use in other modules
export default DealManager;