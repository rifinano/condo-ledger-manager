
import { ResidentFormData } from '@/services/residents/types';

/**
 * Function to parse month names, numbers, or abbreviations into standard format
 */
export const parseMonth = (moveInMonthName: string | undefined, months: { value: string; label: string }[]): string => {
  if (!moveInMonthName || moveInMonthName.trim() === '') {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
  }
  
  const trimmedMonth = moveInMonthName.trim();
  
  // Try to match by label first (full month name)
  const monthByLabel = months.find(m => 
    m.label.toLowerCase() === trimmedMonth.toLowerCase())?.value;
  if (monthByLabel) return monthByLabel;
  
  // Then try to match by value (already formatted)
  const monthByValue = months.find(m => m.value === trimmedMonth)?.value;
  if (monthByValue) return monthByValue;
  
  // Then try to match by common abbreviations
  const monthAbbreviations: Record<string, string> = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  const abbr = trimmedMonth.toLowerCase().substring(0, 3);
  if (abbr in monthAbbreviations) {
    return monthAbbreviations[abbr];
  }
  
  // Try to parse as a number
  const parsedNum = parseInt(trimmedMonth);
  if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 12) {
    return parsedNum < 10 ? `0${parsedNum}` : `${parsedNum}`;
  }
  
  // Default to current month if no match
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
};

/**
 * Prepare resident data from CSV row
 */
export const prepareResidentData = (
  row: string[], 
  months: { value: string; label: string }[]
): Partial<ResidentFormData> => {
  // Default column mappings for normal CSV format
  let fullName = row[0];
  let phoneNumber = row[1];
  let blockNumber = row[2];
  let apartmentNumber = row[3];
  let moveInMonthName = row[4];
  let moveInYear = row[5];
  
  // Handle various CSV formats by trying to detect column positions
  // If the file seems incorrectly formatted, try to identify column contents by patterns
  if (!fullName && row.length > 1) {
    // If the first column is empty, check other columns
    for (let i = 1; i < row.length; i++) {
      if (row[i] && !fullName) {
        fullName = row[i];
        break;
      }
    }
  }
  
  if (!blockNumber && row.length > 2) {
    // Look for "Block" in any field
    for (let i = 0; i < row.length; i++) {
      if (row[i] && row[i].toLowerCase().includes('block')) {
        blockNumber = row[i];
        break;
      }
    }
  }
  
  // Try to parse month if it's not set
  if (!moveInMonthName && row.length > 2) {
    for (let i = 0; i < row.length; i++) {
      // Check if column might be a month name
      const possibleMonth = parseMonth(row[i], months);
      if (possibleMonth && parseInt(possibleMonth) > 0) {
        moveInMonthName = row[i];
        break;
      }
    }
  }
  
  // Try to parse year if it's not set
  if (!moveInYear && row.length > 2) {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < row.length; i++) {
      const yearValue = parseInt(row[i]);
      if (!isNaN(yearValue) && yearValue > 1900 && yearValue <= currentYear + 5) {
        moveInYear = row[i];
        break;
      }
    }
  }
  
  const moveInMonth = parseMonth(moveInMonthName, months);
  const currentYear = new Date().getFullYear().toString();
  
  return {
    full_name: fullName?.trim() || '',
    phone_number: phoneNumber?.trim() || '',
    block_number: blockNumber?.trim() || '',
    apartment_number: apartmentNumber?.trim() || '',
    move_in_month: moveInMonth,
    move_in_year: (moveInYear?.trim() && !isNaN(parseInt(moveInYear.trim()))) ? moveInYear.trim() : currentYear
  };
};
