
/**
 * Common resident types used across the application
 */

export interface ResidentApartment {
  block_number: string;
  apartment_number: string;
}

export interface Resident {
  id: string;
  full_name: string;
  phone_number?: string;
  block_number: string;  // Primary apartment block
  apartment_number: string;  // Primary apartment number
  apartments?: ResidentApartment[];  // All apartments
  created_at: string;
  updated_at: string;
}

export interface ResidentFormData {
  full_name: string;
  phone_number?: string;
  block_number: string;
  apartment_number: string;
  move_in_month: string;
  move_in_year: string;
}

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
