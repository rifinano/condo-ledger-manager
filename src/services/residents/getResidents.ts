
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Resident, ResidentApartment } from "./types";

/**
 * Fetches all residents with their associated apartments
 */
export const getResidents = async (): Promise<Resident[]> => {
  try {
    // Add retry logic for network issues
    const maxRetries = 3;
    let attempt = 0;
    let error = null;
    
    while (attempt < maxRetries) {
      try {
        console.log(`Attempt ${attempt + 1} to fetch residents`);
        
        const { data, error: fetchError } = await supabase
          .from('residents')
          .select('*')
          .order('full_name');
          
        if (fetchError) throw fetchError;
        
        console.log(`Successfully fetched residents: ${data.length}`);
        
        // Fetch all resident-apartment assignments
        const { data: residentApartments, error: apartmentsError } = await supabase
          .from('resident_apartments')
          .select('resident_id, block_number, apartment_number');
          
        if (apartmentsError) {
          console.error("Error fetching resident apartments:", apartmentsError);
          // Continue with just the residents data
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
      } catch (err) {
        console.log(`Resident fetch attempt ${attempt + 1} failed, retrying...`);
        error = err;
        attempt++;
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
      }
    }
    
    // If we've exhausted all retries
    console.error("Error fetching residents after retries:", error);
    throw new Error("Failed to connect to the database after multiple attempts. Please check your internet connection.");
  } catch (error: any) {
    console.error("Error fetching residents:", error);
    // Return empty array instead of throwing, let calling code handle the error state
    return [];
  }
};
