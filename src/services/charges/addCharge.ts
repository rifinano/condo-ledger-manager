
import { supabase } from "@/integrations/supabase/client";
import { AddChargeResult, ChargeFormData } from "./types";

export const addCharge = async (
  charge: ChargeFormData
): Promise<AddChargeResult> => {
  try {
    console.log("Preparing to add charge to database:", charge);
    
    // Create a complete charge object with all required fields
    const chargeRecord = {
      name: charge.name,
      amount: charge.amount,
      description: charge.description || null,
      period: charge.period,
      charge_type: charge.charge_type,
      category: charge.category || "In" // Default to "In" if not specified
    };
    
    console.log("Adding charge with data:", chargeRecord);
    
    // Insert the charge into Supabase
    const { data, error } = await supabase
      .from('charges')
      .insert(chargeRecord)
      .select();

    if (error) {
      console.error("Supabase error adding charge:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log("Charge successfully added to Supabase:", data);
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Exception when adding charge:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add charge" 
    };
  }
};
