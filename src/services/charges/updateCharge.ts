
import { supabase } from "@/integrations/supabase/client";
import { ChargeFormData } from "./types";

interface UpdateChargeResult {
  success: boolean;
  error?: string;
}

export const updateCharge = async (id: string, chargeData: ChargeFormData): Promise<UpdateChargeResult> => {
  try {
    console.log("Updating charge in database:", id, chargeData);
    
    const { error } = await supabase
      .from('charges')
      .update({
        name: chargeData.name,
        amount: chargeData.amount,
        description: chargeData.description || null,
        charge_type: chargeData.charge_type,
        period: chargeData.period,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Supabase error updating charge:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log("Charge successfully updated in Supabase");
    return { success: true };
  } catch (error: any) {
    console.error("Exception when updating charge:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update charge" 
    };
  }
};
