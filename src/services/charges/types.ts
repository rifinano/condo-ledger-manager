
export interface Charge {
  id: string;
  name: string;
  amount: number;
  description: string | null;
  period: string;
  charge_type: string;
  created_at: string;
  updated_at: string;
}

export interface ChargeFormData {
  name: string;
  amount: number;
  description: string;
  period: string;
  charge_type: string;
}

export interface AddChargeResult {
  success: boolean;
  data?: any;
  error?: string;
}
