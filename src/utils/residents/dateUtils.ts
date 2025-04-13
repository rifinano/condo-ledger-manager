
import { ResidentFormData } from '@/services/residents/types';

/**
 * Function to parse month names, numbers, or abbreviations into standard format
 */
export const parseMonth = (moveInMonthName: string | undefined, months: { value: string; label: string }[]): string => {
  if (!moveInMonthName) {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
  }
  
  // Try to match by label first (full month name)
  const monthByLabel = months.find(m => 
    m.label.toLowerCase() === moveInMonthName.toLowerCase())?.value;
  if (monthByLabel) return monthByLabel;
  
  // Then try to match by value (already formatted)
  const monthByValue = months.find(m => m.value === moveInMonthName)?.value;
  if (monthByValue) return monthByValue;
  
  // Then try to match by common abbreviations
  const monthAbbreviations: Record<string, string> = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  const abbr = moveInMonthName.toLowerCase().substring(0, 3);
  if (abbr in monthAbbreviations) {
    return monthAbbreviations[abbr];
  }
  
  // Try to parse as a number
  if (!isNaN(parseInt(moveInMonthName))) {
    const monthNum = parseInt(moveInMonthName);
    if (monthNum >= 1 && monthNum <= 12) {
      return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    }
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
  const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = row;
  
  const moveInMonth = parseMonth(moveInMonthName, months);
  const currentYear = new Date().getFullYear().toString();
  
  return {
    full_name: fullName,
    phone_number: phoneNumber || '',
    block_number: blockNumber,
    apartment_number: apartmentNumber,
    move_in_month: moveInMonth,
    move_in_year: moveInYear || currentYear
  };
};
