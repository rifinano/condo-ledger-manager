
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
    const rows = csvText.split('\n');
    const dataRows = rows.slice(1).filter(row => row.trim() !== '');
    const parsedValues: string[][] = [];
    const errors: string[] = [];
    
    for (const row of dataRows) {
      const values: string[] = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue);
      
      const cleanValues = values.map(val => val.replace(/^"(.*)"$/, '$1'));
      
      if (cleanValues.length < 4) {
        errors.push(`Invalid data format: ${row}`);
        continue;
      }
      
      parsedValues.push(cleanValues);
    }
    
    return { values: parsedValues, errors };
  } catch (error) {
    return { 
      values: [], 
      errors: [`Error processing file: ${error instanceof Error ? error.message : String(error)}`] 
    };
  }
};
