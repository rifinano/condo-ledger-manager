
import { supabase } from "@/integrations/supabase/client";
import { AddChargeResult, ChargeFormData } from "./types";
import { Database } from "@/integrations/supabase/types";

export const addCharge = async (
  charge: ChargeFormData
): Promise<AddChargeResult> => {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Authentication error:", userError);
      throw new Error("You must be logged in to add a charge");
    }
    
    // Create a complete charge object with all required fields
    const chargeRecord = {
      name: charge.name,
      amount: parseFloat(charge.amount),
      description: charge.description || null,
      period: charge.period,
      charge_type: charge.chargeType
    };
    
    console.log("Adding charge with data:", chargeRecord);
    
    // Insert the complete charge object into the database
    const { data, error } = await supabase
      .from('charges')
      .insert(chargeRecord)
      .select();

    if (error) {
      console.error("Error adding charge:", error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding charge:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add charge" 
    };
  }
};
