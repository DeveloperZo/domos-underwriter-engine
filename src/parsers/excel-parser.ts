import * as XLSX from 'xlsx';
import { readFileSync, statSync } from 'fs';
import { ParsedRentRoll, ParsedFinancials, UnitInfo } from '../types/deal-structure.js';

export class ExcelParser {
  /**
   * Parse rent roll Excel file to extract unit and tenant information
   */
  async parseRentRoll(filePath: string): Promise<ParsedRentRoll | null> {
    try {
      console.log(`Parsing rent roll: ${filePath}`);
      
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use first sheet
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (rawData.length < 2) {
        console.warn('Rent roll appears to be empty or malformed');
        return null;
      }
      
      // Find header row and data rows
      const headerRow = this.findHeaderRow(rawData);
      if (headerRow === -1) {
        console.warn('Could not find header row in rent roll');
        return null;
      }
      
      const headers = rawData[headerRow] as string[];
      const dataRows = rawData.slice(headerRow + 1);
      
      // Parse units
      const units = this.parseRentRollUnits(headers, dataRows);
      
      // Calculate summary
      const summary = this.calculateRentRollSummary(units);
      
      console.log(`Parsed ${units.length} units from rent roll`);
      
      return {
        units,
        summary
      };
      
    } catch (error) {
      console.error(`Error parsing rent roll ${filePath}:`, error);
      return null;
    }
  }
  
  /**
   * Parse financial statements (T12) to extract income and expense data
   */
  async parseFinancials(filePath: string): Promise<ParsedFinancials | null> {
    try {
      console.log(`Parsing financials: ${filePath}`);
      
      const workbook = XLSX.readFile(filePath);
      
      // Look for financial data in multiple possible sheets
      const potentialSheets = workbook.SheetNames.filter(name => 
        name.toLowerCase().includes('income') || 
        name.toLowerCase().includes('financial') ||
        name.toLowerCase().includes('t12') ||
        name.toLowerCase().includes('statement')
      );
      
      const sheetName = potentialSheets[0] || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      // Extract financial data
      const income = this.extractIncomeData(rawData);
      const expenses = this.extractExpenseData(rawData);
      const noi = this.calculateNOI(income, expenses);
      
      // Determine period from filename or sheet
      const period = this.determinePeriod(filePath, sheetName);
      
      console.log(`Parsed financials for period: ${period}`);
      
      return {
        period,
        income,
        expenses,
        netOperatingIncome: noi
      };
      
    } catch (error) {
      console.error(`Error parsing financials ${filePath}:`, error);
      return null;
    }
  }
  
  private findHeaderRow(data: any[][]): number {
    // Look for common rent roll header indicators
    const indicators = ['unit', 'tenant', 'rent', 'sqft', 'bedroom'];
    
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i];
      if (!row) continue;
      
      const rowStr = row.join('').toLowerCase();
      const matchCount = indicators.filter(indicator => 
        rowStr.includes(indicator)
      ).length;
      
