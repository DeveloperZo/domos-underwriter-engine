import { ParsedRentRoll, ParsedFinancials } from '../types/deal-structure.js';
export declare class ExcelParser {
    /**
     * Parse rent roll Excel file to extract unit and tenant information
     */
    parseRentRoll(filePath: string): Promise<ParsedRentRoll | null>;
    /**
     * Parse financial statements (T12) to extract income and expense data
     */
    parseFinancials(filePath: string): Promise<ParsedFinancials | null>;
    private findHeaderRow;
    private parseRentRollUnits;
    private createHeaderMap;
    private parseRentRollRow;
    private calculateRentRollSummary;
    private extractIncomeData;
    private extractExpenseData;
    private calculateNOI;
    private determinePeriod;
    private getCellValue;
    private parseNumber;
    private findNumericValue;
}
//# sourceMappingURL=excel-parser.d.ts.map