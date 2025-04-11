
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Resident, ResidentApartment } from "./types";

/**
 * Fetches all residents with their associated apartments
 */
export const getResidents = async (): Promise<Resident[]> => {
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

    // Fetch all resident-apartment assignments
    const { data: residentApartments, error: apartmentsError } = await supabase
      .from('resident_apartments')
      .select('resident_id, block_number, apartment_number');

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
