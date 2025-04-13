
/**
 * This file re-exports all import utilities for backward compatibility
 */

// Re-export from date utilities
export { parseMonth, prepareResidentData } from './dateUtils';

// Re-export from conflict utilities
export { getExistingResidentDetails, detectImportConflicts } from './conflictUtils';

// Re-export from apartment utilities
export { 
  doesBlockExist, 
  doesApartmentExist, 
  getBlockId,
  getBlockApartments,
  hasAvailableApartments,
  getMissingApartments
} from './apartmentUtils';
