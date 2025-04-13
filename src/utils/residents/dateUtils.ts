
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
  const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = row;
  
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
