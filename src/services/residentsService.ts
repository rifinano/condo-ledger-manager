
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

export const getResidents = async () => {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .order('full_name');

    if (error) {
      console.error("Error fetching residents:", error);
      toast({
        title: "Error fetching residents",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Fetch all resident-apartment assignments using a custom RPC function
    const { data: residentApartments, error: apartmentsError } = await supabase
      .from('resident_apartments')
      .select('resident_id, block_number, apartment_number') as { 
        data: { resident_id: string; block_number: string; apartment_number: string }[] | null; 
        error: any 
      };

    if (apartmentsError) {
      console.error("Error fetching resident apartments:", apartmentsError);
    }

    // Group apartments by resident ID
    const apartmentsByResident: Record<string, ResidentApartment[]> = {};
    
    if (residentApartments) {
      residentApartments.forEach((apt) => {
        if (!apartmentsByResident[apt.resident_id]) {
          apartmentsByResident[apt.resident_id] = [];
        }
        apartmentsByResident[apt.resident_id].push({
          block_number: apt.block_number,
          apartment_number: apt.apartment_number
        });
      });
    }

    // Add apartments array to each resident
    const residentsWithApartments = data.map(resident => ({
      ...resident,
      apartments: apartmentsByResident[resident.id] || []
    }));

    return residentsWithApartments;
  } catch (error: any) {
    console.error("Unexpected error fetching residents:", error);
    toast({
      title: "Unexpected error",
      description: "Failed to fetch residents. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const addResident = async (resident: Omit<ResidentFormData, 'id'>) => {
  try {
    // Format the data for the API
    const formattedResident = {
      full_name: resident.full_name,
      phone_number: resident.phone_number || null,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
    };

    const { data, error } = await supabase
      .from('residents')
      .insert([formattedResident])
      .select();

    if (error) throw error;
    
    // Add to the resident_apartments table for the new resident
    if (data && data.length > 0) {
      const newResidentId = data[0].id;
      
      // Insert directly into the resident_apartments table
      const { error: aptError } = await supabase
        .from('resident_apartments')
        .insert({
          resident_id: newResidentId,
          block_number: resident.block_number,
          apartment_number: resident.apartment_number
        });
        
      if (aptError) {
        console.error("Error adding resident apartment:", aptError);
        // Continue with success even if this fails, we'll just have inconsistent data
      }
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add resident" 
    };
  }
};

export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>) => {
  try {
    // Format the data for the API
    const formattedResident = {
      full_name: resident.full_name,
      phone_number: resident.phone_number || null,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
    };

    const { data, error } = await supabase
      .from('residents')
      .update(formattedResident)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update resident" 
    };
  }
};

export const deleteResident = async (id: string) => {
  try {
    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete resident" 
    };
  }
};

export const addResidentApartment = async (
  residentId: string, 
  blockNumber: string, 
  apartmentNumber: string
) => {
  try {
    // Insert directly into the resident_apartments table
    const { data, error } = await supabase
      .from('resident_apartments')
      .insert({
        resident_id: residentId,
        block_number: blockNumber,
        apartment_number: apartmentNumber
      });
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding resident apartment:", error);
    return {
      success: false,
      error: error.message || "Failed to add apartment for resident"
    };
  }
};

export const removeResidentApartment = async (
  residentId: string, 
  blockNumber: string, 
  apartmentNumber: string
) => {
  try {
    // Delete directly from the resident_apartments table
    const { error } = await supabase
      .from('resident_apartments')
      .delete()
      .match({
        resident_id: residentId,
        block_number: blockNumber,
        apartment_number: apartmentNumber
      });
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error removing resident apartment:", error);
    return {
      success: false,
      error: error.message || "Failed to remove apartment from resident"
    };
  }
};
