
import { Resident, ResidentFormData } from "@/services/residents/types";

/**
 * Utility functions for handling CSV import/export for residents
 */

/**
 * Generate and download a CSV file of resident data
 */
export const downloadResidentsCsv = (
  residents: Resident[],
  months: { value: string; label: string }[]
) => {
  if (residents.length === 0) return;

  const headers = ["Name", "Phone", "Block", "Apartment", "Move-in Month", "Move-in Year"];
  const csvContent = [
    headers.join(","),
    ...residents.map(resident => [
      `"${resident.full_name}"`,
      `"${resident.phone_number || ""}"`,
      `"${resident.block_number}"`,
      `"${resident.apartment_number}"`,
      `"${resident.move_in_month ? months.find(m => m.value === resident.move_in_month)?.label || resident.move_in_month : ""}"`,
      `"${resident.move_in_year || ""}"`
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `residents_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Parse a CSV text file into structured data
 */
export const parseResidentsCsv = (csvText: string): { 
  values: string[][],
  errors: string[]
} => {
  try {
    // Split the CSV content into rows
    const rows = csvText.split(/\r?\n/);
    
    // Check if we have at least a header row
    if (rows.length === 0) {
      return { values: [], errors: ["Empty file"] };
    }
    
    // Skip the header row and filter out empty rows
    const dataRows = rows.slice(1).filter(row => row.trim() !== '');
    const parsedValues: string[][] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      // Handle CSV parsing with or without quotes
      let values: string[] = [];
      let inQuotes = false;
      let currentValue = '';
      
      // For tab-delimited files
      if (row.includes('\t')) {
        values = row.split('\t').map(val => val.trim());
      } else {
        // For comma-delimited files with possible quotes
        for (let j = 0; j < row.length; j++) {
          const char = row[j];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        // Don't forget the last value
        values.push(currentValue.trim());
      }
      
      // Remove quotes from values if present
      const cleanValues = values.map(val => {
        const trimmed = val.trim();
        return trimmed.replace(/^"(.*)"$/, '$1');
      });
      
      // Check if we have enough columns
      if (cleanValues.length < 4) {
        errors.push(`Row ${i + 2}: Missing required columns. Found ${cleanValues.length} columns, need at least 4.`);
        continue;
      }
      
      parsedValues.push(cleanValues);
    }
    
    return { values: parsedValues, errors };
  } catch (error) {
    console.error("CSV parsing error:", error);
    return { 
      values: [], 
      errors: [`Error processing file: ${error instanceof Error ? error.message : String(error)}`] 
    };
  }
};
