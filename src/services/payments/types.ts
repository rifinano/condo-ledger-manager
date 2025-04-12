
export interface Payment {
  id: string;
  resident_id: string;
  amount: number;
  payment_date: string;
  payment_for_month: string;
  payment_for_year: string;
  payment_type: string;
  payment_method: string;
  payment_status: "paid" | "unpaid"; 
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  charge_id?: string | null; // Added charge_id field
  residentName?: string; // Added after join
  block?: string; // Added after join
  apartment?: string; // Added after join
}

export interface Resident {
  id: string;
  full_name: string;
  phone_number?: string | null;
  block_number: string;
  apartment_number: string;
  created_at: string;
  updated_at: string;
}

export interface TogglePaymentStatusResult {
  success: boolean;
  error?: string;
}

export interface AddPaymentResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Define a type for the payment form data to ensure consistent typing
export interface PaymentFormData {
  resident_id: string;
  amount: number;
  payment_date: string;
  payment_for_month: string;
  payment_for_year: string;
  payment_type: string;
  payment_method: string;
  notes?: string | null;
}