      if (matchCount >= 2) {
        return i;
      }
    }
    
    return -1;
  }
  
  private parseRentRollUnits(headers: string[], dataRows: any[][]): UnitInfo[] {
    const units: UnitInfo[] = [];
    
    // Map headers to expected fields
    const headerMap = this.createHeaderMap(headers);
    
    for (const row of dataRows) {
      if (!row || row.length === 0) continue;
      
      const unit = this.parseRentRollRow(headerMap, row);
      if (unit && unit.unitNumber) {
        units.push(unit);
      }
    }
    
    return units;
  }
  
  private createHeaderMap(headers: string[]): Record<string, number> {
    const map: Record<string, number> = {};
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]?.toString().toLowerCase().trim();
      if (!header) continue;
      
      // Map common header variations to standard fields
      if (header.includes('unit') && !header.includes('type')) {
        map.unitNumber = i;
      } else if (header.includes('unit') && header.includes('type')) {
        map.unitType = i;
      } else if (header.includes('bedroom') || header.includes('br')) {
        map.unitType = i;
      } else if (header.includes('rent') && !header.includes('market')) {
        map.currentRent = i;
      } else if (header.includes('market') && header.includes('rent')) {
        map.marketRent = i;
      } else if (header.includes('tenant') && !header.includes('type')) {
        map.tenantName = i;
      } else if (header.includes('sqft') || header.includes('sq ft')) {
        map.squareFeet = i;
      } else if (header.includes('lease') && header.includes('start')) {
        map.leaseStart = i;
      } else if (header.includes('lease') && header.includes('end')) {
        map.leaseEnd = i;
      }
    }
    
    return map;
  }
  
  private parseRentRollRow(headerMap: Record<string, number>, row: any[]): UnitInfo | null {
    try {
      const unitNumber = this.getCellValue(row, headerMap.unitNumber)?.toString().trim();
      if (!unitNumber) return null;
      
      const currentRent = this.parseNumber(this.getCellValue(row, headerMap.currentRent)) || 0;
      const tenantName = this.getCellValue(row, headerMap.tenantName)?.toString().trim();
      
      return {
        unitNumber,
        unitType: this.getCellValue(row, headerMap.unitType)?.toString().trim() || 'Unknown',
        squareFeet: this.parseNumber(this.getCellValue(row, headerMap.squareFeet)),
        currentRent,
        marketRent: this.parseNumber(this.getCellValue(row, headerMap.marketRent)),
        tenantName: tenantName || undefined,
        leaseStart: this.getCellValue(row, headerMap.leaseStart)?.toString().trim(),
        leaseEnd: this.getCellValue(row, headerMap.leaseEnd)?.toString().trim(),
        isOccupied: !!tenantName && tenantName.toLowerCase() !== 'vacant',
        isLIHTC: false, // Will be determined later based on unit type or other data
        amiLevel: undefined
      };
    } catch (error) {
      console.warn('Error parsing rent roll row:', error);
      return null;
    }
  }
  
  private calculateRentRollSummary(units: UnitInfo[]) {
    const occupiedUnits = units.filter(u => u.isOccupied);
    const totalMonthlyRent = units.reduce((sum, u) => sum + (u.currentRent || 0), 0);
    
    return {
      totalUnits: units.length,
      occupiedUnits: occupiedUnits.length,
      vacantUnits: units.length - occupiedUnits.length,
      totalMonthlyRent,
      averageRent: units.length > 0 ? totalMonthlyRent / units.length : 0
    };
  }
  
  private extractIncomeData(data: any[][]): Record<string, number> {
    const income: Record<string, number> = {};
    
    // Look for income section
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      const firstCol = row[0]?.toString().toLowerCase();
      if (!firstCol) continue;
      
      // Common income line items
      if (firstCol.includes('rental income') || firstCol.includes('rent income')) {
        income.grossRentalIncome = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('other income') || firstCol.includes('miscellaneous')) {
        income.otherIncome = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('total income') || firstCol.includes('gross income')) {
        income.totalIncome = this.findNumericValue(row) || 0;
      }
    }
    
    // Calculate total if not found
    if (!income.totalIncome) {
      income.totalIncome = (income.grossRentalIncome || 0) + (income.otherIncome || 0);
    }
    
    return income;
  }
  
  private extractExpenseData(data: any[][]): Record<string, number> {
    const expenses: Record<string, number> = {};
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      const firstCol = row[0]?.toString().toLowerCase();
      if (!firstCol) continue;
      
      // Common expense line items
      if (firstCol.includes('management') && firstCol.includes('fee')) {
        expenses.management = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('maintenance') || firstCol.includes('repair')) {
        expenses.maintenance = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('utilities')) {
        expenses.utilities = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('insurance')) {
        expenses.insurance = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('tax') && !firstCol.includes('income')) {
        expenses.taxes = this.findNumericValue(row) || 0;
      } else if (firstCol.includes('total expense') || firstCol.includes('total operating')) {
        expenses.totalExpenses = this.findNumericValue(row) || 0;
      }
    }
    
    // Calculate total if not found
    if (!expenses.totalExpenses) {
      expenses.totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
    }
    
    return expenses;
  }
  
  private calculateNOI(income: Record<string, number>, expenses: Record<string, number>): number {
    const totalIncome = income.totalIncome || 0;
    const totalExpenses = expenses.totalExpenses || 0;
    return totalIncome - totalExpenses;
  }
  
  private determinePeriod(filePath: string, sheetName: string): string {
    const fileName = filePath.toLowerCase();
    const sheet = sheetName.toLowerCase();
    
    if (fileName.includes('t12') || sheet.includes('t12')) {
      return 'T12';
    } else if (fileName.includes('2024') || sheet.includes('2024')) {
      return '2024';
    } else if (fileName.includes('2023') || sheet.includes('2023')) {
      return '2023';
    }
    
    return 'T12'; // Default
  }
  
  private getCellValue(row: any[], index: number): any {
    return index !== undefined && index >= 0 && index < row.length ? row[index] : null;
  }
  
  private parseNumber(value: any): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    
    const str = value.toString().replace(/[$,]/g, '');
    const num = parseFloat(str);
    
    return isNaN(num) ? undefined : num;
  }
  
  private findNumericValue(row: any[]): number | null {
    // Look for the first numeric value in the row (usually the amount)
    for (let i = 1; i < row.length; i++) {
      const num = this.parseNumber(row[i]);
      if (num !== undefined && num !== 0) {
        return num;
      }
    }
    return null;
  }
}
